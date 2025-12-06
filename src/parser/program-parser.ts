import { InternalASTArgumentNode, InternalASTNode } from './ast.type'
import { NodeParserAST } from './node-parser-ast'
import { OptionRecordEntry } from './node-parser-ast.type'
import {
  InternalOptionSchemaResultType,
  InternalProgramParserOptions,
  InternalProgramParserResult,
} from './program-parser.type'

export class ProgramParser extends NodeParserAST {
  constructor(protected config: InternalProgramParserOptions) {
    super(config)
  }

  public async run(
    args: InternalASTNode[]
  ): Promise<[string, InternalProgramParserResult]> {
    for (let i = 0; i < args.length; i++) {
      const node = args[i]
      if (node.type === 'option') {
        break
      }

      const program = this.config.subPrograms.find(
        (program) => program.config.command === node.arg
      )

      if (program) {
        return program.run(args.slice(i + 1))
      }
    }

    const result = await this.parse(args)
    const optionsResult = await this.parseOptions(result.optionsRecord)
    const argumentsResult = await this.parseArguments(result.argumentsList)

    return [
      this.config.id,
      {
        options: optionsResult,
        ...argumentsResult,
      },
    ]
  }

  private async parseOptions(
    optionsRecord: Record<string, OptionRecordEntry>
  ): Promise<Record<string, unknown>> {
    const result: Record<string, InternalOptionSchemaResultType> = {}

    for (const option of this.config.options) {
      const record = optionsRecord[option.name]

      console.dir(record, { depth: null })
    }

    return result
  }

  private async parseArguments(
    _argumentsList: InternalASTArgumentNode[]
  ): Promise<
    Pick<
      InternalProgramParserResult,
      'primaryArguments' | 'optionalArguments' | 'listArguments'
    >
  > {
    return {
      primaryArguments: [],
      optionalArguments: [],
      listArguments: [],
    }
  }
}
