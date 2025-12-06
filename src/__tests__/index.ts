import { NoArgNodeError } from '@/lib/errors'
import { parseArgsToAST, ProgramParser } from '@/parser'
import {
  TypeArraySchema,
  TypeBooleanSchema,
  TypeEnumSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'

const programParser = new ProgramParser({
  id: '0',
  command: '#',
  description: 'npm is a package manager for Node.js',

  subPrograms: [],

  primaryArguments: [
    {
      name: 'arg1',
      type: new TypeStringSchema({}),
    },
  ],

  optionalArguments: [
    {
      name: 'arg2',
      type: new TypeStringSchema({}),
    },
  ],

  listArguments: {
    name: 'list',
    type: new TypeStringSchema({}),
  },

  options: [
    {
      name: 'string',
      type: new TypeStringSchema({}),
      aliases: [],
    },

    {
      name: 'number',
      type: new TypeNumberSchema({}),
      aliases: [],
    },

    {
      name: 'boolean',
      type: new TypeBooleanSchema({}),
      aliases: [],
    },

    {
      name: 'enum',
      type: new TypeEnumSchema({
        values: ['test', '123', 'true', 'false'],
      }),
      aliases: [],
    },

    {
      name: 'array',
      type: new TypeArraySchema({
        schema: new TypeStringSchema({}),
      }),
      aliases: [],
    },

    {
      name: 'tuple',
      type: new TypeTupleSchema({
        schema: [
          new TypeStringSchema({}),
          new TypeNumberSchema({}),
          new TypeBooleanSchema({}),
        ],
      }),
      aliases: [],
    },

    {
      name: 'verbose',
      type: new TypeNoValueSchema({}),
      aliases: ['v'],
    },

    {
      name: 'message',
      type: new TypeStringSchema({}),
      aliases: ['m'],
    },
  ],

  config: {},
})

const parsedArguments = parseArgsToAST([
  '--string',
  'test',

  '--number',
  '123',

  '--boolean',
  'yes',

  '--array',
  'test1,test2',

  '--array',
  '123',

  '--array',
  'true',

  '--tuple',
  'test,123,true',

  '--enum',
  'false',

  'argument-1',
  'argument-2',
  'argument-3',
  'argument-4',
  'argument-5',
])

programParser
  .run(parsedArguments)

  .then(({ result }) => {
    console.dir(result, { depth: null })
  })

  .catch((err) => {
    if (err instanceof NoArgNodeError) {
      const colorizedArgs = parsedArguments.map((arg) => {
        if (arg.index === err.index) {
          return `\x1b[31m${arg.raw}\x1b[0m`
        }

        return arg.raw
      })

      console.error(`${colorizedArgs.join(' ')}`)
      console.error(`\x1b[31m${err.message}\x1b[0m`)
    } else {
      console.error(err)
    }
  })
