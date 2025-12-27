import {
  NoArgDuplicateOptionValueError,
  NoArgUnknownArgumentError,
} from '@/helpers/errors'
import {
  TypeBooleanSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypeStringSchema,
} from '@/schema'
import { describe, expect, it } from 'vitest'
import { parseArgsToAST } from '../ast'
import { ProgramParser } from '../program-parser'

const gitParser = new ProgramParser({
  id: 'git',
  command: 'git',
  description: undefined,
  childPrograms: [
    new ProgramParser({
      id: 'git-init',
      command: 'init',
      description: undefined,
      childPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      additionalArguments: null,
      options: [
        { name: 'bare', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'initialBranch', type: new TypeStringSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-clone',
      command: 'clone',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'repo', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'dir', type: new TypeStringSchema({}) }],
      additionalArguments: null,
      options: [
        { name: 'branch', type: new TypeStringSchema({}), aliases: ['b'] },
        { name: 'depth', type: new TypeNumberSchema({}), aliases: [] },
        {
          name: 'recurseSubmodules',
          type: new TypeNoValueSchema({}),
          aliases: [],
        },
        {
          name: 'shallowSubmodules',
          type: new TypeNoValueSchema({}),
          aliases: [],
        },
        { name: 'filter', type: new TypeStringSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-add',
      command: 'add',
      description: undefined,
      childPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      additionalArguments: { name: 'paths', type: new TypeStringSchema({}) },
      options: [
        { name: 'all', type: new TypeNoValueSchema({}), aliases: ['A'] },
        { name: 'patch', type: new TypeNoValueSchema({}), aliases: ['p'] },
        { name: 'force', type: new TypeNoValueSchema({}), aliases: ['f'] },
        { name: 'intentToAdd', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-commit',
      command: 'commit',
      description: undefined,
      childPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      additionalArguments: { name: 'paths', type: new TypeStringSchema({}) },
      options: [
        {
          name: 'message',
          type: new TypeStringSchema({}),
          aliases: ['m'],
          required: true,
        },
        { name: 'amend', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'signoff', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'noVerify', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'all', type: new TypeNoValueSchema({}), aliases: ['a'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-push',
      command: 'push',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'remote', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'branch', type: new TypeStringSchema({}) }],
      additionalArguments: null,
      options: [
        { name: 'force', type: new TypeNoValueSchema({}), aliases: ['f'] },
        { name: 'tags', type: new TypeNoValueSchema({}), aliases: [] },
        {
          name: 'setUpstream',
          type: new TypeNoValueSchema({}),
          aliases: ['u'],
        },
        { name: 'delete', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-pull',
      command: 'pull',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'remote', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'branch', type: new TypeStringSchema({}) }],
      additionalArguments: null,
      options: [
        { name: 'rebase', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'ffOnly', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'tags', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-checkout',
      command: 'checkout',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'target', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      additionalArguments: { name: 'paths', type: new TypeStringSchema({}) },
      options: [
        { name: 'detach', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'force', type: new TypeNoValueSchema({}), aliases: ['f'] },
        { name: 'track', type: new TypeNoValueSchema({}), aliases: ['t'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-branch',
      command: 'branch',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'name', type: new TypeStringSchema({}) }],
      optionalArguments: [
        { name: 'startPoint', type: new TypeStringSchema({}) },
      ],
      additionalArguments: null,
      options: [
        { name: 'delete', type: new TypeNoValueSchema({}), aliases: ['d'] },
        { name: 'move', type: new TypeNoValueSchema({}), aliases: ['m'] },
        { name: 'all', type: new TypeNoValueSchema({}), aliases: ['a'] },
        { name: 'list', type: new TypeNoValueSchema({}), aliases: ['l'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-merge',
      command: 'merge',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'branch', type: new TypeStringSchema({}) }],
      optionalArguments: [],
      additionalArguments: { name: 'more', type: new TypeStringSchema({}) },
      options: [
        { name: 'noFastForward', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'squash', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'message', type: new TypeStringSchema({}), aliases: ['m'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-rebase',
      command: 'rebase',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'upstream', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'branch', type: new TypeStringSchema({}) }],
      additionalArguments: null,
      options: [
        {
          name: 'interactive',
          type: new TypeNoValueSchema({}),
          aliases: ['i'],
        },
        { name: 'onto', type: new TypeStringSchema({}), aliases: [] },
        { name: 'autosquash', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-fetch',
      command: 'fetch',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'remote', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'refspec', type: new TypeStringSchema({}) }],
      additionalArguments: null,
      options: [
        { name: 'all', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'tags', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'prune', type: new TypeNoValueSchema({}), aliases: ['p'] },
        { name: 'depth', type: new TypeNumberSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-remote',
      command: 'remote',
      description: undefined,
      childPrograms: [
        new ProgramParser({
          id: 'git-remote-add',
          command: 'add',
          description: undefined,
          childPrograms: [],
          primaryArguments: [
            { name: 'name', type: new TypeStringSchema({}) },
            { name: 'url', type: new TypeStringSchema({}) },
          ],
          optionalArguments: [],
          additionalArguments: null,
          options: [
            { name: 'fetch', type: new TypeNoValueSchema({}), aliases: [] },
            { name: 'tags', type: new TypeNoValueSchema({}), aliases: ['t'] },
          ],
          config: {},
        }),
        new ProgramParser({
          id: 'git-remote-set-url',
          command: 'set-url',
          description: undefined,
          childPrograms: [],
          primaryArguments: [
            { name: 'name', type: new TypeStringSchema({}) },
            { name: 'newUrl', type: new TypeStringSchema({}) },
          ],
          optionalArguments: [],
          additionalArguments: null,
          options: [
            { name: 'push', type: new TypeNoValueSchema({}), aliases: [] },
            { name: 'add', type: new TypeNoValueSchema({}), aliases: [] },
          ],
          config: {},
        }),
        new ProgramParser({
          id: 'git-remote-remove',
          command: 'remove',
          description: undefined,
          childPrograms: [],
          primaryArguments: [{ name: 'name', type: new TypeStringSchema({}) }],
          optionalArguments: [],
          additionalArguments: null,
          options: [],
          config: {},
        }),
      ],
      primaryArguments: [],
      optionalArguments: [],
      additionalArguments: null,
      options: [
        { name: 'verbose', type: new TypeNoValueSchema({}), aliases: ['v'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-stash',
      command: 'stash',
      description: undefined,
      childPrograms: [
        new ProgramParser({
          id: 'git-stash-push',
          command: 'push',
          description: undefined,
          childPrograms: [],
          primaryArguments: [],
          optionalArguments: [],
          additionalArguments: {
            name: 'paths',
            type: new TypeStringSchema({}),
          },
          options: [
            { name: 'message', type: new TypeStringSchema({}), aliases: ['m'] },
            { name: 'keepIndex', type: new TypeNoValueSchema({}), aliases: [] },
            {
              name: 'includeUntracked',
              type: new TypeNoValueSchema({}),
              aliases: ['u'],
            },
          ],
          config: {},
        }),
        new ProgramParser({
          id: 'git-stash-apply',
          command: 'apply',
          description: undefined,
          childPrograms: [],
          primaryArguments: [{ name: 'stash', type: new TypeStringSchema({}) }],
          optionalArguments: [],
          additionalArguments: null,
          options: [
            { name: 'index', type: new TypeNoValueSchema({}), aliases: [] },
            { name: 'quiet', type: new TypeNoValueSchema({}), aliases: ['q'] },
          ],
          config: {},
        }),
        new ProgramParser({
          id: 'git-stash-pop',
          command: 'pop',
          description: undefined,
          childPrograms: [],
          primaryArguments: [{ name: 'stash', type: new TypeStringSchema({}) }],
          optionalArguments: [],
          additionalArguments: null,
          options: [],
          config: {},
        }),
      ],
      primaryArguments: [],
      optionalArguments: [],
      additionalArguments: null,
      options: [],
      config: {},
    }),
    new ProgramParser({
      id: 'git-tag',
      command: 'tag',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'name', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'target', type: new TypeStringSchema({}) }],
      additionalArguments: null,
      options: [
        { name: 'annotate', type: new TypeNoValueSchema({}), aliases: ['a'] },
        { name: 'message', type: new TypeStringSchema({}), aliases: ['m'] },
        { name: 'delete', type: new TypeNoValueSchema({}), aliases: ['d'] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-config',
      command: 'config',
      description: undefined,
      childPrograms: [],
      primaryArguments: [{ name: 'key', type: new TypeStringSchema({}) }],
      optionalArguments: [{ name: 'value', type: new TypeStringSchema({}) }],
      additionalArguments: null,
      options: [
        { name: 'global', type: new TypeNoValueSchema({}), aliases: ['g'] },
        { name: 'system', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'unset', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'bool', type: new TypeBooleanSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-log',
      command: 'log',
      description: undefined,
      childPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      additionalArguments: { name: 'paths', type: new TypeStringSchema({}) },
      options: [
        { name: 'oneline', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'stat', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'maxCount', type: new TypeNumberSchema({}), aliases: ['n'] },
        { name: 'author', type: new TypeStringSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-diff',
      command: 'diff',
      description: undefined,
      childPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      additionalArguments: { name: 'paths', type: new TypeStringSchema({}) },
      options: [
        {
          name: 'staged',
          type: new TypeNoValueSchema({}),
          aliases: ['cached'],
        },
        { name: 'nameOnly', type: new TypeNoValueSchema({}), aliases: [] },
        { name: 'color', type: new TypeStringSchema({}), aliases: [] },
      ],
      config: {},
    }),
    new ProgramParser({
      id: 'git-status',
      command: 'status',
      description: undefined,
      childPrograms: [],
      primaryArguments: [],
      optionalArguments: [],
      additionalArguments: null,
      options: [
        { name: 'short', type: new TypeNoValueSchema({}), aliases: ['s'] },
        { name: 'branch', type: new TypeNoValueSchema({}), aliases: ['b'] },
        { name: 'porcelain', type: new TypeNoValueSchema({}), aliases: [] },
      ],
      config: {},
    }),
  ],
  primaryArguments: [],
  optionalArguments: [],
  additionalArguments: null,
  options: [
    { name: 'help', type: new TypeNoValueSchema({}), aliases: ['h'] },
    { name: 'version', type: new TypeNoValueSchema({}), aliases: ['v'] },
  ],
  config: {},
})

describe('ProgramParser git schema', () => {
  it('parses commit with message, flags, and multiple paths', async () => {
    const result = await gitParser.run(
      parseArgsToAST(['git', 'commit', '-m', 'msg', '--amend', 'a.txt', 'b.ts'])
    )

    expect(result.id).toBe('git-commit')
    expect(result.result.options.message).toBe('msg')
    expect(result.result.options.amend).toBe(1)
    expect(result.result.additionalArguments).toEqual(['a.txt', 'b.ts'])
  })

  it('parses clone with depth, branch, and target directory', async () => {
    const result = await gitParser.run(
      parseArgsToAST([
        'git',
        'clone',
        '--branch',
        'main',
        '--depth',
        '3',
        '--recurseSubmodules',
        '--filter',
        'blob:none',
        'https://example.com/repo.git',
        'dest',
      ])
    )

    expect(result.id).toBe('git-clone')
    expect(result.result.options.branch).toBe('main')
    expect(result.result.options.depth).toBe(3)
    expect(result.result.options.recurseSubmodules).toBe(1)
    expect(result.result.options.filter).toBe('blob:none')
    expect(result.result.primaryArguments.repo).toBe(
      'https://example.com/repo.git'
    )
    expect(result.result.optionalArguments.dir).toBe('dest')
  })

  it('handles nested remote set-url and respects option toggles', async () => {
    const result = await gitParser.run(
      parseArgsToAST([
        'git',
        'remote',
        'set-url',
        '--push',
        'origin',
        'ssh://x',
      ])
    )

    expect(result.id).toBe('git-remote-set-url')
    expect(result.result.options.push).toBe(1)
    expect(result.result.primaryArguments.name).toBe('origin')
    expect(result.result.primaryArguments.newUrl).toBe('ssh://x')
  })

  it('parses log with numeric and string options plus paths', async () => {
    const result = await gitParser.run(
      parseArgsToAST([
        'git',
        'log',
        '--oneline',
        '-n',
        '5',
        '--author',
        'me',
        'src',
        'lib',
      ])
    )

    expect(result.id).toBe('git-log')
    expect(result.result.options.oneline).toBe(1)
    expect(result.result.options.maxCount).toBe(5)
    expect(result.result.options.author).toBe('me')
    expect(result.result.additionalArguments).toEqual(['src', 'lib'])
  })

  it('throws duplicate for repeated commit message option', async () => {
    await expect(
      gitParser.run(
        parseArgsToAST(['git', 'commit', '-m', 'a', '--message', 'b'])
      )
    ).rejects.toBeInstanceOf(NoArgDuplicateOptionValueError)
  })

  it('rejects unexpected trailing args for status with no list schema', async () => {
    await expect(
      gitParser.run(parseArgsToAST(['git', 'status', 'extra']))
    ).rejects.toBeInstanceOf(NoArgUnknownArgumentError)
  })
})
