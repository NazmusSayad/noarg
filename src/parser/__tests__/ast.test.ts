import { NoArgSyntaxError } from '@/helpers/errors'
import { describe, expect, it } from 'vitest'
import { parseArgsToAST } from '../ast'
import { InternalASTNode } from '../ast.type'

const EXPECTED_AST_NODES: { input: string[]; expected: InternalASTNode[] }[] = [
  {
    input: ['file.txt', '--verbose', 'notes'],
    expected: [
      {
        index: 0,
        raw: 'file.txt',
        type: 'argument',
      },
      {
        index: 1,
        raw: '--verbose',
        type: 'option',
        isAlias: false,
        key: 'verbose',
        value: null,
      },
      {
        index: 2,
        raw: 'notes',
        type: 'argument',
      },
    ],
  },
  {
    input: ['-a', '--beta=2', '-c=see', 'z'],
    expected: [
      {
        index: 0,
        raw: '-a',
        type: 'option',
        isAlias: true,
        key: 'a',
        value: null,
      },
      {
        index: 1,
        raw: '--beta=2',
        type: 'option',
        isAlias: false,
        key: 'beta',
        value: '2',
      },
      {
        index: 2,
        raw: '-c=see',
        type: 'option',
        isAlias: true,
        key: 'c',
        value: 'see',
      },
      {
        index: 3,
        raw: 'z',
        type: 'argument',
      },
    ],
  },
  {
    input: [
      '--mix-9=value-123_+=[]',
      '--chain=a=b=c',
      '--empty=',
      'ARG',
      '-x',
      '--Path=C:\\temp\\file.txt',
    ],
    expected: [
      {
        index: 0,
        raw: '--mix-9=value-123_+=[]',
        type: 'option',
        isAlias: false,
        key: 'mix-9',
        value: 'value-123_+=[]',
      },
      {
        index: 1,
        raw: '--chain=a=b=c',
        type: 'option',
        isAlias: false,
        key: 'chain',
        value: 'a=b=c',
      },
      {
        index: 2,
        raw: '--empty=',
        type: 'option',
        isAlias: false,
        key: 'empty',
        value: null,
      },
      {
        index: 3,
        raw: 'ARG',
        type: 'argument',
      },
      {
        index: 4,
        raw: '-x',
        type: 'option',
        isAlias: true,
        key: 'x',
        value: null,
      },
      {
        index: 5,
        raw: '--Path=C:\\temp\\file.txt',
        type: 'option',
        isAlias: false,
        key: 'Path',
        value: 'C:\\temp\\file.txt',
      },
    ],
  },
  {
    input: [
      '--multi-part-flag',
      'arg-1',
      '--numbers-123',
      '-Z=99',
      '--caps-lock=ON',
      'final',
    ],
    expected: [
      {
        index: 0,
        raw: '--multi-part-flag',
        type: 'option',
        isAlias: false,
        key: 'multi-part-flag',
        value: null,
      },
      {
        index: 1,
        raw: 'arg-1',
        type: 'argument',
      },
      {
        index: 2,
        raw: '--numbers-123',
        type: 'option',
        isAlias: false,
        key: 'numbers-123',
        value: null,
      },
      {
        index: 3,
        raw: '-Z=99',
        type: 'option',
        isAlias: true,
        key: 'Z',
        value: '99',
      },
      {
        index: 4,
        raw: '--caps-lock=ON',
        type: 'option',
        isAlias: false,
        key: 'caps-lock',
        value: 'ON',
      },
      {
        index: 5,
        raw: 'final',
        type: 'argument',
      },
    ],
  },
  {
    input: [
      '--url=https://example.com/path?query=1&list[]=2',
      '-0==',
      'plain.txt',
      '--mixCase=LoWeR-UPPER-123.!',
      '--dash-only',
      '-nine9',
      'dots.and-dashes',
    ],
    expected: [
      {
        index: 0,
        raw: '--url=https://example.com/path?query=1&list[]=2',
        type: 'option',
        isAlias: false,
        key: 'url',
        value: 'https://example.com/path?query=1&list[]=2',
      },
      {
        index: 1,
        raw: '-0==',
        type: 'option',
        isAlias: true,
        key: '0',
        value: '=',
      },
      {
        index: 2,
        raw: 'plain.txt',
        type: 'argument',
      },
      {
        index: 3,
        raw: '--mixCase=LoWeR-UPPER-123.!',
        type: 'option',
        isAlias: false,
        key: 'mixCase',
        value: 'LoWeR-UPPER-123.!',
      },
      {
        index: 4,
        raw: '--dash-only',
        type: 'option',
        isAlias: false,
        key: 'dash-only',
        value: null,
      },
      {
        index: 5,
        raw: '-nine9',
        type: 'option',
        isAlias: true,
        key: 'nine9',
        value: null,
      },
      {
        index: 6,
        raw: 'dots.and-dashes',
        type: 'argument',
      },
    ],
  },
  {
    input: [
      '--9nine=99',
      'ASCII-[]{}^`~',
      '-multi-word=value-with=equals',
      '--CAPS-and-digits123=OK',
      '--trail99=',
      'final-arg',
    ],
    expected: [
      {
        index: 0,
        raw: '--9nine=99',
        type: 'option',
        isAlias: false,
        key: '9nine',
        value: '99',
      },
      {
        index: 1,
        raw: 'ASCII-[]{}^`~',
        type: 'argument',
      },
      {
        index: 2,
        raw: '-multi-word=value-with=equals',
        type: 'option',
        isAlias: true,
        key: 'multi-word',
        value: 'value-with=equals',
      },
      {
        index: 3,
        raw: '--CAPS-and-digits123=OK',
        type: 'option',
        isAlias: false,
        key: 'CAPS-and-digits123',
        value: 'OK',
      },
      {
        index: 4,
        raw: '--trail99=',
        type: 'option',
        isAlias: false,
        key: 'trail99',
        value: null,
      },
      {
        index: 5,
        raw: 'final-arg',
        type: 'argument',
      },
    ],
  },
  {
    input: [
      '\tleading-tab',
      '--tabbed=with\ttab',
      '--long-hyphen-chain=---===',
      '-X==value=still',
      '--digits-000=000',
      'trailing\t tab',
    ],
    expected: [
      {
        index: 0,
        raw: '\tleading-tab',
        type: 'argument',
      },
      {
        index: 1,
        raw: '--tabbed=with\ttab',
        type: 'option',
        isAlias: false,
        key: 'tabbed',
        value: 'with\ttab',
      },
      {
        index: 2,
        raw: '--long-hyphen-chain=---===',
        type: 'option',
        isAlias: false,
        key: 'long-hyphen-chain',
        value: '---===',
      },
      {
        index: 3,
        raw: '-X==value=still',
        type: 'option',
        isAlias: true,
        key: 'X',
        value: '=value=still',
      },
      {
        index: 4,
        raw: '--digits-000=000',
        type: 'option',
        isAlias: false,
        key: 'digits-000',
        value: '000',
      },
      {
        index: 5,
        raw: 'trailing\t tab',
        type: 'argument',
      },
    ],
  },
]

const INVALID_ARGUMENTS: string[] = [
  '---triple',
  '--dash-end-',
  '--white space',
  '--with@symbol',
  '-',
  '-=value',
  '--=value',
  '--123-',
  '-?flag',
  '--bad^caret',
  '--under_score',
  '--dot.key',
  '---double-dash-start',
  '-space key',
  '--plus+sign',
  '--multi-=-value',
  '--tab\tkey=1',
  '-X tab',
  '--space-in-key ',
  '--start-with-dash-=-value',
]

describe('parseProgramArguments', () => {
  it.each(EXPECTED_AST_NODES)(
    'parses $input correctly',
    ({ input, expected }) => {
      expect(parseArgsToAST(input)).toEqual(expected)
    }
  )

  it.each(INVALID_ARGUMENTS)('throws for invalid argument: %s', (arg) => {
    expect(() => parseArgsToAST([arg])).toThrow(NoArgSyntaxError)
  })
})
