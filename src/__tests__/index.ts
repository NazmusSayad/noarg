import { NoArgNodeError } from '@/lib/errors'
import { parseArgsToAST, ProgramParser } from '@/parser'
import {
  TypeBooleanSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypeStringSchema,
} from '@/schema'

const programParser = new ProgramParser({
  id: '0',
  command: '#',
  description: 'npm is a package manager for Node.js',

  subPrograms: [],

  primaryArguments: [],

  optionalArguments: [],

  listArguments: null,

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
      name: 'verbose',
      type: new TypeNoValueSchema({}),
      aliases: ['v'],
    },
  ],

  config: {
    trailingArguments: true,
  },
})

const parsedArguments = parseArgsToAST([
  '--string',
  'test',

  '--number',
  '123',

  '--boolean',
  'yes',
])

programParser
  .run(parsedArguments)

  .then(([id, result]) => {
    // console.log(`Program ${id} parsed successfully`)
    // console.log(result)
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
