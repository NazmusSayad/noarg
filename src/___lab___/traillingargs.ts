import NoArg from '..'

const devAndBuild = NoArg.defineConfig({
  requiredArgs: [
    {
      name: '@',
      type: NoArg.string().description('Root directory'),
    },
  ],

  optionalArgs: [
    {
      name: 'root',
      type: NoArg.string().description('Root directory'),
    },
    {
      name: 'root',
      type: NoArg.string().description('Root directory'),
    },
    {
      name: 'root',
      type: NoArg.string().description('Root directory'),
    },
  ],

  flags: {
    module: NoArg.string('cjs', 'mjs')
      .aliases('m')
      .description("Output module's type"),

    outDir: NoArg.string().aliases('o').description('Output directory'),

    node: NoArg.boolean()
      .aliases('n')
      .default(false)
      .description('Enable __dirname and __filename in ES modules'),
  },

  trailingArgs: '',

  config: {},
})

const app = NoArg.create('app', {
  flags: {
    A: NoArg.string(),
    b: NoArg.number(),
    abc: NoArg.array(NoArg.string()).minLength(1),
  },

  requiredArgs: [
    { name: 'arg1', description: 'Argument 1', type: NoArg.number() },
  ],

  listArg: {
    name: 'args to pass',
    description: 'List of items',
    type: NoArg.string(),
    maxLength: 1,
  },

  system: {
    // enableHelpBoxBorder: true,
  },
  trailingArgs: '--',
  customRenderHelp: {
    helpUsageTrailingArgsLabel: '--[flags/args to pass]',
  },
})

const child = app.create('child', {
  listArg: {
    name: 'super',
    description: 'List of items',
    type: NoArg.string(),
  },
  notes: ['This is a note'],

  ...devAndBuild,
})

child.on((args, flags, config) => {
  child.renderUsage()

  console.log(args)
  console.log(flags)
})

app.start(['child', '--help', '456'])
