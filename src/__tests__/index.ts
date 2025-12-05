import { ProgramParser } from '@/parser/program-parser'

const programParser = new ProgramParser(['npm', 'run', 'build'], {
  name: 'npm',
  description: 'npm is a package manager for Node.js',
  trailingArguments: true,
  subPrograms: [],
  primaryArguments: [],
  optionalArguments: [],
  listArguments: [],
  flags: [],
})

console.log(programParser)
