import { NoArgSyntaxError } from '@/constants/errors'
import { describe, expect, it } from 'vitest'
import { parseProgramArguments } from './ast'
import { InternalASTNode } from './ast.type'

const EXPECTED_AST_NODES: { input: string[]; expected: InternalASTNode[] }[] = [
  {
    input: ['file.txt', '--verbose', 'notes'],
    expected: [
      {
        id: '0',
        arg: 'file.txt',
        type: 'argument',
      },
      {
        id: '1',
        arg: '--verbose',
        type: 'option',
        isAlias: false,
        key: 'verbose',
        value: null,
      },
      {
        id: '2',
        arg: 'notes',
        type: 'argument',
      },
    ],
  },
  {
    input: ['-a', '--beta=2', '-c=see', 'z'],
    expected: [
      {
        id: '0',
        arg: '-a',
        type: 'option',
        isAlias: true,
        key: 'a',
        value: null,
      },
      {
        id: '1',
        arg: '--beta=2',
        type: 'option',
        isAlias: false,
        key: 'beta',
        value: '2',
      },
      {
        id: '2',
        arg: '-c=see',
        type: 'option',
        isAlias: true,
        key: 'c',
        value: 'see',
      },
      {
        id: '3',
        arg: 'z',
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
        id: '0',
        arg: '--mix-9=value-123_+=[]',
        type: 'option',
        isAlias: false,
        key: 'mix-9',
        value: 'value-123_+=[]',
      },
      {
        id: '1',
        arg: '--chain=a=b=c',
        type: 'option',
        isAlias: false,
        key: 'chain',
        value: 'a=b=c',
      },
      {
        id: '2',
        arg: '--empty=',
        type: 'option',
        isAlias: false,
        key: 'empty',
        value: null,
      },
      {
        id: '3',
        arg: 'ARG',
        type: 'argument',
      },
      {
        id: '4',
        arg: '-x',
        type: 'option',
        isAlias: true,
        key: 'x',
        value: null,
      },
      {
        id: '5',
        arg: '--Path=C:\\temp\\file.txt',
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
        id: '0',
        arg: '--multi-part-flag',
        type: 'option',
        isAlias: false,
        key: 'multi-part-flag',
        value: null,
      },
      {
        id: '1',
        arg: 'arg-1',
        type: 'argument',
      },
      {
        id: '2',
        arg: '--numbers-123',
        type: 'option',
        isAlias: false,
        key: 'numbers-123',
        value: null,
      },
      {
        id: '3',
        arg: '-Z=99',
        type: 'option',
        isAlias: true,
        key: 'Z',
        value: '99',
      },
      {
        id: '4',
        arg: '--caps-lock=ON',
        type: 'option',
        isAlias: false,
        key: 'caps-lock',
        value: 'ON',
      },
      {
        id: '5',
        arg: 'final',
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
        id: '0',
        arg: '--url=https://example.com/path?query=1&list[]=2',
        type: 'option',
        isAlias: false,
        key: 'url',
        value: 'https://example.com/path?query=1&list[]=2',
      },
      {
        id: '1',
        arg: '-0==',
        type: 'option',
        isAlias: true,
        key: '0',
        value: '=',
      },
      {
        id: '2',
        arg: 'plain.txt',
        type: 'argument',
      },
      {
        id: '3',
        arg: '--mixCase=LoWeR-UPPER-123.!',
        type: 'option',
        isAlias: false,
        key: 'mixCase',
        value: 'LoWeR-UPPER-123.!',
      },
      {
        id: '4',
        arg: '--dash-only',
        type: 'option',
        isAlias: false,
        key: 'dash-only',
        value: null,
      },
      {
        id: '5',
        arg: '-nine9',
        type: 'option',
        isAlias: true,
        key: 'nine9',
        value: null,
      },
      {
        id: '6',
        arg: 'dots.and-dashes',
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
        id: '0',
        arg: '--9nine=99',
        type: 'option',
        isAlias: false,
        key: '9nine',
        value: '99',
      },
      {
        id: '1',
        arg: 'ASCII-[]{}^`~',
        type: 'argument',
      },
      {
        id: '2',
        arg: '-multi-word=value-with=equals',
        type: 'option',
        isAlias: true,
        key: 'multi-word',
        value: 'value-with=equals',
      },
      {
        id: '3',
        arg: '--CAPS-and-digits123=OK',
        type: 'option',
        isAlias: false,
        key: 'CAPS-and-digits123',
        value: 'OK',
      },
      {
        id: '4',
        arg: '--trail99=',
        type: 'option',
        isAlias: false,
        key: 'trail99',
        value: null,
      },
      {
        id: '5',
        arg: 'final-arg',
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
        id: '0',
        arg: '\tleading-tab',
        type: 'argument',
      },
      {
        id: '1',
        arg: '--tabbed=with\ttab',
        type: 'option',
        isAlias: false,
        key: 'tabbed',
        value: 'with\ttab',
      },
      {
        id: '2',
        arg: '--long-hyphen-chain=---===',
        type: 'option',
        isAlias: false,
        key: 'long-hyphen-chain',
        value: '---===',
      },
      {
        id: '3',
        arg: '-X==value=still',
        type: 'option',
        isAlias: true,
        key: 'X',
        value: '=value=still',
      },
      {
        id: '4',
        arg: '--digits-000=000',
        type: 'option',
        isAlias: false,
        key: 'digits-000',
        value: '000',
      },
      {
        id: '5',
        arg: 'trailing\t tab',
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
      expect(parseProgramArguments(input)).toEqual(expected)
    }
  )

  it.each(INVALID_ARGUMENTS)('throws for invalid argument: %s', (arg) => {
    expect(() => parseProgramArguments([arg])).toThrow(NoArgSyntaxError)
  })
})
