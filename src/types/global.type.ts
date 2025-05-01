/* eslint-disable @typescript-eslint/no-explicit-any */

import { NoArgProgram } from '../no-arg/program'
import { Prettify } from '../utils/utils.type'
import { BaseConfig, ProgramOptions, RootSystemConfig } from './config.type'
import {
  ExtractArguments,
  ExtractCombinedArgs,
  ExtractCombinedFlags,
  ExtractFlags,
  ExtractListArgument,
  ExtractOptionalArguments,
} from './extract.type'

export type ProgramCreateOptions = Prettify<
  Partial<ProgramOptions> & {
    config?: Partial<BaseConfig>
    system?: Partial<RootSystemConfig>
  }
>

export type InferFlags<T> =
  T extends NoArgProgram<string, any, any, infer TOptions> ?
    ExtractFlags<TOptions['flags']>
  : never

export type InferGlobalFlags<T> =
  T extends NoArgProgram<string, any, any, infer TOptions> ?
    ExtractFlags<TOptions['globalFlags']>
  : never

export type InferCombinedFlags<T> =
  T extends NoArgProgram<string, any, any, infer TOptions> ?
    ExtractCombinedFlags<TOptions>
  : never

export type InferArguments<T> =
  T extends NoArgProgram<string, any, any, infer TOptions> ?
    ExtractArguments<TOptions['requiredArgs']>
  : never

export type InferOptionalArguments<T> =
  T extends NoArgProgram<string, any, any, infer TOptions> ?
    ExtractOptionalArguments<TOptions['optionalArgs']>
  : never

export type InferListArguments<T> =
  T extends NoArgProgram<string, any, any, infer TOptions> ?
    undefined extends TOptions['listArg'] ?
      never
    : ExtractListArgument<NonNullable<TOptions['listArg']>>
  : never

export type InferCombinedArgs<T> =
  T extends NoArgProgram<string, any, any, infer TOptions> ?
    ExtractCombinedArgs<TOptions>
  : never
