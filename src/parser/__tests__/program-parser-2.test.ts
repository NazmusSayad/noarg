import { NoArgDuplicateOptionValueError, NoArgTypeError } from '@/lib/errors'
import {
  TypeArraySchema,
  TypeBooleanSchema,
  TypeEnumSchema,
  TypeNumberSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'
import { describe, expect, it } from 'vitest'
import { parseArgsToAST } from '../ast'
import { ProgramParser } from '../program-parser'

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
