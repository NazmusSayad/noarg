import { createApp } from '@/noarg/create-app'
import { Tuple } from '@/runtime-type'

const app = createApp(
  {
    args: [],
    description: 'My app description',
    flags: {},
    listArg: {
      name: 'list',
      description: 'List of items',
    },
    notes: [],
    optionalArgs: [],
    trailingArgs: '--',
    helpUsageStructure: '',
    helpUsageTrailingArgsLabel: '',
  },
  (options, config) => {},
  {
    help: true,
    skipGlobalFlags: true,
  }
)

const child = app.createProgram(
  {
    args: [],
    description: 'My child app description',
    flags: {
      name: {
        type: Tuple({ type: String, minLength: 3 }),
      },
    },
    listArg: {
      name: 'list',
      description: 'List of items',
    },
    notes: [],
    optionalArgs: [],
    trailingArgs: '--',
    helpUsageStructure: '',
    helpUsageTrailingArgsLabel: '',
  },
  (options, config) => {},
  {
    help: false,
  }
)

app()
