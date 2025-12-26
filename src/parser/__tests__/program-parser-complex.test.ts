import {
  NoArgClientError,
  NoArgDuplicateOptionValueError,
  NoArgEmptyOptionValueError,
  NoArgPrimaryArgumentError,
  NoArgTypeError,
  NoArgUnknownArgumentError,
  NoArgUnknownOptionError,
} from '@/helpers/errors'
import {
  TypeArraySchema,
  TypeBooleanSchema,
  TypeEnumSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypePrimitiveUnionSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'
import { describe, expect, it, vi } from 'vitest'
import { parseArgsToAST } from '../ast'
import { ProgramParser } from '../program-parser'

describe('ProgramParser routing', () => {
  it('routes to direct subprogram and returns its id', async () => {
    const sub1 = new ProgramParser({
      id: 'sub-1',
      command: 'sub1',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const subSpy = vi.spyOn(sub1, 'run').mockResolvedValue({
      id: 'sub1',
      result: {
        options: {},
        primaryArguments: { arg1: 'v1' },
        optionalArguments: {},
        listArguments: [],
      },
    })

    const root = new ProgramParser({
      id: 'root-1',
      command: 'root',
      description: undefined,
      subPrograms: [sub1],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['sub1', 'v1'])
    const result = await root.run(nodes)

    expect(subSpy).toHaveBeenCalledWith(nodes.slice(1))
    expect(result.id).toBe('sub1')
    expect(result.result.primaryArguments.arg1).toBe('v1')
  })

  it('routes to nested subprogram and keeps trailing args', async () => {
    const sub2 = new ProgramParser({
      id: 'sub-2',
      command: 'sub2',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: { name: 'list1', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })
    const sub1 = new ProgramParser({
      id: 'sub-1',
      command: 'sub1',
      description: undefined,
      subPrograms: [sub2],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const subSpy = vi.spyOn(sub2, 'run').mockResolvedValue({
      id: 'sub2',
      result: {
        options: {},
        primaryArguments: { arg1: 'x' },
        optionalArguments: {},
        listArguments: ['y', 'z'],
      },
    })

    const root = new ProgramParser({
      id: 'root-2',
      command: 'root',
      description: undefined,
      subPrograms: [sub1],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['sub1', 'sub2', 'x', 'y', 'z'])
    const result = await root.run(nodes)

    expect(subSpy).toHaveBeenCalledWith(nodes.slice(2))
    expect(result.id).toBe('sub2')
    expect(result.result.listArguments).toEqual(['y', 'z'])
  })

  it('routes when command appears after leading argument', async () => {
    const sub1 = new ProgramParser({
      id: 'sub-3',
      command: 'sub1',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const subSpy = vi.spyOn(sub1, 'run').mockResolvedValue({
      id: 'sub1',
      result: {
        options: {},
        primaryArguments: { arg1: 'late' },
        optionalArguments: {},
        listArguments: [],
      },
    })

    const root = new ProgramParser({
      id: 'root-3',
      command: 'root',
      description: undefined,
      subPrograms: [sub1],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['skip', 'sub1', 'late'])
    const result = await root.run(nodes)

    expect(subSpy).toHaveBeenCalledWith(nodes.slice(2))
    expect(result.id).toBe('sub1')
    expect(result.result.primaryArguments.arg1).toBe('late')
  })

  it('keeps root parsing when option stops routing scan', async () => {
    const sub1 = new ProgramParser({
      id: 'sub-4',
      command: 'sub1',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const subSpy = vi.spyOn(sub1, 'run')

    const root = new ProgramParser({
      id: 'root-4',
      command: 'root',
      description: undefined,
      subPrograms: [sub1],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [{ name: 'opt1', type: new TypeNoValueSchema({}), aliases: [] }],
      config: {},
    })

    const nodes = parseArgsToAST(['--opt1', 'sub1'])
    const result = await root.run(nodes)

    expect(subSpy).not.toHaveBeenCalled()
    expect(result.id).toBe('root-4')
    expect(result.result.options.opt1).toBe(1)
    expect(result.result.primaryArguments.arg1).toBe('sub1')
  })

  it('routes to subprogram and forwards options after command', async () => {
    const sub1 = new ProgramParser({
      id: 'sub-6',
      command: 'sub1',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [{ name: 'opt1', type: new TypeStringSchema({}), aliases: [] }],
      config: {},
    })
    const subSpy = vi.spyOn(sub1, 'run').mockResolvedValue({
      id: 'sub1',
      result: {
        options: { opt1: 'v' },
        primaryArguments: {},
        optionalArguments: {},
        listArguments: [],
      },
    })

    const root = new ProgramParser({
      id: 'root-6',
      command: 'root',
      description: undefined,
      subPrograms: [sub1],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['sub1', '--opt1', 'v'])
    const result = await root.run(nodes)

    expect(subSpy).toHaveBeenCalledWith(nodes.slice(1))
    expect(result.result.options.opt1).toBe('v')
  })

  it('prefers matching subprogram over root parsing when found', async () => {
    const sub1 = new ProgramParser({
      id: 'sub-7',
      command: 'sub1',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const subSpy = vi.spyOn(sub1, 'run').mockResolvedValue({
      id: 'sub1',
      result: {
        options: {},
        primaryArguments: { arg1: 'value' },
        optionalArguments: {},
        listArguments: [],
      },
    })

    const root = new ProgramParser({
      id: 'root-7',
      command: 'root',
      description: undefined,
      subPrograms: [sub1],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['sub1', 'value'])
    const result = await root.run(nodes)

    expect(subSpy).toHaveBeenCalled()
    expect(result.id).toBe('sub1')
    expect(result.result.primaryArguments.arg1).toBe('value')
  })

  it('returns root result when no subprogram matches', async () => {
    const sub1 = new ProgramParser({
      id: 'sub-8',
      command: 'sub1',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const root = new ProgramParser({
      id: 'root-8',
      command: 'root',
      description: undefined,
      subPrograms: [sub1],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'arg2', type: new TypeStringSchema({}) }],
      listArguments: { name: 'list1', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })

    const result = await root.run(parseArgsToAST(['main', 'opt', 'rest']))

    expect(result.id).toBe('root-8')
    expect(result.result.primaryArguments.arg1).toBe('main')
    expect(result.result.optionalArguments.arg2).toBe('opt')
    expect(result.result.listArguments).toEqual(['rest'])
  })

  it('routes to second subprogram when names differ', async () => {
    const sub1 = new ProgramParser({
      id: 'sub-9a',
      command: 'sub1',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const sub2 = new ProgramParser({
      id: 'sub-9b',
      command: 'sub2',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const subSpy = vi.spyOn(sub2, 'run').mockResolvedValue({
      id: 'sub2',
      result: {
        options: {},
        primaryArguments: { arg1: 'choose' },
        optionalArguments: {},
        listArguments: [],
      },
    })

    const root = new ProgramParser({
      id: 'root-9',
      command: 'root',
      description: undefined,
      subPrograms: [sub1, sub2],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['sub2', 'choose'])
    const result = await root.run(nodes)

    expect(subSpy).toHaveBeenCalled()
    expect(result.id).toBe('sub2')
    expect(result.result.primaryArguments.arg1).toBe('choose')
  })

  it('routes to nested child when subcommand token repeats later', async () => {
    const sub2a = new ProgramParser({
      id: 'sub-10b',
      command: 'sub2a',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const sub2 = new ProgramParser({
      id: 'sub-10a',
      command: 'sub2',
      description: undefined,
      subPrograms: [sub2a],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const subSpy = vi.spyOn(sub2a, 'run').mockResolvedValue({
      id: 'sub2a',
      result: {
        options: {},
        primaryArguments: { arg1: 'deep' },
        optionalArguments: {},
        listArguments: [],
      },
    })

    const root = new ProgramParser({
      id: 'root-10',
      command: 'root',
      description: undefined,
      subPrograms: [sub2],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['ignore', 'sub2', 'sub2a', 'deep'])
    const result = await root.run(nodes)

    expect(subSpy).toHaveBeenCalledWith(nodes.slice(3))
    expect(result.id).toBe('sub2a')
    expect(result.result.primaryArguments.arg1).toBe('deep')
  })
})

describe('ProgramParser option successes', () => {
  it('parses string option provided inline', async () => {
    const parser = new ProgramParser({
      id: 'opt-1',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [{ name: 'opt1', type: new TypeStringSchema({}), aliases: [] }],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['--opt1=value']))

    expect(result.result.options.opt1).toBe('value')
  })

  it('parses number option supplied through alias', async () => {
    const parser = new ProgramParser({
      id: 'opt-2',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeNumberSchema({}),
          aliases: ['n'],
        },
      ],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['-n', '5']))

    expect(result.result.options.opt1).toBe(5)
  })

  it('parses boolean option text false', async () => {
    const parser = new ProgramParser({
      id: 'opt-3',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeBooleanSchema({}),
          aliases: [],
        },
      ],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['--opt1', 'false']))

    expect(result.result.options.opt1).toBe(false)
  })

  it('parses enum option through equals syntax', async () => {
    const parser = new ProgramParser({
      id: 'opt-4',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeEnumSchema({ values: ['low', 'high'] }),
          aliases: [],
        },
      ],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['--opt1=high']))

    expect(result.result.options.opt1).toBe('high')
  })

  it('splits comma separated array entries', async () => {
    const parser = new ProgramParser({
      id: 'opt-5',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeArraySchema({ schema: new TypeStringSchema({}) }),
          aliases: [],
        },
      ],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['--opt1', 'a,b,c']))

    expect(result.result.options.opt1).toEqual(['a', 'b', 'c'])
  })

  it('collects repeated array values across flags', async () => {
    const parser = new ProgramParser({
      id: 'opt-6',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeArraySchema({ schema: new TypeNumberSchema({}) }),
          aliases: [],
        },
      ],
      config: {},
    })

    const result = await parser.run(
      parseArgsToAST(['--opt1', '1', '--opt1', '2'])
    )

    expect(result.result.options.opt1).toEqual([1, 2])
  })

  it('parses tuple option from sequential nodes', async () => {
    const parser = new ProgramParser({
      id: 'opt-7',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeTupleSchema({
            schema: [new TypeStringSchema({}), new TypeNumberSchema({})],
          }),
          aliases: [],
        },
      ],
      config: {},
    })

    const result = await parser.run(
      parseArgsToAST(['--opt1', 'name', '--opt1', '3'])
    )

    expect(result.result.options.opt1).toEqual(['name', 3])
  })

  it('parses tuple option with comma expansion', async () => {
    const parser = new ProgramParser({
      id: 'opt-8',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeTupleSchema({
            schema: [
              new TypeStringSchema({}),
              new TypeBooleanSchema({}),
              new TypeNumberSchema({}),
            ],
          }),
          aliases: [],
        },
      ],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['--opt1', 'yes,true,4']))

    expect(result.result.options.opt1).toEqual(['yes', true, 4])
  })

  it('parses primitive union option selecting number', async () => {
    const parser = new ProgramParser({
      id: 'opt-9',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypePrimitiveUnionSchema({
            types: [
              new TypeBooleanSchema({}),
              new TypeNumberSchema({}),
              new TypeStringSchema({}),
            ],
          }),
          aliases: [],
        },
      ],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['--opt1', '10']))

    expect(result.result.options.opt1).toBe(10)
  })

  it('counts repeated no-value option keys', async () => {
    const parser = new ProgramParser({
      id: 'opt-10',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'opt1', type: new TypeNoValueSchema({}), aliases: ['v'] },
      ],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['-vvv']))

    expect(result.result.options.opt1).toBe(3)
  })
})

describe('ProgramParser option errors', () => {
  it('throws for unknown option', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-1',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(parser.run(parseArgsToAST(['--opt1']))).rejects.toBeInstanceOf(
      NoArgUnknownOptionError
    )
  })

  it('requires missing string option', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-2',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeStringSchema({}),
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

  it('rejects duplicate string option value entries', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-3',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [{ name: 'opt1', type: new TypeStringSchema({}), aliases: [] }],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['--opt1', 'a', '--opt1', 'b']))
    ).rejects.toBeInstanceOf(NoArgDuplicateOptionValueError)
  })

  it('errors when option value missing before another option', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-4',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'opt1', type: new TypeStringSchema({}), aliases: [] },
        { name: 'opt2', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['--opt1', '--opt2']))
    ).rejects.toBeInstanceOf(NoArgEmptyOptionValueError)
  })

  it('errors when option expects value but input ends', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-5',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [{ name: 'opt1', type: new TypeNumberSchema({}), aliases: [] }],
      config: {},
    })

    await expect(parser.run(parseArgsToAST(['--opt1']))).rejects.toBeInstanceOf(
      NoArgClientError
    )
  })

  it('rejects grouped alias with unknown member', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-6',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'opt1', type: new TypeNoValueSchema({}), aliases: ['a'] },
        { name: 'opt2', type: new TypeNoValueSchema({}), aliases: ['b'] },
      ],
      config: {},
    })

    await expect(parser.run(parseArgsToAST(['-ac']))).rejects.toBeInstanceOf(
      NoArgUnknownOptionError
    )
  })

  it('rejects invalid number option value', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-7',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [{ name: 'opt1', type: new TypeNumberSchema({}), aliases: [] }],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['--opt1', 'nan']))
    ).rejects.toBeInstanceOf(NoArgTypeError)
  })

  it('requires tuple option when marked required', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-8',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeTupleSchema({
            schema: [new TypeStringSchema({}), new TypeStringSchema({})],
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

  it('requires array option when marked required', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-9',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        {
          name: 'opt1',
          type: new TypeArraySchema({ schema: new TypeStringSchema({}) }),
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

  it('rejects duplicate number option keys', async () => {
    const parser = new ProgramParser({
      id: 'err-opt-10',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [{ name: 'opt1', type: new TypeNumberSchema({}), aliases: [] }],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['--opt1', '1', '--opt1', '2']))
    ).rejects.toBeInstanceOf(NoArgDuplicateOptionValueError)
  })
})

