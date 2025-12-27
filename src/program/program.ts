import {
  InternalProgramParserResult,
  parseArgsToAST,
  ProgramParser,
} from '@/parser'
import { Prettify } from '@/utils/utils.type'
import { uuidv4 } from '@/utils/uuid'
import { ExtractProgramResult } from './extract.type'
import {
  ProgramConfig,
  ProgramHandler,
  ProgramRootConfig,
} from './program.type'
import { MergeTwoProgramConfig } from './utils.type'

export class Program<const TRootConfig extends ProgramRootConfig> {
  private readonly entity = 'program' as const
  constructor(private readonly config: TRootConfig) {}

  protected parentProgram: Program<ProgramRootConfig> | null = null
  protected childPrograms: Program<ProgramConfig>[] = []

  protected handler: ProgramHandler<ProgramConfig> | undefined
  protected generateProgramParser(): ProgramParser {
    return new ProgramParser({
      id: uuidv4(),
      command: this.config.name,
      description: this.config.description,

      config: {
        trailingArguments: false,
        doNotSplitArgumentsByComma: false,
      },

      childPrograms: [],

      primaryArguments:
        this.config.arguments?.map((argument) =>
          argument.toInternalArgumentSchema()
        ) ?? [],

      optionalArguments:
        this.config.optionalArguments?.map((argument) =>
          argument.toInternalArgumentSchema()
        ) ?? [],

      additionalArguments:
        this.config.additionalArguments?.toInternalArgumentSchema() ?? null,

      options:
        this.config.options?.map((option) => option.toInternalOptionSchema()) ??
        [],
    })
  }

  public create<const TName extends string>(
    name: TName
  ): Program<
    Prettify<MergeTwoProgramConfig<TRootConfig, { readonly name: TName }>>
  >

  public create<
    const TName extends string,
    const TSubConfig extends Omit<ProgramConfig, 'name'>,
  >(
    name: TName,
    options: TSubConfig
  ): Program<
    Prettify<
      MergeTwoProgramConfig<TRootConfig, TSubConfig & { readonly name: TName }>
    >
  >

  public create<
    const TName extends string,
    const TSubConfig extends Omit<ProgramConfig, 'name'>,
  >(
    name: TName,
    options?: TSubConfig,
    handler?: ProgramHandler<
      MergeTwoProgramConfig<TRootConfig, TSubConfig & { readonly name: TName }>
    >
  ) {
    if (!this.parentProgram && !(this instanceof RootProgram)) {
      throw new Error('Parent program not found, NEVER SHOULD HAPPEN')
    }

    type PrettifiedConfig = Prettify<
      MergeTwoProgramConfig<TRootConfig, TSubConfig & { readonly name: TName }>
    >

    const mergedConfig = {
      ...options,
      name,
      options: [
        ...(this.config.options ?? []).filter((option) => option.config.global),
        ...(options?.options ?? []),
      ],
    } as unknown as PrettifiedConfig

    const childProgram = new Program<PrettifiedConfig>({
      ...mergedConfig,
    })

    childProgram.parentProgram = this
    childProgram.handler = handler as ProgramHandler<ProgramConfig>
    this.childPrograms.push(childProgram)

    return childProgram
  }

  public on(handler: ProgramHandler<TRootConfig>) {
    this.handler = handler as ProgramHandler<ProgramConfig>
    return this
  }
}

export class RootProgram<
  const TRootConfig extends ProgramRootConfig,
> extends Program<TRootConfig> {
  private mapInternalResultToProgramResult(
    result: InternalProgramParserResult
  ): ExtractProgramResult<TRootConfig> {
    return result as unknown as ExtractProgramResult<TRootConfig>
  }

  private async startCore(args: string[]): Promise<void> {
    const programsMap = new Map<string, Program<ProgramConfig>>()
    const rootParser = this.generateProgramParser()

    function generateParsers(
      parentProgram: RootProgram<ProgramConfig>,
      parentParser: ProgramParser
    ) {
      for (const p of parentProgram.childPrograms) {
        const parser = (p as RootProgram<ProgramConfig>).generateProgramParser()
        parentParser.config.childPrograms.push(parser)
        programsMap.set(parser.config.id, p)

        generateParsers(p as RootProgram<ProgramConfig>, parser)
      }
    }

    programsMap.set(rootParser.config.id, this)
    generateParsers(this, rootParser)

    const result = await rootParser.run(parseArgsToAST(args))
    const program = programsMap.get(result.id)
    if (!program) {
      throw new Error('Program not found')
    }

    const handler = (program as RootProgram<ProgramConfig>).handler
    if (!handler) {
      throw new Error('Handler not found')
    }

    handler(this.mapInternalResultToProgramResult(result.result))
  }

  public start(args: string[]) {
    void this.startCore(args)
  }
}
