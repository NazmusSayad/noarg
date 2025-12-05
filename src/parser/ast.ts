import { NoArgSyntaxError } from '@/constants/errors'
import { InternalASTNode } from './ast.type'

const OPTION_REGEX = /^(?<i>--?)(?<k>[^=]+)(=(?<v>.+)?)?$/
const OPTION_VALID_KEY_REGEX = /^([a-zA-Z0-9-]+)?[a-zA-Z0-9]$/

export function parseProgramArguments(args: string[]): InternalASTNode[] {
  return args.map((arg, index) => {
    if (arg.startsWith('-')) {
      const match = arg.match(OPTION_REGEX)
      if (!match) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      const { i, k, v } = match?.groups ?? {}
      if (!k) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      if (!OPTION_VALID_KEY_REGEX.test(k)) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      if (k.startsWith('-')) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      return {
        id: index.toString(),
        isAlias: i === '-',
        type: 'option',

        arg,
        key: k,
        value: v ?? null,
      }
    }

    return {
      id: index.toString(),
      type: 'argument',
      arg,
    }
  })
}
