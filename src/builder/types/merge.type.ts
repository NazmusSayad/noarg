import {
  ProgramArgConfig,
  ProgramFlagOptions,
  ProgramFlagsRecord,
  ProgramOptionalArgConfig,
  ProgramOptions,
} from '@/types'
import { EnforceType, MergeObject, Prettify } from '@/utils/utils.type'

export type GetGlobalFlags<T extends ProgramOptions['flags']> = EnforceType<
  ProgramFlagsRecord,
  { [K in keyof T as T[K] extends { global: true } ? K : never]: T[K] }
>

export type MergeWithGlobalFlags<
  T extends ProgramOptions,
  U extends Record<string, ProgramFlagOptions>,
> = MergeObject<
  T,
  {
    flags: Prettify<MergeObject<GetGlobalFlags<T['flags']>, U>>
  }
>

export type MergeFlags<
  T extends ProgramOptions,
  U extends Record<string, ProgramFlagOptions>,
> = MergeObject<
  T,
  {
    flags: Prettify<MergeObject<T['flags'], U>>
  }
>

export type AddRequiredArgs<
  T extends ProgramOptions['args'],
  U extends ProgramArgConfig,
> = [...EnforceType<unknown[], T, []>, U]

export type AddOptionalArgs<
  T extends ProgramOptions['optArgs'],
  U extends ProgramOptionalArgConfig,
> = [...EnforceType<unknown[], T, []>, U]
