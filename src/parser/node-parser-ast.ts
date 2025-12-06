import {
  NoArgClientError,
  NoArgEmptyOptionValueError,
  NoArgInternalError,
  NoArgUnknownOptionError,
} from '@/lib/errors'
import { TypeNoValueSchema } from '@/schema'
import {
  InternalASTArgumentNode,
  InternalASTNode,
  InternalASTOptionNode,
} from './ast.type'
import { OptionRecordEntry } from './node-parser-ast.type'
import {
  InternalProgramParserOptionEntry,
  InternalProgramParserOptions,
} from './program-parser.type'

export class NodeParserAST {
  protected config: InternalProgramParserOptions
  constructor(config: InternalProgramParserOptions) {
    this.config = config
  }

  protected async parse(args: InternalASTNode[]): Promise<{
    optionsRecord: Record<string, OptionRecordEntry>
    argumentsList: InternalASTArgumentNode[]
  }> {
    const argumentsList: InternalASTArgumentNode[] = []
    const optionsRecord: Record<string, OptionRecordEntry> = Object.fromEntries(
      this.config.options.map((option) => [
        option.name,
        {
          keys: [],
          values: [],
          schema: option,
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
            currentOption.keys.push(node)
            currentOption = null
            return
          }

          throw new NoArgEmptyOptionValueError(node.index, node.arg)
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
                throw new NoArgUnknownOptionError(node.index, node.arg)
              }

              tempOption.keys.push(node)
            }

            currentOption = null
            return
          }
        }

        if (!tempOption) {
          throw new NoArgUnknownOptionError(node.index, node.arg)
        }

        if (tempOption.schema.type instanceof TypeNoValueSchema) {
          tempOption.keys.push(node)
          currentOption = null
          return
        }

        if (node.value !== null) {
          tempOption.keys.push(node)
          tempOption.values.push({
            valueNode: node,
            valueKeyNode: node,
          })
        } else {
          tempOption.keys.push(node)
          currentOption = { ...tempOption, node }
        }

        return
      }

      if (currentOption) {
        currentOption.values.push({
          valueNode: node,
          valueKeyNode: currentOption.node,
        })

        currentOption = null
        return
      }

      argumentsList.push(node)
    })

    if (currentOption) {
      const currentOptionEnd = currentOption as OptionRecordEntry
      currentOption = null

      if (currentOptionEnd.schema.type instanceof TypeNoValueSchema) {
        const lastNode = args[args.length - 1]
        if (lastNode.type !== 'option') {
          throw new NoArgInternalError(
            `Expected option at end for ${currentOptionEnd.schema.name} but ended with ${lastNode.type}`
          )
        }

        currentOptionEnd.keys.push(lastNode)
      } else {
        throw new NoArgClientError(
          `Expected value at end for ${currentOptionEnd.schema.name} but ended`
        )
      }
    }

    return {
      optionsRecord,
      argumentsList,
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

    throw new NoArgUnknownOptionError(node.index, node.arg)
  }
}
