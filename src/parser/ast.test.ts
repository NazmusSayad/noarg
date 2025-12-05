import { NoArgSyntaxError } from '@/constants/errors'
import { describe, expect, it } from 'vitest'
import { parseProgramArguments } from './ast'
import { InternalASTNode } from './ast.type'

const EXPECTED_AST_NODES: { input: string[]; expected: InternalASTNode[] }[] = [
  {
    input: ['file.txt', '--verbose', 'notes'],
    expected: [
      { arg: 'file.txt', type: 'argument' },
      {
        arg: '--verbose',
        type: 'option',
        key: 'verbose',
        value: null,
      },
      { arg: 'notes', type: 'argument' },
    ],
  },
  {
    input: ['-a', '--beta=2', '-c=see', 'z'],
    expected: [
      { arg: '-a', type: 'option', key: 'a', value: null },
      { arg: '--beta=2', type: 'option', key: 'beta', value: '2' },
      { arg: '-c=see', type: 'option', key: 'c', value: 'see' },
      { arg: 'z', type: 'argument' },
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
        arg: '--mix-9=value-123_+=[]',
        type: 'option',
        key: 'mix-9',
        value: 'value-123_+=[]',
      },
      {
        arg: '--chain=a=b=c',
        type: 'option',
        key: 'chain',
        value: 'a=b=c',
      },
      {
        arg: '--empty=',
        type: 'option',
        key: 'empty',
        value: null,
      },
      { arg: 'ARG', type: 'argument' },
      { arg: '-x', type: 'option', key: 'x', value: null },
      {
        arg: '--Path=C:\\temp\\file.txt',
        type: 'option',
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
        arg: '--multi-part-flag',
        type: 'option',
        key: 'multi-part-flag',
        value: null,
      },
      { arg: 'arg-1', type: 'argument' },
      {
        arg: '--numbers-123',
        type: 'option',
        key: 'numbers-123',
        value: null,
      },
      { arg: '-Z=99', type: 'option', key: 'Z', value: '99' },
      {
        arg: '--caps-lock=ON',
        type: 'option',
        key: 'caps-lock',
        value: 'ON',
      },
      { arg: 'final', type: 'argument' },
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
        arg: '--url=https://example.com/path?query=1&list[]=2',
        type: 'option',
        key: 'url',
        value: 'https://example.com/path?query=1&list[]=2',
      },
      { arg: '-0==', type: 'option', key: '0', value: '=' },
      { arg: 'plain.txt', type: 'argument' },
      {
        arg: '--mixCase=LoWeR-UPPER-123.!',
        type: 'option',
        key: 'mixCase',
        value: 'LoWeR-UPPER-123.!',
      },
      {
        arg: '--dash-only',
        type: 'option',
        key: 'dash-only',
        value: null,
      },
      { arg: '-nine9', type: 'option', key: 'nine9', value: null },
      { arg: 'dots.and-dashes', type: 'argument' },
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
        arg: '--9nine=99',
        type: 'option',
        key: '9nine',
        value: '99',
      },
      { arg: 'ASCII-[]{}^`~', type: 'argument' },
      {
        arg: '-multi-word=value-with=equals',
        type: 'option',
        key: 'multi-word',
        value: 'value-with=equals',
      },
      {
        arg: '--CAPS-and-digits123=OK',
        type: 'option',
        key: 'CAPS-and-digits123',
        value: 'OK',
      },
      {
        arg: '--trail99=',
        type: 'option',
        key: 'trail99',
        value: null,
      },
      { arg: 'final-arg', type: 'argument' },
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
      { arg: '\tleading-tab', type: 'argument' },
      {
        arg: '--tabbed=with\ttab',
        type: 'option',
        key: 'tabbed',
        value: 'with\ttab',
      },
      {
        arg: '--long-hyphen-chain=---===',
        type: 'option',
        key: 'long-hyphen-chain',
        value: '---===',
      },
      {
        arg: '-X==value=still',
        type: 'option',
        key: 'X',
        value: '=value=still',
      },
      {
        arg: '--digits-000=000',
        type: 'option',
        key: 'digits-000',
        value: '000',
      },
      { arg: 'trailing\t tab', type: 'argument' },
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
