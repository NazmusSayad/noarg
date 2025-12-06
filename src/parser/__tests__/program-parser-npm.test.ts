import {
  NoArgDuplicateOptionValueError,
  NoArgUnknownArgumentError,
} from '@/lib/errors'
import { TypeNoValueSchema, TypeNumberSchema, TypeStringSchema } from '@/schema'
import { describe, expect, it } from 'vitest'
import { parseArgsToAST } from '../ast'
import { ProgramParser } from '../program-parser'

const npmParser = new ProgramParser({
  id: 'npm',
  command: 'npm',
  description: undefined,
  subPrograms: [
    new ProgramParser({
      id: 'npm-install',
      command: 'install',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: { name: 'packages', type: new TypeStringSchema({}) },
      options: [
        { name: 'saveDev', type: new TypeNoValueSchema({}), aliases: ['D'] },
        { name: 'saveProd', type: new TypeNoValueSchema({}), aliases: ['S'] },
        { name: 'saveExact', type: new TypeNoValueSchema({}), aliases: ['E'] },
        { name: 'global', type: new TypeNoValueSchema({}), aliases: ['g'] },
        { name: 'force', type: new TypeNoValueSchema({}), aliases: ['f'] },
        {
          name: 'legacyPeerDeps',
          type: new TypeNoValueSchema({}),
          aliases: [],
        },
        { name: 'workspace', type: new TypeStringSchema({}), aliases: ['w'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-update',
      command: 'update',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: { name: 'packages', type: new TypeStringSchema({}) },
      options: [
        { name: 'global', type: new TypeNoValueSchema({}), aliases: ['g'] },
        { name: 'depth', type: new TypeNumberSchema({}), aliases: [] },
        { name: 'force', type: new TypeNoValueSchema({}), aliases: ['f'] },
        { name: 'workspace', type: new TypeStringSchema({}), aliases: ['w'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-uninstall',
      command: 'uninstall',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: { name: 'packages', type: new TypeStringSchema({}) },
      options: [
        { name: 'saveDev', type: new TypeNoValueSchema({}), aliases: ['D'] },
        { name: 'global', type: new TypeNoValueSchema({}), aliases: ['g'] },
        { name: 'saveProd', type: new TypeNoValueSchema({}), aliases: ['S'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-run',
      command: 'run',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'script', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: { name: 'args', type: new TypeStringSchema({}) },
      options: [
        { name: 'ifPresent', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'workspaces', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-test',
      command: 'test',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: { name: 'args', type: new TypeStringSchema({}) },
      options: [
        { name: 'watch', type: new TypeNoValueSchema({}), aliases: ['w'] },
        { name: 'runInBand', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-publish',
      command: 'publish',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [{ name: 'tag', type: new TypeStringSchema({}) }],
      listArguments: null,
      options: [
        { name: 'access', type: new TypeStringSchema({}), aliases: [] },
        { name: 'dryRun', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'otp', type: new TypeStringSchema({}), aliases: [] },
        { name: 'workspace', type: new TypeStringSchema({}), aliases: ['w'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-pack',
      command: 'pack',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'dryRun', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'workspace', type: new TypeStringSchema({}), aliases: ['w'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-init',
      command: 'init',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'yes', type: new TypeNoValueSchema({}), aliases: ['y'] },
        { name: 'scope', type: new TypeStringSchema({}), aliases: [] },
        { name: 'workspace', type: new TypeStringSchema({}), aliases: ['w'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-config',
      command: 'config',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'key', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'value', type: new TypeStringSchema({}) }],
      listArguments: null,
      options: [
        { name: 'global', type: new TypeNoValueSchema({}), aliases: ['g'] },
        { name: 'json', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'list', type: new TypeNoValueSchema({}), aliases: ['l'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-login',
      command: 'login',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'registry', type: new TypeStringSchema({}), aliases: [] },
        { name: 'scope', type: new TypeStringSchema({}), aliases: [] },
        { name: 'authType', type: new TypeStringSchema({}), aliases: [] },
        { name: 'otp', type: new TypeStringSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-logout',
      command: 'logout',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'registry', type: new TypeStringSchema({}), aliases: [] },
        { name: 'scope', type: new TypeStringSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-cache',
      command: 'cache',
      description: undefined,
      subPrograms: [
        new ProgramParser({
          id: 'npm-cache-clean',
          command: 'clean',
          description: undefined,
          subPrograms: [],
          primaryArguments: [
            { name: 'target', type: new TypeStringSchema({}) },
          ],
          optionalArguments: [],
          listArguments: null,
          options: [
            { name: 'force', type: new TypeNoValueSchema({}), aliases: ['f'] },
          ],
          config: {},
        }),
        new ProgramParser({
          id: 'npm-cache-verify',
          command: 'verify',
          description: undefined,
          subPrograms: [],
          primaryArguments: [],
          optionalArguments: [],
          listArguments: null,
          options: [],
          config: {},
        }),
      ],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-outdated',
      command: 'outdated',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: { name: 'packages', type: new TypeStringSchema({}) },
      options: [
        { name: 'global', type: new TypeNoValueSchema({}), aliases: ['g'] },
        { name: 'long', type: new TypeNoValueSchema({}), aliases: ['l'] },
        { name: 'json', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-list',
      command: 'list',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: null,
      options: [
        { name: 'global', type: new TypeNoValueSchema({}), aliases: ['g'] },
        { name: 'depth', type: new TypeNumberSchema({}), aliases: [] },
        { name: 'json', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-link',
      command: 'link',
      description: undefined,
      subPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      listArguments: { name: 'packages', type: new TypeStringSchema({}) },
      options: [
        { name: 'global', type: new TypeNoValueSchema({}), aliases: ['g'] },
        { name: 'workspace', type: new TypeStringSchema({}), aliases: ['w'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'npm-exec',
      command: 'exec',
      description: undefined,
      subPrograms: [],
      primaryArguments: [{ name: 'command', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      listArguments: { name: 'args', type: new TypeStringSchema({}) },
      options: [
        { name: 'package', type: new TypeStringSchema({}), aliases: ['p'] },
        { name: 'call', type: new TypeNoValueSchema({}), aliases: ['c'] },
      ],
      config: {},
    }),
  ],
  primaryArguments: [],
  optionalArguments: [],
  listArguments: null,
  options: [
    { name: 'version', type: new TypeNoValueSchema({}), aliases: ['v'] },
    { name: 'help', type: new TypeNoValueSchema({}), aliases: ['h'] },
  ],
  config: {},
})

describe('ProgramParser npm schema', () => {
  it('parses install with mixed aliases and workspaces', async () => {
    const result = await npmParser.run(
      parseArgsToAST([
        'npm',
        'install',
        '-D',
        '--workspace',
        'web',
        'react',
        'typescript',
      ])
    )

    expect(result.id).toBe('npm-install')
    expect(result.result.options.saveDev).toBe(1)
    expect(result.result.options.workspace).toBe('web')
    expect(result.result.listArguments).toEqual(['react', 'typescript'])
  })

  it('parses run with script and forwarded args', async () => {
    const result = await npmParser.run(parseArgsToAST(['npm', 'run', 'build']))

    expect(result.id).toBe('npm-run')
    expect(result.result.primaryArguments.script).toBe('build')
  })

  it('parses publish with otp, access, and tag', async () => {
    const result = await npmParser.run(
      parseArgsToAST([
        'npm',
        'publish',
        '--access',
        'public',
        '--otp',
        '123456',
        '--workspace',
        'pkg',
        'next',
      ])
    )

    expect(result.id).toBe('npm-publish')
    expect(result.result.options.access).toBe('public')
    expect(result.result.options.otp).toBe('123456')
    expect(result.result.options.workspace).toBe('pkg')
    expect(result.result.optionalArguments.tag).toBe('next')
  })

  it('rejects duplicate workspace option on install', async () => {
    await expect(
      npmParser.run(
        parseArgsToAST([
          'npm',
          'install',
          '--workspace',
          'api',
          '--workspace',
          'web',
          'lodash',
        ])
      )
    ).rejects.toBeInstanceOf(NoArgDuplicateOptionValueError)
  })

  it('errors on unexpected extra arg for cache verify', async () => {
    await expect(
      npmParser.run(parseArgsToAST(['npm', 'cache', 'verify', 'extra']))
    ).rejects.toBeInstanceOf(NoArgUnknownArgumentError)
  })
})
