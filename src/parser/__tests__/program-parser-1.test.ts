import { TypeNoValueSchema, TypeStringSchema } from '@/schema'
import { describe, expect, it, vi } from 'vitest'
import { parseArgsToAST } from '../ast'
import { ProgramParser } from '../program-parser'

describe('ProgramParser subprogram routing', () => {
  it('hands off to nested subprogram and preserves trailing arguments', async () => {
    const nested = new ProgramParser({
      id: 'nested',
      command: 'deploy',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'env', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: { name: 'rest', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })
    const nestedSpy = vi.spyOn(nested, 'run').mockResolvedValue({
      id: 'nested',
      result: {
        options: {},
        primaryArguments: { env: 'prod' },
        optionalArguments: {},
        listArguments: ['tail'],
      },
    })

    const root = new ProgramParser({
      id: 'root',
      command: 'root',
      description: undefined,
      subPrograms: [nested],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    const nodes = parseArgsToAST(['deploy', 'prod', 'tail'])
    const result = await root.run(nodes)

    expect(nestedSpy).toHaveBeenCalledWith(nodes.slice(1))
    expect(result.id).toBe('nested')
    expect(result.result.listArguments).toEqual(['tail'])
  })

  it('processes own options when flag precedes subcommand token', async () => {
    const child = new ProgramParser({
      id: 'child',
      command: 'child',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const childSpy = vi.spyOn(child, 'run')

    const root = new ProgramParser({
      id: 'root',
      command: 'root',
      description: undefined,
      subPrograms: [child],
      primaryArguments: [{ name: 'target', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'verbose', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    })

    const nodes = parseArgsToAST(['--verbose', 'child'])
    const outcome = await root.run(nodes)

    expect(childSpy).not.toHaveBeenCalled()
    expect(outcome.id).toBe('root')
    expect(outcome.result.options.verbose).toBe(1)
    expect(outcome.result.primaryArguments.target).toBe('child')
  })

  it('ignores subprograms when only options and arguments are provided', async () => {
    const other = new ProgramParser({
      id: 'other',
      command: 'other',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })
    const otherSpy = vi.spyOn(other, 'run')

    const root = new ProgramParser({
      id: 'root',
      command: 'root',
      description: undefined,
      subPrograms: [other],
      primaryArguments: [{ name: 'main', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'opt', type: new TypeStringSchema({}) }],
      listArguments: { name: 'extras', type: new TypeStringSchema({}) },
      options: [{ name: 'flag', type: new TypeNoValueSchema({}), aliases: [] }],
      config: {},
    })

    const nodes = parseArgsToAST(['--flag', 'alpha', 'beta', 'gamma'])
    const outcome = await root.run(nodes)

    expect(otherSpy).not.toHaveBeenCalled()
    expect(outcome.result.options.flag).toBe(1)
    expect(outcome.result.primaryArguments.main).toBe('alpha')
    expect(outcome.result.optionalArguments.opt).toBe('beta')
    expect(outcome.result.listArguments).toEqual(['gamma'])
  })
})
