import { na } from '..'

const program = na.createProgram(
  {
    name: 'test',
    description: 'Test program',

    options: [
      na.option('test1', String, {
        global: true,
      }),
      na.option('test2', Number, {}),
      na.option('test3', Boolean, {}),
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

const opt1 = na.option('why-it-is-working-1', String, {})
const opt2 = na.option('why-it-is-working-2', Number, {})
const opt3 = na.option('why-it-is-working-3', Boolean, {})
