import NoArg from '..'

const app = NoArg.create('test', {
  requiredArgs: [
    {
      name: 'boom',
      type: NoArg.string('test', 'test2', 'test3'),
      description: 'arg1 description',
      typeV2: Number,
    },
  ],

  test: {
    value: 1,
    unValue: 2,
  },

  flags: {
    test: NoArg.string('test', 'test2', 'test3'),
  },
})

app.on((options) => {
  console.log(options)
})

app.start([])
