import { Prettify } from '@/utils/utils.type'
import { RootProgram } from './program'
import { ProgramHandler, ProgramRootConfig } from './program.type'

function createProgram<const TName extends string>(
  name: TName
): RootProgram<Prettify<{ readonly name: TName }>>

function createProgram<
  const TName extends string,
  const TOptions extends Omit<ProgramRootConfig, 'name'>,
>(
  name: TName,
  options: TOptions,
  handler?: ProgramHandler<{ readonly name: TName } & TOptions>
): RootProgram<Prettify<{ readonly name: TName } & TOptions>>

function createProgram<
  const TName extends string,
  const TOptions extends Omit<ProgramRootConfig, 'name'>,
>(
  name: TName,
  options?: TOptions,
  handler?: ProgramHandler<{ readonly name: TName } & TOptions>
) {
  type PrettifiedConfig = Prettify<{ readonly name: TName } & TOptions>
  const program = new RootProgram<PrettifiedConfig>({
    name,
    ...(options ?? {}),
  } as unknown as PrettifiedConfig)

  if (handler) {
    program.on(handler)
  }

  return program
}

export { createProgram }
