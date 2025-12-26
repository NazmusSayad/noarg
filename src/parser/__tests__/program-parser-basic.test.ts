import {
  NoArgDuplicateOptionValueError,
  NoArgPrimaryArgumentError,
  NoArgTypeError,
  NoArgUnknownArgumentError,
} from '@/helpers/errors'
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
  it('routes to nested subprogram and forwards short-flag options', async () => {
    const nested = new ProgramParser({
      id: 'nested',
      command: 'deploy',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'env', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: { name: 'rest', type: new TypeStringSchema({}) },
      options: [
        { name: 'debug', type: new TypeNoValueSchema({}), aliases: ['d'] },
      ],
      config: {},
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

    const result = await root.run(
      parseArgsToAST(['deploy', '-d', 'prod', 'tail'])
    )

    expect(result.id).toBe('nested')
    expect(result.result.options.debug).toBe(1)
    expect(result.result.primaryArguments.env).toBe('prod')
    expect(result.result.listArguments).toEqual(['tail'])
  })

  it('stops routing when bundled aliases precede subcommand', async () => {
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
        { name: 'verbose', type: new TypeNoValueSchema({}), aliases: ['v'] },
        { name: 'check', type: new TypeNoValueSchema({}), aliases: ['c'] },
      ],
      config: {},
    })

    const nodes = parseArgsToAST(['-vc', 'child'])
    const outcome = await root.run(nodes)

    expect(childSpy).not.toHaveBeenCalled()
    expect(outcome.id).toBe('root')
    expect(outcome.result.options.verbose).toBe(1)
    expect(outcome.result.options.check).toBe(1)
    expect(outcome.result.primaryArguments.target).toBe('child')
  })

  it('matches exact subcommand when prefix overlaps', async () => {
    const short = new ProgramParser({
      id: 'short',
      command: 'do',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const shortSpy = vi.spyOn(short, 'run')

    const long = new ProgramParser({
      id: 'long',
      command: 'do-more',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'value', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const longSpy = vi.spyOn(long, 'run')

    const root = new ProgramParser({
      id: 'root',
      command: 'root',
      description: undefined,
      subPrograms: [short, long],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['do-more', 'payload'])
    const outcome = await root.run(nodes)

    expect(shortSpy).not.toHaveBeenCalled()
    expect(longSpy).toHaveBeenCalledWith(nodes.slice(1))
    expect(outcome.id).toBe('long')
    expect(outcome.result.primaryArguments.value).toBe('payload')
  })
})

describe('ProgramParser option parsing', () => {
  it('parses tuple spread across comma and repeated flags', async () => {
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
      parseArgsToAST(['--shape', 'square,4', '--shape', 'true'])
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

  it('rejects tuple option when provided with too few elements', async () => {
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

    await expect(
      parser.run(parseArgsToAST(['--coords', '10']))
    ).rejects.toBeInstanceOf(NoArgTypeError)
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
