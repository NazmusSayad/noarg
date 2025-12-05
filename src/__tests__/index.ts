import { createApp } from '@/builder/app-builder'

const app = createApp(
  {
    name: 'App',
    description: 'App description',
    flags: {
      main: {
        type: Number,
      },
    },
  },

  (options, config) => {},

  {
    help: false,
    allowDuplicateFlagForList: true,
    allowDuplicateFlagForPrimitive: true,
  }
)

const child1 = app.program(
  {
    name: 'Program 1',
    flags: {
      test: {
        type: String,
      },
    },
  },

  (options, config) => {},

  {
    help: true,
    skipGlobalFlags: true,
  }
)

console.dir(app.getProgram(), { depth: null })
