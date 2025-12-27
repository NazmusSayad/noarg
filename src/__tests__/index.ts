import { na } from '..'

const program = na
  .createProgram('git', {
    description: 'Git Test Program',

    options: [
      na.option('silent', Boolean, {
        global: true,
      }),
    ],
  })
  .on((result) => {
    console.log('ROOT', result)
  })

const p2 = program
  .create('commit', {
    arguments: [na.argument('message', String)],
  })
  .on((result) => {
    console.log('COMMIT', result)
  })

program.start(['commit', '--silent', 'true', 'Hello, world!'])
