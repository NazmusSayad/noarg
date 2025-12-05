/**
 * @tutorial PLEASE_UPDATE_READ_FILE_CAREFULLY
 * This file is part of the NoArg library.
 */

import { NoArgWrapper } from '@/noarg'
import { PartialProgramConfig } from '@/types/config.type'
import { PartialProgramOptions } from '@/types/options.type'
import { ProgramHandler } from '@/types/parser.type'
import { AppBuilder } from './types'

function programBuilderFactory(
  parent: NoArgWrapper<PartialProgramOptions, PartialProgramConfig>
) {
  function programBuilder(
    options: PartialProgramOptions,
    handler: ProgramHandler<PartialProgramOptions, PartialProgramConfig>,
    config: PartialProgramConfig
  ) {
    const mergedOptions = { ...parent.getOptions(), ...options }
    const mergedConfig = { ...parent.getConfig(), ...config }

    const childProgram = new NoArgWrapper(
      mergedOptions,
      mergedConfig,
      handler,
      parent
    )

    parent.addProgram(childProgram)
    return programBuilderFactory(childProgram)
  }

  programBuilder.program = programBuilder

  return programBuilder
}

export function createApp<
  const TOptions extends PartialProgramOptions,
  const TConfig extends PartialProgramConfig = {},
>(
  options: TOptions & PartialProgramOptions,
  handler: ProgramHandler<TOptions, TConfig>,
  config?: PartialProgramConfig & TConfig
): AppBuilder<TOptions, TConfig> {
  const program = new NoArgWrapper<TOptions, TConfig>(
    options,
    // @ts-expect-error GFS
    config ?? {},
    handler
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const app = programBuilderFactory(program as any) as unknown as AppBuilder<
    TOptions,
    TConfig
  >

  app.start = (args = process.argv.slice(2)) => {
    program.start(args)
  }

  app.getProgram = () => program

  return app
}
