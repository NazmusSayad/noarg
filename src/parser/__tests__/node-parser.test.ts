import {
  NoArgClientError,
  NoArgEmptyOptionValueError,
  NoArgUnknownOptionError,
} from '@/lib/errors'
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
        { name: 'name', type: new TypeStringSchema({}), aliases: ['n'] },
        { name: 'flag', type: new TypeNoValueSchema({}), aliases: ['f'] },
        { name: 'cache', type: new TypeNoValueSchema({}), aliases: ['c'] },
        { name: 'dry', type: new TypeNoValueSchema({}), aliases: ['d'] },
      ],
      config: {},
    })

    it('collects option values and arguments', async () => {
      const nodes = parseArgsToAST(['--name', 'alpha', '--flag', 'beta'])
      const result = await parser.parse(nodes)

      expect(result.argumentsList).toEqual([nodes[3]])
      expect(result.optionsRecord.name.keys).toEqual([nodes[0]])
      expect(result.optionsRecord.name.values).toEqual([
        { valueNode: nodes[1], optionNode: nodes[0] },
      ])
      expect(result.optionsRecord.flag.keys).toEqual([nodes[2]])
    })

    it('uses inline option values', async () => {
      const nodes = parseArgsToAST(['--name=inline', 'trailing'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.name.keys).toEqual([nodes[0]])
      expect(result.optionsRecord.name.values).toEqual([
        { valueNode: nodes[0], optionNode: nodes[0] },
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
        { name: 'count', type: new TypeNumberSchema({}), aliases: ['c'] },
        { name: 'mode', type: new TypeStringSchema({}), aliases: ['m'] },
        { name: 'quick', type: new TypeNoValueSchema({}), aliases: ['q'] },
        { name: 'noop', type: new TypeNoValueSchema({}), aliases: ['o'] },
        { name: 'flag', type: new TypeNoValueSchema({}), aliases: ['f'] },
      ],
      config: {},
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
        { valueNode: nodes[1], optionNode: nodes[0] },
        { valueNode: nodes[3], optionNode: nodes[3] },
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

  describe('value heavy mixes with alias bursts', () => {
    const parser = new FakeProgramParserAST({
      id: '3',
      command: '&',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'path', type: new TypeStringSchema({}), aliases: ['p'] },
        { name: 'mode', type: new TypeStringSchema({}), aliases: ['m'] },
        { name: 'verbose', type: new TypeNoValueSchema({}), aliases: ['v'] },
        { name: 'silent', type: new TypeNoValueSchema({}), aliases: ['s'] },
        { name: 'force', type: new TypeNoValueSchema({}), aliases: ['f'] },
      ],
      config: {},
    })

    it('collects multiple value options with scattered flags and arguments', async () => {
      const nodes = parseArgsToAST([
        '--path=/tmp',
        'loose',
        '--mode',
        'dev',
        '--verbose',
        '--path=./rel',
        'tail',
      ])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.path.keys).toEqual([nodes[0], nodes[5]])
      expect(result.optionsRecord.path.values).toEqual([
        { valueNode: nodes[0], optionNode: nodes[0] },
        { valueNode: nodes[5], optionNode: nodes[5] },
      ])
      expect(result.optionsRecord.mode.keys).toEqual([nodes[2]])
      expect(result.optionsRecord.mode.values).toEqual([
        { valueNode: nodes[3], optionNode: nodes[2] },
      ])
      expect(result.optionsRecord.verbose.keys).toEqual([nodes[4]])
      expect(result.argumentsList).toEqual([nodes[1], nodes[6]])
    })

    it('accumulates repeated no-value aliases across bursts', async () => {
      const nodes = parseArgsToAST(['-vs', '--silent', '-svf'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.silent.keys).toEqual(nodes)
      expect(result.optionsRecord.force.keys).toEqual([nodes[2]])
      expect(result.optionsRecord.verbose.keys).toEqual([nodes[0], nodes[2]])
    })

    it('throws when alias burst hides value option', async () => {
      await expect(
        parser.parse(parseArgsToAST(['-mp']))
      ).rejects.toBeInstanceOf(NoArgUnknownOptionError)
    })
  })

  describe('alias bursts with inline values on no-value options', () => {
    const parser = new FakeProgramParserAST({
      id: '4',
      command: '!',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'toggle', type: new TypeNoValueSchema({}), aliases: ['t'] },
        { name: 'quiet', type: new TypeNoValueSchema({}), aliases: ['q'] },
        { name: 'mode', type: new TypeStringSchema({}), aliases: ['m'] },
      ],
      config: {},
    })

    it('keeps keys for no-value aliases even with inline values', async () => {
      const nodes = parseArgsToAST([
        '-tq',
        '--toggle=on',
        '-qq',
        '--mode',
        'fast',
        'trailing',
      ])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.toggle.keys).toEqual([nodes[0], nodes[1]])
      expect(result.optionsRecord.quiet.keys).toEqual([
        nodes[0],
        nodes[2],
        nodes[2],
      ])
      expect(result.optionsRecord.mode.keys).toEqual([nodes[3]])
      expect(result.optionsRecord.mode.values).toEqual([
        { valueNode: nodes[4], optionNode: nodes[3] },
      ])
      expect(result.argumentsList).toEqual([nodes[5]])
    })
  })

  describe('edge consumption and alias quirks', () => {
    const parser = new FakeProgramParserAST({
      id: '5',
      command: '*',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'path', type: new TypeStringSchema({}), aliases: ['p'] },
        { name: 'verbose', type: new TypeNoValueSchema({}), aliases: ['v'] },
        { name: 'toggle', type: new TypeNoValueSchema({}), aliases: ['t'] },
        { name: 'cache', type: new TypeNoValueSchema({}), aliases: ['c'] },
      ],
      config: {},
    })

    it('records duplicate alias occurrences separately', async () => {
      const nodes = parseArgsToAST(['-cc'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.cache.keys).toEqual([nodes[0], nodes[0]])
    })

    it('keeps argument after no-value option', async () => {
      const nodes = parseArgsToAST(['-c', 'arg'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.cache.keys).toEqual([nodes[0]])
      expect(result.argumentsList).toEqual([nodes[1]])
    })

    it('accepts inline value on no-value alias as key only', async () => {
      const nodes = parseArgsToAST(['-v=1'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.verbose.keys).toEqual([nodes[0]])
      expect(result.argumentsList).toEqual([])
    })

    it('throws when value option is followed by another option', async () => {
      await expect(
        parser.parse(parseArgsToAST(['--path', '-v']))
      ).rejects.toBeInstanceOf(NoArgEmptyOptionValueError)
    })

    it('keeps inline value then processes following flag and argument', async () => {
      const nodes = parseArgsToAST(['--path=/tmp', '-v', 'rest'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.path.keys).toEqual([nodes[0]])
      expect(result.optionsRecord.path.values).toEqual([
        { valueNode: nodes[0], optionNode: nodes[0] },
      ])
      expect(result.optionsRecord.verbose.keys).toEqual([nodes[1]])
      expect(result.argumentsList).toEqual([nodes[2]])
    })

    it('captures multiple inline values for same option', async () => {
      const nodes = parseArgsToAST(['--path=/a', '--path=/b', 'arg'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.path.keys).toEqual([nodes[0], nodes[1]])
      expect(result.optionsRecord.path.values).toEqual([
        { valueNode: nodes[0], optionNode: nodes[0] },
        { valueNode: nodes[1], optionNode: nodes[1] },
      ])
      expect(result.argumentsList).toEqual([nodes[2]])
    })

    it('treats alias for value option without value as unknown', async () => {
      await expect(parser.parse(parseArgsToAST(['-p']))).rejects.toBeInstanceOf(
        NoArgUnknownOptionError
      )
    })

    it('counts triple alias occurrences', async () => {
      const nodes = parseArgsToAST(['-vvv'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.verbose.keys).toEqual([
        nodes[0],
        nodes[0],
        nodes[0],
      ])
    })

    it('binds argument value after option and still accepts trailing flag', async () => {
      const nodes = parseArgsToAST(['-c', '--path', '/x', '-t'])
      const result = await parser.parse(nodes)

      expect(result.optionsRecord.cache.keys).toEqual([nodes[0]])
      expect(result.optionsRecord.path.values).toEqual([
        { valueNode: nodes[2], optionNode: nodes[1] },
      ])
      expect(result.optionsRecord.toggle.keys).toEqual([nodes[3]])
      expect(result.argumentsList).toEqual([])
    })

    it('fails when alias chain carries unknown entry', async () => {
      await expect(
        parser.parse(parseArgsToAST(['-cvx']))
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
        { name: 'alpha', type: new TypeStringSchema({}), aliases: ['a'] },
        { name: 'bravo', type: new TypeNoValueSchema({}), aliases: ['b'] },
        { name: 'charlie', type: new TypeNoValueSchema({}), aliases: ['c'] },
        { name: 'delta', type: new TypeNoValueSchema({}), aliases: ['d'] },
      ],
      config: {},
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
