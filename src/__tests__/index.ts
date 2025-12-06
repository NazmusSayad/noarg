import { NoArgNodeError } from '@/constants/errors'
import { parseArgsToAST, ProgramParser } from '@/parser'
import { TypeNoValueSchema, TypeStringSchema } from '@/schema'

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
  ],

  config: {
    trailingArguments: true,
  },
})

const parsedArguments = parseArgsToAST([
  '--a=<a-value>',
  '--b',
  '<b-value1>',
  '--a',
  '<a-value2>',
  '--c',
  'arg-1',
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
