import {
  NoArgEmptyOptionValueError,
  NoArgUnexpectedError,
  NoArgUnknownOptionError,
} from '@/constants/errors'
import { TypeNoValueSchema } from '@/schema'
import {
  InternalASTArgumentNode,
  InternalASTNode,
  InternalASTOptionNode,
} from './ast.type'
import {
  InternalOptionSchemaResultType,
  InternalProgramParserOptionEntry,
  InternalProgramParserOptions,
  InternalProgramParserResult,
} from './program-parser.type'

export class ProgramParser {
  constructor(public config: InternalProgramParserOptions) {}

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
    return [this.config.id, result]
  }

  private async parse(
    args: InternalASTNode[]
  ): Promise<InternalProgramParserResult> {
    const argumentsList: InternalASTArgumentNode[] = []
    const optionsRecord: Record<string, OptionRecordEntry> = Object.fromEntries(
      this.config.options.map((option) => [
        option.name,
        {
          schema: option,
          operandKeys: [],
          operandValues: [],
          count: 0,
        } satisfies OptionRecordEntry,
      ])
    )

    let currentOption: OptionRecordEntry | null = null

    args.forEach((node) => {
      if (node.type === 'option') {
        if (currentOption) {
          if (currentOption.schema.type instanceof TypeNoValueSchema) {
            currentOption.operandKeys.push(node)
            currentOption = null
            return
          }

          throw new NoArgEmptyOptionValueError(node.id, node.arg)
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
                throw new NoArgUnknownOptionError(node.id, node.arg)
              }

              option.operandKeys.push(node)
            }

            currentOption = null
            return
          }
        }

        if (!option) {
          throw new NoArgUnknownOptionError(node.id, node.arg)
        }

        if (option.schema.type instanceof TypeNoValueSchema) {
          option.operandKeys.push(node)
          currentOption = null
          return
        }

        if (node.value === null) {
          option.operandKeys.push(node)
          currentOption = option
        } else {
          option.operandValues.push({
            id: node.id,
            value: node.value,
          })
        }

        return
      }

      if (currentOption) {
        currentOption.operandValues.push({
          id: node.id,
          value: node.arg,
        })

        currentOption = null
        return
      }

      argumentsList.push(node)
    })

    if (currentOption) {
      const co = currentOption as OptionRecordEntry
      currentOption = null

      if (co.schema.type instanceof TypeNoValueSchema) {
        const lastNode = args[args.length - 1]
        if (lastNode.type !== 'option') {
          throw new NoArgUnexpectedError(
            `Expected option at end for ${co.schema.name} but ended with ${lastNode.type}`
          )
        }

        co.operandKeys.push(lastNode)
      } else {
        throw new NoArgUnexpectedError(
          `Expected value at end for ${co.schema.name} but ended`
        )
      }
    }

    const optionsResult = await this.parseOptions(optionsRecord)
    const argumentsResult = await this.parseArguments(argumentsList)

    return {
      options: optionsResult,
      primaryArguments: argumentsResult.primary,
      optionalArguments: argumentsResult.optional,
      listArguments: argumentsResult.list,
    }
  }

  private async parseOptions(
    optionsRecord: Record<string, OptionRecordEntry>
  ): Promise<Record<string, unknown>> {
    const result: Record<string, InternalOptionSchemaResultType> = {}

    for (const option of this.config.options) {
      const record = optionsRecord[option.name]

      console.log(option, record)
    }

    return result
  }

  private async parseArguments(
    _argumentsList: InternalASTArgumentNode[]
  ): Promise<ArgumentsParserResult> {
    return {
      primary: [],
      optional: [],
      list: [],
    }
  }

  private detectAliases(node: InternalASTOptionNode): string | string[] {
    for (const option of this.config.options) {
      for (const alias of option.aliases) {
        if (alias === node.key) {
          return option.name
        }
      }
    }

    const splitted = node.key.split('')
    const splittedOptions: string[] = []

    for (const key of splitted) {
      const option = this.config.options.find((option) =>
        option.aliases.includes(key)
      )

      if (option?.type instanceof TypeNoValueSchema) {
        splittedOptions.push(option.name)
      }
    }

    if (splittedOptions.length === splitted.length) {
      return splittedOptions
    }

    throw new NoArgUnknownOptionError(node.id, node.arg)
  }
}

type OptionRecordEntry = {
  schema: InternalProgramParserOptionEntry
  count: number

  operandKeys: InternalASTOptionNode[]

  operandValues: {
    id: string
    value: string
  }[]
}

type ArgumentsParserResult = {
  primary: string[]
  optional: string[]
  list: string[]
}
