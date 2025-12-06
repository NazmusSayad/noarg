import { NoArgNodeError } from '@/lib/errors'
import { parseArgsToAST, ProgramParser } from '@/parser'
import { TypeStringSchema } from '@/schema'

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
      name: 'message',
      type: new TypeStringSchema({}),
      aliases: ['m'],
    },
  ],

  config: {},
})

const parsedArguments = parseArgsToAST(['--message', 'b', '-m', 'a'])

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
