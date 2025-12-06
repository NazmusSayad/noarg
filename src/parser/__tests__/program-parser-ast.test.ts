import {
  NoArgClientError,
  NoArgEmptyOptionValueError,
  NoArgUnknownOptionError,
} from '@/constants/errors'
import { TypeNoValueSchema, TypeNumberSchema, TypeStringSchema } from '@/schema'
import { describe, expect, it } from 'vitest'
import { parseArgsToAST } from '../ast'
import { FakeProgramParserAST } from './helpers'

describe('ProgramParserAST', () => {
  describe('string and flags mix', () => {
    const parser = new FakeProgramParserAST({
      id: '0',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'name', type: new TypeStringSchema(), aliases: ['n'] },
        { name: 'flag', type: new TypeNoValueSchema(), aliases: ['f'] },
        { name: 'cache', type: new TypeNoValueSchema(), aliases: ['c'] },
        { name: 'dry', type: new TypeNoValueSchema(), aliases: ['d'] },
      ],
      config: {
        trailingArguments: true,
      },
    })

    it('collects option values and arguments', async () => {
      const nodes = parseArgsToAST(['--name', 'alpha', '--flag', 'beta'])
      const result = await parser.parse(nodes)

      expect(result.argumentsList).toEqual([nodes[3]])
      expect(result.optionsRecord.name.keys).toEqual([nodes[0]])
      expect(result.optionsRecord.name.values).toEqual([
        { valueNode: nodes[1], valueKeyNode: nodes[0] },
      ])
      expect(result.optionsRecord.flag.keys).toEqual([nodes[2]])
    })

    it('uses inline option values', async () => {
      const nodes = parseArgsToAST(['--name=inline', 'trailing'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.name.keys).toEqual([nodes[0]])
      expect(result.optionsRecord.name.values).toEqual([
        { valueNode: nodes[0], valueKeyNode: nodes[0] },
      ])
      expect(result.argumentsList).toEqual([nodes[1]])
    })

    it('handles combined aliases for no-value options', async () => {
      const nodes = parseArgsToAST(['-cd'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.cache.keys).toEqual(nodes)
      expect(result.optionsRecord.dry.keys).toEqual(nodes)
    })

    it('throws when value is missing at end', async () => {
      await expect(
        parser.parse(parseArgsToAST(['--name']))
      ).rejects.toBeInstanceOf(NoArgClientError)
    })

    it('throws when next option arrives before value', async () => {
      await expect(
        parser.parse(parseArgsToAST(['--name', '--flag']))
      ).rejects.toBeInstanceOf(NoArgEmptyOptionValueError)
    })
  })

  describe('numbers, inline chains, and dense aliases', () => {
    const parser = new FakeProgramParserAST({
      id: '1',
      command: '$',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'count', type: new TypeNumberSchema(), aliases: ['c'] },
        { name: 'mode', type: new TypeStringSchema(), aliases: ['m'] },
        { name: 'quick', type: new TypeNoValueSchema(), aliases: ['q'] },
        { name: 'noop', type: new TypeNoValueSchema(), aliases: ['o'] },
        { name: 'flag', type: new TypeNoValueSchema(), aliases: ['f'] },
      ],
      config: {
        trailingArguments: true,
      },
    })

    it('aggregates repeated values separated by flags and arguments', async () => {
      const nodes = parseArgsToAST([
        '--count',
        '4',
        '--flag',
        '--count=7',
        'tail',
      ])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.count.keys).toEqual([nodes[0], nodes[3]])
      expect(result.optionsRecord.count.values).toEqual([
        { valueNode: nodes[1], valueKeyNode: nodes[0] },
        { valueNode: nodes[3], valueKeyNode: nodes[3] },
      ])
      expect(result.optionsRecord.flag.keys).toEqual([nodes[2]])
      expect(result.argumentsList).toEqual([nodes[4]])
    })

    it('packs dense combined aliases', async () => {
      const nodes = parseArgsToAST(['-qof'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.quick.keys).toEqual(nodes)
      expect(result.optionsRecord.noop.keys).toEqual(nodes)
      expect(result.optionsRecord.flag.keys).toEqual(nodes)
    })

    it('throws when combined aliases include value option', async () => {
      await expect(
        parser.parse(parseArgsToAST(['-cm']))
      ).rejects.toBeInstanceOf(NoArgUnknownOptionError)
    })

    it('throws when mixed chain hides unknown alias', async () => {
      await expect(
        parser.parse(parseArgsToAST(['-qzx']))
      ).rejects.toBeInstanceOf(NoArgUnknownOptionError)
    })
  })

  describe('multi-parser mismatch edge cases', () => {
    const parser = new FakeProgramParserAST({
      id: '2',
      command: '%',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'alpha', type: new TypeStringSchema(), aliases: ['a'] },
        { name: 'bravo', type: new TypeNoValueSchema(), aliases: ['b'] },
        { name: 'charlie', type: new TypeNoValueSchema(), aliases: ['c'] },
        { name: 'delta', type: new TypeNoValueSchema(), aliases: ['d'] },
      ],
      config: {
        trailingArguments: true,
      },
    })

    it('throws for unknown options', async () => {
      await expect(
        parser.parse(parseArgsToAST(['--missing']))
      ).rejects.toBeInstanceOf(NoArgUnknownOptionError)
    })

    it('throws for invalid combined alias entries', async () => {
      await expect(
        parser.parse(parseArgsToAST(['-bxz']))
      ).rejects.toBeInstanceOf(NoArgUnknownOptionError)
    })
  })
})
