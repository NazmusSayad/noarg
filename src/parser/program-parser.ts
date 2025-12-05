import { InternalProgramParserOptions } from './program-parser.type'

export class ProgramParser {
  constructor(private options: InternalProgramParserOptions) {
    console.log(options)
  }
}
