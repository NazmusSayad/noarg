import { NoArgUnknownFlagError } from '@/constants/errors'
import {
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
    const flagsSchemaRecord = Object.fromEntries(
      this.options.flags.map((flag) => [flag.name, flag])
    )

    const argumentsList: InternalASTArgumentNode[] = []
    const flagsList: Record<string, { id: string; value: string }[]> = {}

    let currentNode: InternalASTOptionNode | null = null
    args.forEach((node) => {
      if (node.type === 'option') {
        if (!flagsSchemaRecord[node.key]) {
          throw new NoArgUnknownFlagError(node.id, node.arg)
        }

        flagsList[node.key] ??= []

        if (node.value) {
          flagsList[node.key].push({
            id: node.id,
            value: node.value,
          })
        } else {
          currentNode = node
        }

        return
      }

      if (currentNode) {
        const flag = flagsList[currentNode.key]
        const flagSchema = flagsSchemaRecord[currentNode.key]

        if (flag && flagSchema) {
          const flagValue = this.detectFlag(flagSchema, node)

          if (flagValue && flagValue !== true) {
            currentNode = null
            return flag.push({ id: node.id, value: flagValue.arg })
          }

          if (flagValue === true) {
            currentNode = null
            flag.push({ id: '', value: '' })
          }
        }
      }

      argumentsList.push(node)
    })

    console.log(flagsList)
    console.log(argumentsList)

    return {
      primaryArguments: [],
      optionalArguments: [],
      listArguments: [],
      flags: {},
    }
  }

  private detectFlag(
    flag: InternalProgramParserFlagEntry,
    arg: InternalASTArgumentNode
  ): InternalASTArgumentNode | null | true {
    if (flag.type instanceof TypeNoValueSchema) {
      return true
    }

    if (
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
