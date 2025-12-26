import { na } from '..'

const program = na.createProgram(
  {
    name: 'test',
    description: 'Test program',

    options: [
      na.option('test1', String, {}),
      na.option('test2', Number, {}),
      na.option('test3', Number, {}),
    ],

    arguments: [
      na.argument('test', String, {
        description: 'Test argument',
      }),
    ],
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
      na.option('test5', String, {}),
      na.option('test6', Number, {}),
    ],
  },
  (result) => {
    console.log(result)
  }
)

const opt1 = na.option('why-it-is-working', String, {})
