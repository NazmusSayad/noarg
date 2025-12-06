import {
  NoArgPrimaryArgumentError,
  NoArgUnknownArgumentError,
} from '@/lib/errors'
import { TypeBooleanSchema, TypeNumberSchema, TypeStringSchema } from '@/schema'
import { describe, expect, it } from 'vitest'
import { parseArgsToAST } from '../ast'
import { ProgramParser } from '../program-parser'

describe('ProgramParser argument parsing', () => {
  it('raises when no primary arguments are provided', async () => {
    const parser = new ProgramParser({
      id: 'a1',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [
        { name: 'first', type: new TypeStringSchema({}) },
        { name: 'second', type: new TypeNumberSchema({}) },
      ],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(parser.run(parseArgsToAST([]))).rejects.toBeInstanceOf(
      NoArgPrimaryArgumentError
    )
  })

  it('converts optional boolean and collects list after optional slot', async () => {
    const parser = new ProgramParser({
      id: 'a2',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'topic', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'enabled', type: new TypeBooleanSchema({}) }],
      listArguments: { name: 'tags', type: new TypeStringSchema({}) },
      options: [],
      config: {},
    })

    const result = await parser.run(
      parseArgsToAST(['news', 'no', 'a', 'b', 'c'])
    )

    expect(result.result.primaryArguments.topic).toBe('news')
    expect(result.result.optionalArguments.enabled).toBe(false)
    expect(result.result.listArguments).toEqual(['a', 'b', 'c'])
  })

  it('rejects extra arguments when list schema is absent', async () => {
    const parser = new ProgramParser({
      id: 'a3',
      command: '#',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'main', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'count', type: new TypeNumberSchema({}) }],
      listArguments: null,
      options: [],
      config: {},
    })

    await expect(
      parser.run(parseArgsToAST(['alpha', '2', 'overflow']))
    ).rejects.toBeInstanceOf(NoArgUnknownArgumentError)
  })
})
