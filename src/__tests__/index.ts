import { BuilderProgram } from '@/builder'
import { NoArgProgram } from '@/noarg/noarg-program'

const program = new NoArgProgram({ name: 'App' }, {})

const core = new BuilderProgram(program, { name: 'child' }, {})
  .flag('testFlag - 1', String, { askQuestion: 'test question', type1: 'test' })
  .flag('testFlag - 2', ['my string', true, 234234])
  .handler((args) => {})

console.log(core)
