import {
  ProgramArgConfig,
  ProgramFlagOptions,
  ProgramOptionalArgConfig,
  ProgramOptions,
} from '@/types'
import { Prettify } from '@/utils/utils.type'

export type BuilderRequiredArgConfig = Prettify<
  Omit<ProgramArgConfig, 'name' | 'type'>
>

export type BuilderOptionalArgConfig = Prettify<
  Omit<ProgramOptionalArgConfig, 'name' | 'type'>
>

export type BuilderListArgConfig = Prettify<
  Omit<ProgramArgConfig, 'name' | 'type'>
>

export type BuilderFlagConfig = Prettify<Omit<ProgramFlagOptions, 'type'>>

export type BuilderProgramOptions = Prettify<
  Pick<
    ProgramOptions,
    | 'description'
    | 'notes'
    | 'trailingArgs'
    | 'helpUsageStructure'
    | 'helpUsageTrailingArgsLabel'
  >
>
