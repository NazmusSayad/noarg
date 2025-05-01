import { ExtractTypeOutput } from '../schema'
import {
  Prettify,
  MergeObject,
  WritableObject,
  MakeObjectOptional,
} from '../utils/utils.type'
import {
  ArgsOption,
  OptionalArgsOption,
  ListArgsOption,
  FlagOption,
  ProgramOptions,
  RootSystemConfig,
  ProgramConfig,
} from './config.type'
 
export type ExtractArguments<T extends ArgsOption[]> = {
  [K in keyof T]: ExtractTypeOutput<T[K]['type']>
}

export type ExtractOptionalArguments<
  T extends OptionalArgsOption[]
> = {
  [K in keyof ExtractArguments<T>]: ExtractArguments<T>[K] | undefined
}

export type ExtractListArgument<T extends ListArgsOption> =
  ExtractTypeOutput<T['type']>[]

export type ExtractFlags<T extends FlagOption> = Prettify<
  MakeObjectOptional<
    WritableObject<{
      [K in keyof T]:
        | ExtractTypeOutput<T[K]>
        | (T[K]['config']['required'] extends true ? never : undefined)
    }>
  >
>

export type ExtractCombinedArgs<
  TOptions extends ProgramOptions
> = {
  requiredArgs: ExtractArguments<NonNullable<TOptions['requiredArgs']>>

  optionalArgs: ExtractOptionalArguments<NonNullable<TOptions['optionalArgs']>>

  listArg: TOptions['listArg'] extends {}
    ? [
        ListArguments: Prettify<
          ExtractListArgument<NonNullable<TOptions['listArg']>>
        >
      ]
    : []

  trailingArgs: TOptions['trailingArgs'] extends NonNullable<
    ProgramOptions['trailingArgs']
  >
    ? TOptions['trailingArgs'] extends ''
      ? []
      : [TrailingArguments: string[]]
    : []

  flags: Prettify<
    MakeObjectOptional<
      ExtractFlags<
        MergeObject<
          NonNullable<TOptions['globalFlags']>,
          NonNullable<TOptions['flags']>
        >
      >
    >
  >
}

export type ExtractCombinedFlags<
  TOptions extends ProgramOptions
> = Prettify<
  MakeObjectOptional<
    ExtractFlags<
      MergeObject<
        NonNullable<TOptions['globalFlags']>,
        NonNullable<TOptions['flags']>
      >
    >
  >
>

export type ExtractActionCallback<
  TSystem extends RootSystemConfig,
  TConfig extends ProgramConfig,
  TOptions extends ProgramOptions
> = (
  options: ExtractCombinedArgs<TOptions>,
  config: {
    config: TConfig
    system: TSystem
  }
) => void
