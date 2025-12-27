import { na } from '..'

const program = na
  .createProgram('test', {
    description: 'Test program',

    options: [
      na.option('test1', String, {
        global: true,
        minLength: 10,
      }),

      na.option('test2', Number, {}),

      na.option('test3', Boolean),
    ],

    arguments: [na.argument('test', String)],
  })
  .on((result) => {
    console.log(result.name)
  })

program.create('test2', {}).on((result) => {
  console.log(result.name)
})

program.start([
  'test',
  'test1',
  'test2',
  'test3',
  'test',
  'test1',
  'test2',
  'test3',
])
