import { NoArgValidationError } from '@/constants/errors'
import { parseProgramArguments, ProgramParser } from '@/parser'
import { TypeNoValueSchema, TypeStringSchema } from '@/schema'

const programParser = new ProgramParser({
  id: '0',
  command: '#',
  description: 'npm is a package manager for Node.js',

  subPrograms: [],

  primaryArguments: [],

  optionalArguments: [],

  listArguments: null,

  flags: [
    {
      name: 'a',
      type: new TypeStringSchema(),
      aliases: ['a'],
    },
    {
      name: 'b',
      type: new TypeStringSchema(),
      aliases: ['b'],
    },
    {
      name: 'c',
      type: new TypeNoValueSchema(),
      aliases: ['c'],
    },
    {
      name: 'd',
      type: new TypeNoValueSchema(),
      aliases: ['d'],
    },
  ],

  config: {
    trailingArguments: true,
  },
})

const parsedArguments = parseProgramArguments([
  '--a',
  '<a-value>',
  '--b',
  '<b-value>',
  '--c',
  'arg-1',
  '-cd',
])

programParser
  .run(parsedArguments)

  .then(([id, result]) => {
    // console.log(`Program ${id} parsed successfully`)
    // console.log(result)
  })

  .catch((err) => {
    if (err instanceof NoArgValidationError) {
      const colorizedArgs = parsedArguments.map((arg) => {
        if (arg.id === err.id) {
          return `\x1b[31m${arg.arg}\x1b[0m`
        }

        return arg.arg
      })

      console.error(`${colorizedArgs.join(' ')}`)
      console.error(`\x1b[31m${err.message}\x1b[0m`)
    } else {
      console.error(err)
    }
  })
