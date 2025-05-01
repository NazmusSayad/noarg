import NoArg from '..'
import { ProgramCreateOptions } from '../types/global.type'

export function testBaseProgram(
  config: ProgramCreateOptions,
  ...argv: string[]
): Promise<any> {
  return new Promise((resolve) => {
    NoArg.create('test', { ...config })
      .on((args) => resolve(args))
      .start(argv)
  })
}
