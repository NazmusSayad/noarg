import { NoArgSyntaxError } from '@/constants/errors'
import { InternalASTNode } from './ast.type'

const FLAG_REGEX = /^(--?)(?<key>[^=]+)(=(?<value>.+)?)?$/
const VALID_KEY_REGEX = /^([a-zA-Z0-9-]+)?[a-zA-Z0-9]$/

export function parseProgramArguments(args: string[]): InternalASTNode[] {
  return args.map((arg) => {
    if (arg.startsWith('-')) {
      const match = arg.match(FLAG_REGEX)
      if (!match) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      const { key, value } = match?.groups ?? {}
      if (!key) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      if (!VALID_KEY_REGEX.test(key)) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      if (key.startsWith('-')) {
        throw new NoArgSyntaxError(`Invalid argument: ${arg}`)
      }

      return {
        name: arg,
        type: 'option',
        content: value ? { key, value } : null,
      }
    }

    return {
      name: arg,
      type: 'argument',
      content: null,
    }
  })
}