describe('ProgramParser argument successes', () => {
  it('parses two primary arguments', async () => {
    const parser = new ProgramParser({
      id: 'arg-1',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [
        { name: 'arg1', type: new TypeStringSchema({}) },
        { name: 'arg2', type: new TypeNumberSchema({}) },
      ],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['alpha', '2']))

    expect(result.result.primaryArguments.arg1).toBe('alpha')
    expect(result.result.primaryArguments.arg2).toBe(2)
  })

  it('parses optional boolean argument', async () => {
    const parser = new ProgramParser({
      id: 'arg-2',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'arg2', type: new TypeBooleanSchema({}) }],
      listArguments: null,
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['topic', 'true']))

    expect(result.result.optionalArguments.arg2).toBe(true)
  })

  it('omits optional argument when absent', async () => {
    const parser = new ProgramParser({
      id: 'arg-3',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'arg2', type: new TypeNumberSchema({}) }],
      listArguments: null,
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['only']))

    expect(result.result.optionalArguments.arg2).toBeUndefined()
  })

  it('collects list arguments as strings', async () => {
    const parser = new ProgramParser({
      id: 'arg-4',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: { name: 'list1', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['base', 'a', 'b']))

    expect(result.result.primaryArguments.arg1).toBe('base')
    expect(result.result.listArguments).toEqual(['a', 'b'])
  })

  it('collects numeric list arguments', async () => {
    const parser = new ProgramParser({
      id: 'arg-5',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'arg2', type: new TypeStringSchema({}) }],
      listArguments: { name: 'list1', type: new TypeNumberSchema({}) },
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['main', 'side', '1', '2']))

    expect(result.result.optionalArguments.arg2).toBe('side')
    expect(result.result.listArguments).toEqual([1, 2])
  })

  it('parses optional enum argument', async () => {
    const parser = new ProgramParser({
      id: 'arg-6',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [
        { name: 'arg2', type: new TypeEnumSchema({ values: ['a', 'b'] }) },
      ],
      listArguments: null,
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['base', 'b']))

    expect(result.result.optionalArguments.arg2).toBe('b')
  })

  it('handles only list arguments with no option schema', async () => {
    const parser = new ProgramParser({
      id: 'arg-7',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: { name: 'list1', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['x', 'y']))

    expect(result.result.listArguments).toEqual(['x', 'y'])
  })

  it('parses optional primitive union argument', async () => {
    const parser = new ProgramParser({
      id: 'arg-8',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [
        {
          name: 'arg2',
          type: new TypePrimitiveUnionSchema({
            types: [new TypeNumberSchema({}), new TypeBooleanSchema({})],
          }),
        },
      ],
      listArguments: null,
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['lead', '1']))

    expect(result.result.optionalArguments.arg2).toBe(1)
  })

  it('allows empty list when none provided', async () => {
    const parser = new ProgramParser({
      id: 'arg-9',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'arg2', type: new TypeBooleanSchema({}) }],
      listArguments: { name: 'list1', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })

    const result = await parser.run(parseArgsToAST(['item', 'false']))

    expect(result.result.listArguments).toEqual([])
  })

  it('parses primitive union list argument values', async () => {
    const parser = new ProgramParser({
      id: 'arg-10',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: {
        name: 'list1',
        type: new TypePrimitiveUnionSchema({
          types: [new TypeBooleanSchema({}), new TypeNumberSchema({})],
        }),
      },
      options: [],
      config: {},
    })

    const result = await parser.run(
      parseArgsToAST(['root', 'true', '3', 'false'])
    )

    expect(result.result.listArguments).toEqual([true, 3, false])
  })
})

