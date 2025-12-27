import {
  InternalProgramParserArgumentEntry,
  InternalProgramParserOptionEntry,
  parseArgsToAST,
  ProgramParser,
} from '@/parser'
import { Prettify } from '@/utils/utils.type'
import { uuidv4 } from '@/utils/uuid'
import {
  ProgramArgumentConfig,
  ProgramConfig,
  ProgramHandler,
  ProgramOptionConfig,
  ProgramRootConfig,
} from './program.type'
import { MergeTwoProgramConfig } from './utils.type'

export class Program<const TRootConfig extends ProgramRootConfig> {
  private readonly entity = 'program' as const

  protected parser
  protected rootProgram: RootProgram<ProgramRootConfig> | null = null
  protected parentProgram: Program<ProgramRootConfig> | null = null
  protected handler: ProgramHandler<ProgramConfig> | undefined

  constructor(private readonly config: TRootConfig) {
    this.parser = new ProgramParser({
      id: uuidv4(),
      command: config.name,
      description: config.description,

      config: {
        trailingArguments: false,
        doNotSplitArgumentsByComma: false,
      },

      childPrograms: [],

      primaryArguments:
        config.arguments?.map((argument) =>
          argument.toInternalArgumentSchema()
        ) ?? [],

      optionalArguments:
        config.optionalArguments?.map((argument) =>
          argument.toInternalArgumentSchema()
        ) ?? [],

      additionalArguments:
        config.additionalArguments?.toInternalArgumentSchema() ?? null,

      options:
        config.options?.map((option) => option.toInternalOptionSchema()) ?? [],
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
    if (!this.rootProgram) {
      throw new Error('Root program not found, NEVER SHOULD HAPPEN')
    }

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
    childProgram.rootProgram = this.rootProgram
    childProgram.handler = handler as ProgramHandler<ProgramConfig>

    this.parser.config.childPrograms.push(childProgram.parser)

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
  constructor(config: TRootConfig) {
    super(config)
    this.rootProgram = this
    this.parentProgram = null
  }

  public start(args: string[]) {
    this.parser
      .run(parseArgsToAST(args))
      .then((result) => {
        console.log({ result })
      })
      .catch((error) => {
        console.error({ error })
      })
  }
}

export class ProgramArgument<const T extends ProgramArgumentConfig> {
  private readonly entity = 'argument' as const
  constructor(public readonly config: T) {}

  public toInternalArgumentSchema(): InternalProgramParserArgumentEntry {
    return {
      name: this.config.name,
      type: this.config.type,
      description: this.config.description,
    }
  }
}

export class ProgramOption<const T extends ProgramOptionConfig> {
  private readonly entity = 'option' as const
  constructor(public readonly config: T) {}

  public toInternalOptionSchema(): InternalProgramParserOptionEntry {
    return {
      name: this.config.name,
      type: this.config.type,
      description: this.config.description,
      askQuestion: this.config.askQuestion,
      aliases: this.config.aliases ?? [],
      required: this.config.required ?? false,
    }
  }
}
