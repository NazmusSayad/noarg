import { NoArgSyntaxError } from '@/constants/errors'
import { describe, expect, it } from 'vitest'
import { parseProgramArguments } from './ast'
import { InternalASTNode } from './ast.type'

const EXPECTED_AST_NODES: { input: string[]; expected: InternalASTNode[] }[] =
  []

const INVALID_ARGUMENTS: string[] = []

describe('parseProgramArguments', () => {
  it.each(EXPECTED_AST_NODES)(
    'parses $input correctly',
    ({ input, expected }) => {
      expect(parseProgramArguments(input)).toEqual(expected)
    }
  )

  it.each(INVALID_ARGUMENTS)('throws for invalid argument: %s', (arg) => {
    expect(() => parseProgramArguments([arg])).toThrow(NoArgSyntaxError)
  })
})
