import { ExtractTypeOutput } from '../schema'
import {
  MakeObjectOptional,
  MergeObject,
  Prettify,
  WritableObject,
} from '../utils/utils.type'
import {
  ArgOption,
  FlagOption,
  ListArgOption,
  OptionalArgOption,
  ProgramConfig,
  ProgramOptions,
  RootSystemConfig,
} from './config.type'

export type ExtractArguments<T extends ArgOption[]> = {
  [K in keyof T]: ExtractTypeOutput<T[K]['type']>
}

export type ExtractOptionalArguments<T extends OptionalArgOption[]> = {
  [K in keyof ExtractArguments<T>]: ExtractArguments<T>[K] | undefined
}

export type ExtractListArgument<T extends ListArgOption> = ExtractTypeOutput<
  T['type']
>[]

export type ExtractFlags<T extends FlagOption> = MakeObjectOptional<
  WritableObject<{
    [K in keyof T]:
      | ExtractTypeOutput<T[K]>
      | (T[K]['config'] extends { required: true } ? never
        : T[K]['config'] extends { default: unknown } ? never
        : undefined)
  }>
>

export type ExtractCombinedArgs<TOptions extends ProgramOptions> = {
  readonly flags: Prettify<ExtractCombinedFlags<TOptions>>

  readonly requiredArgs: ExtractArguments<NonNullable<TOptions['requiredArgs']>>

  readonly optionalArgs: ExtractOptionalArguments<
    NonNullable<TOptions['optionalArgs']>
  >

  readonly listArg: TOptions['listArg'] extends object ?
    [
      ListArguments: Prettify<
        ExtractListArgument<NonNullable<TOptions['listArg']>>
      >,
    ]
  : []

  readonly trailingArgs: TOptions['trailingArgs'] extends (
    NonNullable<ProgramOptions['trailingArgs']>
  ) ?
    TOptions['trailingArgs'] extends '' ?
      []
    : [TrailingArguments: string[]]
  : []
}

export type ExtractCombinedFlags<TOptions extends ProgramOptions> =
  ExtractFlags<
    MergeObject<
      NonNullable<TOptions['globalFlags']>,
      NonNullable<TOptions['flags']>
    >
  >

export type ExtractActionCallback<
  TSystem extends RootSystemConfig,
  TConfig extends ProgramConfig,
  TOptions extends ProgramOptions,
> = (
  options: Prettify<ExtractCombinedArgs<TOptions>>,
  config: {
    readonly config: TConfig
    readonly system: TSystem
  }
) => void
