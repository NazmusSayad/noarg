import { expect, describe, test } from 'bun:test'
import { testBaseProgram } from './helpers'
import NoArg from '..'

describe('testBaseProgram', () => {
  test('should handle string flag', async () => {
    const config = {
      flags: {
        name: NoArg.string().default('defaultName'),
      },
    }
    const [args, flags] = await testBaseProgram(config, '--name', 'testName')
    expect(flags.name).toBe('testName')
  })

  test('should handle default flag value', async () => {
    const config = {
      flags: {
        name: NoArg.string().default('defaultName'),
      },
    }
    const [args, flags] = await testBaseProgram(config)
    expect(flags.name).toBe('defaultName')
  })

  test('should handle required argument', async () => {
    const config = {
      requiredArgs: [
        {
          name: 'username',
          type: NoArg.string(),
        },
      ],
    }
    const [args] = await testBaseProgram(config, 'testUser')
    expect(args[0]).toBe('testUser')
  })

  test('should handle multiple flags', async () => {
    const config = {
      flags: {
        flag1: NoArg.string(),
        flag2: NoArg.number(),
      },
    }

    const [args, flags] = await testBaseProgram(
      config,
      '--flag1',
      'value1',
      '--flag2',
      '42'
    )
    expect(flags.flag1).toBe('value1')
    expect(flags.flag2).toBe(42)
  })
})
