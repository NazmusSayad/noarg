import { NoArgSyntaxError } from '@/constants/errors'
import { InternalASTNode } from './ast.type'

const FLAG_REGEX = /^(--?)(?<k>[^=]+)(=(?<v>.+)?)?$/
const VALID_KEY_REGEX = /^([a-zA-Z0-9-]+)?[a-zA-Z0-9]$/

export function parseProgramArguments(args: string[]): InternalASTNode[] {
  return args.map((arg, index) => {
    if (arg.startsWith('-')) {
      const match = arg.match(FLAG_REGEX)
      if (!match) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      const { k, v } = match?.groups ?? {}
      if (!k) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      if (!VALID_KEY_REGEX.test(k)) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      if (k.startsWith('-')) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      return {
        id: index.toString(),
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
