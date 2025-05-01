import {
  ProgramConfig,
  ProgramHandler,
  ProgramOptions,
  SystemConfig,
} from '@/types'
import { MergeObject } from '@/utils/utils.type'
import { NoArgProgram } from './noarg-program'

function createProgram<
  TParentOptions extends ProgramOptions,
  TParentConfig extends SystemConfig,
>(parent: NoArgProgram<TParentOptions, TParentConfig>) {
  return {
    createProgram<
      const TChildOptions extends ProgramOptions,
      const TChildConfig extends ProgramConfig,
    >(
      options: TChildOptions,
      handler: ProgramHandler<
        TChildOptions,
        SystemConfig & MergeObject<TParentConfig, TChildConfig>
      >,
      config: TChildConfig
    ) {
      const program = new NoArgProgram<
        TChildOptions,
        SystemConfig & MergeObject<TParentConfig, TChildConfig>
      >(options, { ...parent.config, ...config }, handler)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      parent.addProgram(program as any)
      return createProgram(program)
    },
  }
}

export function createApp<
  const TOptions extends ProgramOptions,
  const TConfig extends SystemConfig,
>(
  options: TOptions,
  handler: ProgramHandler<TOptions, TConfig>,
  appConfig: TConfig
) {
  const appProgram = new NoArgProgram<TOptions, TConfig>(
    options,
    appConfig,
    handler
  )

  function app(args: string[] = process.argv.slice(2)) {
    appProgram.run(args)
  }

  app.createProgram = createProgram(appProgram).createProgram

  return app
}
