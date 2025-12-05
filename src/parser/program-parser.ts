import {
  NoArgExpectedOptionValueError,
  NoArgUnexpectedError,
  NoArgUnknownFlagError,
} from '@/constants/errors'
import {
  PrimitiveUnionSchema,
  TypeArraySchema,
  TypeBooleanSchema,
  TypeNoValueSchema,
  TypeNumberSchema,
  TypeStringSchema,
  TypeTupleSchema,
} from '@/schema'
import {
  InternalASTArgumentNode,
  InternalASTNode,
  InternalASTOptionNode,
} from './ast.type'
import {
  InternalProgramParserOptionEntry,
  InternalProgramParserOptions,
  InternalProgramParserResult,
} from './program-parser.type'

export class ProgramParser {
  constructor(public options: InternalProgramParserOptions) {}

  public async run(
    args: InternalASTNode[]
  ): Promise<[string, InternalProgramParserResult]> {
    for (let i = 0; i < args.length; i++) {
      const node = args[i]
      if (node.type === 'option') {
        break
      }

      const program = this.options.subPrograms.find(
        (program) => program.options.command === node.arg
      )

      if (program) {
        return program.run(args.slice(i + 1))
      }
    }

    const result = await this.parse(args)
    return [this.options.id, result]
  }

  protected async parse(
    args: InternalASTNode[]
  ): Promise<InternalProgramParserResult> {
    const argumentsList: InternalASTArgumentNode[] = []
    const optionsRecord = Object.fromEntries(
      this.options.options.map((option) => [
        option.name,
        {
          schema: option,
          presences: 0,
          arguments: [] as { id: string; value: string }[],
        },
      ])
    )

    type OptionRecordEntry = (typeof optionsRecord)[keyof typeof optionsRecord]
    let currentOption: OptionRecordEntry | null = null

    args.forEach((node) => {
      if (node.type === 'option') {
        if (currentOption) {
          if (currentOption.schema.type instanceof TypeNoValueSchema) {
            currentOption.presences++
            currentOption = null
            return
          }

          throw new NoArgExpectedOptionValueError(node.id, node.arg)
        }

        let option: OptionRecordEntry | null = null

        if (!node.isAlias) {
          option = optionsRecord[node.key]
        } else {
          const aliasParsed = this.detectAliases(node)

          if (typeof aliasParsed === 'string') {
            option = optionsRecord[aliasParsed]
          } else {
            for (const alias of aliasParsed) {
              option = optionsRecord[alias]
              if (!option) {
                throw new NoArgUnknownFlagError(node.id, node.arg)
              }

              option.presences++
            }

            currentOption = null
            return
          }
        }

        if (!option) {
          throw new NoArgUnknownFlagError(node.id, node.arg)
        }

        if (option.schema.type instanceof TypeNoValueSchema) {
          option.presences++
          currentOption = null
          return
        }

        if (node.value === null) {
          currentOption = option
        } else {
          option.arguments.push({
            id: node.id,
            value: node.value,
          })
        }

        return
      }

      if (currentOption) {
        const optionValue = this.detectOption(currentOption.schema, node)

        if (optionValue) {
          if (optionValue === 'no-value') {
            currentOption.presences++
            currentOption = null
          } else {
            currentOption.arguments.push({
              id: node.id,
              value: optionValue.arg,
            })

            currentOption = null
            return
          }
        }
      }

      argumentsList.push(node)
    })

    if (currentOption) {
      const co = currentOption as OptionRecordEntry
      currentOption = null

      if (co.schema.type instanceof TypeNoValueSchema) {
        co.presences++
      } else {
        throw new NoArgUnexpectedError(
          `Expected value at end for ${co.schema.name} but ended`
        )
      }
    }

    console.dir(optionsRecord, { depth: null })
    console.dir(argumentsList, { depth: null })

    return {
      primaryArguments: [],
      optionalArguments: [],
      listArguments: [],
      options: {},
    }
  }

  private detectAliases(node: InternalASTOptionNode): string | string[] {
    for (const option of this.options.options) {
      for (const alias of option.aliases) {
        if (alias === node.key) {
          return option.name
        }
      }
    }

    const splitted = node.key.split('')
    const splittedOptions: string[] = []

    for (const key of splitted) {
      const option = this.options.options.find((option) =>
        option.aliases.includes(key)
      )

      if (option?.type instanceof TypeNoValueSchema) {
        splittedOptions.push(option.name)
      }
    }

    if (splittedOptions.length === splitted.length) {
      return splittedOptions
    }

    throw new NoArgUnknownFlagError(node.id, node.arg)
  }

  private detectOption(
    option: InternalProgramParserOptionEntry,
    arg: InternalASTArgumentNode
  ): InternalASTArgumentNode | null | 'no-value' {
    if (option.type instanceof TypeNoValueSchema) {
      return 'no-value'
    }

    if (
      option.type instanceof PrimitiveUnionSchema ||
      option.type instanceof TypeBooleanSchema ||
      option.type instanceof TypeStringSchema ||
      option.type instanceof TypeNumberSchema ||
      option.type instanceof TypeArraySchema ||
      option.type instanceof TypeTupleSchema
    ) {
      return arg
    }

    return null
  }
}