describe('ProgramParser argument errors', () => {
  it('throws when primary argument missing', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-1',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(parser.run(parseArgsToAST([]))).rejects.toBeInstanceOf(
      NoArgPrimaryArgumentError
    )
  })

  it('throws when second primary missing', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-2',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [
        { name: 'arg1', type: new TypeStringSchema({}) },
        { name: 'arg2', type: new TypeNumberSchema({}) },
      ],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(parser.run(parseArgsToAST(['only']))).rejects.toBeInstanceOf(
      NoArgPrimaryArgumentError
    )
  })

  it('rejects extra argument when list schema absent', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-3',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'arg2', type: new TypeNumberSchema({}) }],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['main', '2', 'extra']))
    ).rejects.toBeInstanceOf(NoArgUnknownArgumentError)
  })

  it('rejects invalid number primary', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-4',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [
        { name: 'arg1', type: new TypeNumberSchema({}) },
        { name: 'arg2', type: new TypeStringSchema({}) },
      ],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['nan', 'ok']))
    ).rejects.toBeInstanceOf(NoArgTypeError)
  })

  it('rejects invalid optional enum value', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-5',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [
        { name: 'arg2', type: new TypeEnumSchema({ values: ['x', 'y'] }) },
      ],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['base', 'z']))
    ).rejects.toBeInstanceOf(NoArgTypeError)
  })

  it('rejects extra arguments after optional when list missing', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-6',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'arg2', type: new TypeBooleanSchema({}) }],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['base', 'true', 'extra']))
    ).rejects.toBeInstanceOf(NoArgUnknownArgumentError)
  })

  it('rejects invalid list entry against schema', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-7',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: { name: 'list1', type: new TypeNumberSchema({}) },
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['root', 'a']))
    ).rejects.toBeInstanceOf(NoArgTypeError)
  })

  it('throws when optional argument value invalid', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-8',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'arg2', type: new TypeNumberSchema({}) }],
      listArguments: { name: 'list1', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['root', 'bad', 'tail']))
    ).rejects.toBeInstanceOf(NoArgTypeError)
  })

  it('raises when first primary missing but optional provided', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-9',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [
        { name: 'arg1', type: new TypeStringSchema({}) },
        { name: 'arg2', type: new TypeBooleanSchema({}) },
      ],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(parser.run(parseArgsToAST(['true']))).rejects.toBeInstanceOf(
      NoArgPrimaryArgumentError
    )
  })

  it('rejects argument overflow when list missing and optional absent', async () => {
    const parser = new ProgramParser({
      id: 'arg-err-10',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'arg1', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['main', 'extra']))
    ).rejects.toBeInstanceOf(NoArgUnknownArgumentError)
  })
})
