import { NoArgUnknownFlagError } from '@/constants/errors'
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
    const flagsRecord = Object.fromEntries(
      this.options.flags.map((flag) => [
        flag.name,
        {
          schema: flag,
          arguments: [] as { id: string; value: string }[],
        },
      ])
    )

    let currentNode: InternalASTOptionNode | null = null
    args.forEach((node) => {
      if (node.type === 'option') {
        const flag = flagsRecord[node.key]

        if (!flag) {
          throw new NoArgUnknownFlagError(node.id, node.arg)
        }

        if (node.value) {
          flag.arguments.push({
            id: node.id,
            value: node.value,
          })
        } else {
          currentNode = node
        }

        return
      }

      if (currentNode) {
        const flag = flagsRecord[currentNode.key]

        if (flag) {
          const flagValue = this.detectFlag(flag.schema, node)

          if (flagValue === 'no-value') {
            currentNode = null
            flag.arguments.push({ id: '', value: '' })
          }

          if (flagValue && flagValue !== 'no-value') {
            currentNode = null
            return flag.arguments.push({ id: node.id, value: flagValue.arg })
          }
        }
      }

      argumentsList.push(node)
    })

    console.log(flagsRecord)
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
