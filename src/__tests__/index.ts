import { BuilderApp } from '@/builder/builder-app'

const app = new BuilderApp({ name: 'App' }, { help: true })
  .arg('path', String)
  .arg('path', String)
  .flag('silent', Boolean)
  .configure({
    allowDuplicateFlagForList: true,
    help: false,
  })
  .flag('config', String, { global: true })

const program1 = app.program('test1').configure({ help: true })

const program2 = app
  .program('test2')
  .arg('path', String)
  .arg('path', String)
  .arg('path', String)
  .arg('path', String)
  .arg('path', String)
  .arg('path', String)
  .arg('path', String)

const grandProgram = program1
  .program('test3', { notes: [] })
  .handle((options, config) => {})

console.dir(app, { depth: null })
