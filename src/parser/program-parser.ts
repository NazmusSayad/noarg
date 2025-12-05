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
  InternalProgramParserFlagEntry,
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
      this.options.flags.map((flag) => [
        flag.name,
        {
          schema: flag,
          presences: 0,
          arguments: [] as { id: string; value: string }[],
        },
      ])
    )

    type CurrentOption = (typeof optionsRecord)[keyof typeof optionsRecord]
    let currentOption: CurrentOption | null = null

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

        const aliasParsed = node.isAlias ? this.detectAliases(node) : null
        const flag =
          optionsRecord[
            node.isAlias && typeof aliasParsed === 'string'
              ? aliasParsed
              : node.key
          ]

        if (!flag) {
          throw new NoArgUnknownFlagError(node.id, node.arg)
        }

        if (flag.schema.type instanceof TypeNoValueSchema) {
          flag.presences++
          currentOption = null
          return
        }

        if (node.value === null) {
          currentOption = flag
        } else {
          flag.arguments.push({
            id: node.id,
            value: node.value,
          })
        }

        return
      }

      if (currentOption) {
        const flagValue = this.detectFlag(currentOption.schema, node)
        if (flagValue) {
          if (flagValue === 'no-value') {
            currentOption.presences++
            currentOption = null
          } else {
            currentOption.arguments.push({
              id: node.id,
              value: flagValue.arg,
            })

            currentOption = null
            return
          }
        }
      }

      argumentsList.push(node)
    })

    if (currentOption) {
      const co = currentOption as CurrentOption
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
      flags: {},
    }
  }

  private detectAliases(node: InternalASTOptionNode): string | string[] {
    // 1. Check if there is a flag schema with the exact key, if yes return that
    // 2. If no then split the string into chars, check if they are valid aliases, if yes then also confirm they are all no-value flags, if yes return them

    for (const flag of this.options.flags) {
      for (const alias of flag.aliases) {
        if (alias === node.key) {
          return flag.name
        }
      }
    }

    const splitted = node.key.split('')
    const splittedOptions: string[] = []

    for (const key of splitted) {
      const flag = this.options.flags.find((flag) => flag.aliases.includes(key))

      if (flag?.type instanceof TypeNoValueSchema) {
        splittedOptions.push(flag.name)
      }
    }

    if (splittedOptions.length === splitted.length) {
      return splittedOptions
    }

    throw new NoArgUnknownFlagError(node.id, node.arg)
  }

  private detectFlag(
    flag: InternalProgramParserFlagEntry,
    arg: InternalASTArgumentNode
  ): InternalASTArgumentNode | null | 'no-value' {
    if (flag.type instanceof TypeNoValueSchema) {
      return 'no-value'
    }

    if (
      flag.type instanceof PrimitiveUnionSchema ||
      flag.type instanceof TypeBooleanSchema ||
      flag.type instanceof TypeStringSchema ||
      flag.type instanceof TypeNumberSchema ||
      flag.type instanceof TypeArraySchema ||
      flag.type instanceof TypeTupleSchema
    ) {
      return arg
    }

    return null
  }
}
