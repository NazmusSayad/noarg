/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProgramOptions, SystemConfig } from '@/types'
import { Prettify } from '@/utils/utils.type'
import { BuilderApp, BuilderProgram } from '..'

export type InferAppOrProgram<
  T,
  TOptions extends ProgramOptions,
  TConfig extends SystemConfig,
> =
  T extends BuilderApp<any, any> ?
    BuilderApp<Prettify<TOptions>, Prettify<TConfig>>
  : T extends BuilderProgram<any, any> ?
    BuilderProgram<Prettify<TOptions>, Prettify<TConfig>>
  : never
