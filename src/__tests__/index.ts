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
    console.log(result.name)
  })

const p2 = program.create('commit', {}).on((result) => {
  console.log(result.name)
})

program.start(['commit', '--silent', 'true'])
