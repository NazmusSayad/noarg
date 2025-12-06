import {
  NoArgDuplicateOptionValueError,
  NoArgPrimaryArgumentError,
  NoArgTypeError,
  NoArgUnknownArgumentError,
} from '@/lib/errors'
import {
  TypeArraySchema,
  TypeBooleanSchema,
  TypeEnumSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'
import { describe, expect, it, vi } from 'vitest'
import { parseArgsToAST } from '../ast'
import { ProgramParser } from '../program-parser'

describe('ProgramParser subprogram routing', () => {
  it('hands off to nested subprogram and preserves trailing arguments', async () => {
    const nested = new ProgramParser({
      id: 'nested',
      command: 'deploy',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'env', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: { name: 'rest', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })
    const nestedSpy = vi.spyOn(nested, 'run').mockResolvedValue({
      id: 'nested',
      result: {
        options: {},
        primaryArguments: { env: 'prod' },
        optionalArguments: {},
        listArguments: ['tail'],
      },
    })

    const root = new ProgramParser({
      id: 'root',
      command: 'root',
      description: undefined,
      subPrograms: [nested],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['deploy', 'prod', 'tail'])
    const result = await root.run(nodes)

    expect(nestedSpy).toHaveBeenCalledWith(nodes.slice(1))
    expect(result.id).toBe('nested')
    expect(result.result.listArguments).toEqual(['tail'])
  })

  it('processes own options when flag precedes subcommand token', async () => {
    const child = new ProgramParser({
      id: 'child',
      command: 'child',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const childSpy = vi.spyOn(child, 'run')

    const root = new ProgramParser({
      id: 'root',
      command: 'root',
      description: undefined,
      subPrograms: [child],
      primaryArguments: [{ name: 'target', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'verbose', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    })

    const nodes = parseArgsToAST(['--verbose', 'child'])
    const outcome = await root.run(nodes)

    expect(childSpy).not.toHaveBeenCalled()
    expect(outcome.id).toBe('root')
    expect(outcome.result.options.verbose).toBe(1)
    expect(outcome.result.primaryArguments.target).toBe('child')
  })

  it('ignores subprograms when only options and arguments are provided', async () => {
    const other = new ProgramParser({
      id: 'other',
      command: 'other',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const otherSpy = vi.spyOn(other, 'run')

    const root = new ProgramParser({
      id: 'root',
      command: 'root',
      description: undefined,
      subPrograms: [other],
      primaryArguments: [{ name: 'main', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'opt', type: new TypeStringSchema({}) }],
      listArguments: { name: 'extras', type: new TypeStringSchema({}) },
      options: [{ name: 'flag', type: new TypeNoValueSchema({}), aliases: [] }],
      config: {},
    })

    const nodes = parseArgsToAST(['--flag', 'alpha', 'beta', 'gamma'])
    const outcome = await root.run(nodes)

    expect(otherSpy).not.toHaveBeenCalled()
    expect(outcome.result.options.flag).toBe(1)
    expect(outcome.result.primaryArguments.main).toBe('alpha')
    expect(outcome.result.optionalArguments.opt).toBe('beta')
    expect(outcome.result.listArguments).toEqual(['gamma'])
  })
})

describe('ProgramParser option parsing', () => {
  it('parses tuple values provided as comma groups', async () => {
    const parser = new ProgramParser({
      id: 'o1',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'shape',
          type: new TypeTupleSchema({
            schema: [
              new TypeStringSchema({}),
              new TypeNumberSchema({}),
              new TypeBooleanSchema({}),
            ],
          }),
          aliases: [],
        },
      ],
      config: {},
    })

    const result = await parser.run(
      parseArgsToAST(['--shape', 'square,4,true'])
    )

    expect(result.result.options.shape).toEqual(['square', 4, true])
  })

  it('keeps comma text intact when splitting is disabled', async () => {
    const parser = new ProgramParser({
      id: 'o2',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'names',
          type: new TypeArraySchema({ schema: new TypeStringSchema({}) }),
          aliases: [],
        },
      ],
      config: { doNotSplitArgumentsByComma: true },
    })

    const result = await parser.run(
      parseArgsToAST(['--names', 'alpha,beta', '--names', 'gamma'])
    )

    expect(result.result.options.names).toEqual(['alpha,beta', 'gamma'])
  })

  it('throws duplicate when same enum value is supplied twice', async () => {
    const parser = new ProgramParser({
      id: 'o3',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'level',
          type: new TypeEnumSchema({ values: ['low', 'mid', 'high'] }),
          aliases: [],
        },
      ],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['--level', 'mid', '--level=high']))
    ).rejects.toBeInstanceOf(NoArgDuplicateOptionValueError)
  })

  it('requires missing required tuple option', async () => {
    const parser = new ProgramParser({
      id: 'o4',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'coords',
          type: new TypeTupleSchema({
            schema: [new TypeNumberSchema({}), new TypeNumberSchema({})],
          }),
          aliases: [],
          required: true,
        },
      ],
      config: {},
    })

    await expect(parser.run(parseArgsToAST([]))).rejects.toBeInstanceOf(
      NoArgTypeError
    )
  })
})

describe('ProgramParser argument parsing', () => {
  it('raises when no primary arguments are provided', async () => {
    const parser = new ProgramParser({
      id: 'a1',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [
        { name: 'first', type: new TypeStringSchema({}) },
        { name: 'second', type: new TypeNumberSchema({}) },
      ],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(parser.run(parseArgsToAST([]))).rejects.toBeInstanceOf(
      NoArgPrimaryArgumentError
    )
  })

  it('converts optional boolean and collects list after optional slot', async () => {
    const parser = new ProgramParser({
      id: 'a2',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'topic', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'enabled', type: new TypeBooleanSchema({}) }],
      listArguments: { name: 'tags', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })

    const result = await parser.run(
      parseArgsToAST(['news', 'no', 'a', 'b', 'c'])
    )

    expect(result.result.primaryArguments.topic).toBe('news')
    expect(result.result.optionalArguments.enabled).toBe(false)
    expect(result.result.listArguments).toEqual(['a', 'b', 'c'])
  })

  it('rejects extra arguments when list schema is absent', async () => {
    const parser = new ProgramParser({
      id: 'a3',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'main', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'count', type: new TypeNumberSchema({}) }],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['alpha', '2', 'overflow']))
    ).rejects.toBeInstanceOf(NoArgUnknownArgumentError)
  })
})
