import { Prettify } from '@/utils/utils.type'
import { Program } from './program'
import { ProgramHandler, ProgramRootConfig } from './program.type'

function createProgram<const TName extends string>(
  name: TName
): Program<Prettify<{ readonly name: TName }>>

function createProgram<
  const TName extends string,
  const TOptions extends Omit<ProgramRootConfig, 'name'>,
>(
  name: TName,
  options: TOptions,
  handler?: ProgramHandler<{ readonly name: TName } & TOptions>
): Program<Prettify<{ readonly name: TName } & TOptions>>

function createProgram<
  const TName extends string,
  const TOptions extends Omit<ProgramRootConfig, 'name'>,
>(
  name: TName,
  options?: TOptions,
  handler?: ProgramHandler<{ readonly name: TName } & TOptions>
) {
  type PrettifiedConfig = Prettify<{ readonly name: TName } & TOptions>
  const program = new Program<PrettifiedConfig>({
    name,
    ...(options ?? {}),
  } as unknown as PrettifiedConfig)

  if (handler) {
    program.on(handler)
  }

  return program
}

export { createProgram }
