import {
  NoArgDuplicateOptionValueError,
  NoArgInternalError,
  NoArgTypeError,
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

    for (const { name } of this.config.options) {
      const record = optionsRecord[name]
      if (!record) {
        throw new NoArgInternalError(
          `Option ${name} not found in options record`
        )
      }

      if (record.schema.type instanceof TypeNoValueSchema) {
        result[name] = record.keys.length
      }

      if (
        record.schema.type instanceof TypePrimitiveUnionSchema ||
        record.schema.type instanceof TypeBooleanSchema ||
        record.schema.type instanceof TypeNumberSchema ||
        record.schema.type instanceof TypeStringSchema
      ) {
        const value = this.getSingleArgumentValue(record)

        if (record.schema.required && value === null) {
          throw new NoArgTypeError(`Option ${name} is required`)
        }

        if (value !== null) {
          const output = record.schema.type.parse(value)
          result[name] = output as InternalOptionSchemaResultType
        }
      }

      if (
        record.schema.type instanceof TypeArraySchema ||
        record.schema.type instanceof TypeTupleSchema
      ) {
        const values = this.getMultipleArgumentValues(record)
        const output = record.schema.type.parse(values)
        result[name] = output as InternalOptionSchemaResultType
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

  private getSingleArgumentValue(input: OptionRecordEntry): string | null {
    if (input.keys.length > 1) {
      const secondKey = input.keys[1]
      throw new NoArgDuplicateOptionValueError(secondKey.index, secondKey.raw)
    }

    if (input.values.length > 1) {
      const secondValue = input.values[1]
      throw new NoArgDuplicateOptionValueError(
        secondValue.optionNode.index,
        secondValue.optionNode.raw
      )
    }

    const fv = input.values[0]?.valueNode
    if (!fv) return null

    const value = fv.type === 'option' ? fv.value! : fv.raw
    return value ?? null
  }

  private getMultipleArgumentValues(input: OptionRecordEntry): string[] {
    return input.values.map((value) => {
      const fv = value.valueNode
      return fv.type === 'option' ? fv.value! : fv.raw
    })
  }
}
