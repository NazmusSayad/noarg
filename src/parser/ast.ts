import { NoArgSyntaxError } from '@/helpers/errors'
import { InternalASTNode } from './ast.type'

const OPTION_REGEX = /^(?<i>--?)(?<k>[^=]+)(=(?<v>.+)?)?$/
const OPTION_VALID_KEY_REGEX = /^([a-zA-Z0-9-]+)?[a-zA-Z0-9]$/

export function parseArgsToAST(args: string[]): InternalASTNode[] {
  return args.map((raw, index) => {
    if (raw.startsWith('-')) {
      const match = raw.match(OPTION_REGEX)
      if (!match) {
        throw new NoArgSyntaxError(`Invalid argument: ${raw}`)
      }

      const { i, k, v } = match?.groups ?? {}
      if (!k) {
        throw new NoArgSyntaxError(`Invalid argument: ${raw}`)
      }

      if (!OPTION_VALID_KEY_REGEX.test(k)) {
        throw new NoArgSyntaxError(`Invalid argument: ${raw}`)
      }

      if (k.startsWith('-')) {
        throw new NoArgSyntaxError(`Invalid argument: ${raw}`)
      }

      return {
        raw,
        index,

        type: 'option',
        isAlias: i === '-',

        key: k,
        value: v ?? null,
      }
    }

    return {
      raw,
      index,

      type: 'argument',
    }
  })
}
