import { na } from '..'

const program = na.createProgram(
  {
    name: 'test',
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
  },
  (result) => {
    console.log(result)
  }
)

const program2 = program.create(
  {
    name: 'test2',
    description: 'Test program 2',

    options: [
      na.option('test4', String, {}),

      na.option('test5', Number, {}),

      na.option('test6', Boolean, {}),
    ],
  },
  (result) => {
    console.log(result)
  }
)
