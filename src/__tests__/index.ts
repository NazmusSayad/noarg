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

const program2 = program.create('test2', {}).on((result) => {
  console.log(result.name)
})
