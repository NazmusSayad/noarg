import { parseProgramArguments } from './ast'
import { InternalProgramParserOptions } from './program-parser.type'

export class ProgramParser {
  constructor(
    private args: string[],
    private options: InternalProgramParserOptions
  ) {
    const astNodes = parseProgramArguments(args)
    console.log(astNodes)
  }
}
