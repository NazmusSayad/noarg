import {
  NoArgDuplicateOptionValueError,
  NoArgInternalError,
} from '@/lib/errors'
import {
  TypeArraySchema,
  TypeBooleanSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypePrimitiveUnionSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'
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
        (program) => program.config.command === node.raw
      )

      if (program) {
        return program.run(args.slice(i + 1))
      }
    }

    const result = await this.parse(args)
    const optionsResult = await this.parseOptions(result.optionsRecord)
    const argumentsResult = await this.parseArguments(result.argumentsList)

    console.dir(optionsResult, { depth: null })

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

    for (const _option of this.config.options) {
      const record = optionsRecord[_option.name]
      if (!record) {
        throw new NoArgInternalError(
          `Option ${_option.name} not found in options record`
        )
      }

      if (record.schema.type instanceof TypeNoValueSchema) {
        result[_option.name] = record.keys.length
      }

      if (
        record.schema.type instanceof TypePrimitiveUnionSchema ||
        record.schema.type instanceof TypeBooleanSchema ||
        record.schema.type instanceof TypeNumberSchema ||
        record.schema.type instanceof TypeStringSchema
      ) {
        console.log(record.values)
        console.log(record.values.length)

        if (record.values.length > 1) {
          const secondValue = record.values[1]

          throw new NoArgDuplicateOptionValueError(
            secondValue.valueNode.index,
            secondValue.optionNode.raw
          )
        }
      }

      if (
        record.schema.type instanceof TypeArraySchema ||
        record.schema.type instanceof TypeTupleSchema
      ) {
      }
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
