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
        } satisfies OptionRecordEntry,
      ])
    )

    let currentOption:
      | (OptionRecordEntry & { node: InternalASTOptionNode })
      | null = null

    args.forEach((node) => {
      if (node.type === 'option') {
        // Handle if there already a option in queue
        if (currentOption) {
          if (currentOption.schema.type instanceof TypeNoValueSchema) {
            currentOption.operandKeys.push(node)
            currentOption = null
            return
          }

          throw new NoArgEmptyOptionValueError(node.id, node.arg)
        }

        let tempOption: OptionRecordEntry | null = null

        if (!node.isAlias) {
          tempOption = optionsRecord[node.key]
        } else {
          const directMatchOption = this.findOption(node)
          if (directMatchOption) {
            tempOption = optionsRecord[directMatchOption.name]
          } else {
            // This should only happen for NoValue aliases
            const aliasParsed = this.splitAliasAndFindOptions(node)
            for (const alias of aliasParsed) {
              tempOption = optionsRecord[alias]
              if (!tempOption) {
                throw new NoArgUnknownOptionError(node.id, node.arg)
              }

              tempOption.operandKeys.push(node)
            }

            currentOption = null
            return
          }
        }

        if (!tempOption) {
          throw new NoArgUnknownOptionError(node.id, node.arg)
        }

        if (tempOption.schema.type instanceof TypeNoValueSchema) {
          tempOption.operandKeys.push(node)
          currentOption = null
          return
        }

        if (node.value === null) {
          tempOption.operandKeys.push(node)
          currentOption = { ...tempOption, node }
        } else {
          tempOption.operandKeys.push(node)
          tempOption.operandValues.push({
            id: node.id,
            value: node.value,
            source: node,
          })
        }

        return
      }

      if (currentOption) {
        currentOption.operandValues.push({
          id: node.id,
          value: node.arg,
          source: currentOption.node,
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

      console.dir(record, { depth: null })
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

  private findOption(
    node: InternalASTOptionNode
  ): InternalProgramParserOptionEntry | null {
    for (const option of this.config.options) {
      if (option.name === node.key) {
        return option
      }
    }

    return null
  }

  private splitAliasAndFindOptions(
    node: InternalASTOptionNode
  ): string | string[] {
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
  operandKeys: InternalASTOptionNode[]
  operandValues: {
    id: string
    value: string
    source: InternalASTOptionNode
  }[]
}

type ArgumentsParserResult = {
  primary: string[]
  optional: string[]
  list: string[]
}
