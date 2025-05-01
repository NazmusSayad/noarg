import NoArg from '..'

const app = NoArg.create('test', {
  requiredArgs: [
    {
      name: 'arg1',
      type: String,
      description: 'arg1 description',
    },
  ],

  flags: {
    test: NoArg.string('test', 'test2', 'test3'),
  },
})

app.on((options) => {
  console.log(options)
})

app.start([])
