import { na } from '..'

const program = na
  .createProgram('git', {
    description: 'Git Test Program',

    options: [
      na.option('type', [1, 2, 'three'], {
        global: true,
      }),

      na.option('silent', Boolean, {
        global: true,
      }),

      na.option('verbose', [Number], {
        global: true,
      }),

      na.option('tup', [[String, Number]], {
        global: true,
      }),
    ],
  })
  .on((result) => {
    console.log('ROOT', result)
  })

program.start([
  '--tup',
  'one,1',
  '--verbose',
  '2,45,456,4,54,5',
  '--verbose',
  '2,45,456,4,54,5',
  '--type',
  'three',
])
