/* eslint-disable */

const app = na.createApp('App', {
  description: 'App description',

  arguments: [
    na.argument('name', String, {
      description: 'A string argument',
    }),
  ],

  options: [
    na.option('name', String, {
      description: 'A string option',
    }),

    na.option('age', Number, {
      description: 'A number option with multiple values',
    }),

    na.option('tags', [String], {
      description: 'A string option with multiple values',
    }),

    na.option('isAdmin', Boolean, {
      description: 'A boolean option',
    }),

    na.option('verbose', Boolean, {
      description: 'Verbose output',
    }),
  ],

  handle({ args, options }) {
    console.log('App handle')
    args.name // The first argument

    options.name // The string option
    options.age // The number option
    options.tags // The string option with multiple values
    options.isAdmin // The boolean option
    options.verbose // The boolean option
  },
})

const childApp = na.create('ChildApp', {
  description: 'ChildApp description',

  arguments: [
    na.argument('name', String, {
      description: 'A string argument',
    }),
  ],

  options: [
    na.option('string', String, {
      description: 'A string option',
    }),
  ],

  handle({ args, options }) {
    console.log('ChildApp handle')
  },
})

app.start()
