// import {
//   ProgramConfig,
//   ProgramHandler,
//   ProgramOptions,
//   SystemConfig,
// } from '@/types'
// import { MergeObject, Prettify } from '@/utils/utils.type'
// import { NoArgProgram } from './noarg/noarg-program'

// function createProgram<
//   TParentOptions extends ProgramOptions,
//   TParentConfig extends SystemConfig,
// >(parent: NoArgProgram<TParentOptions, TParentConfig>) {
//   return {
//     createProgram<
//       const TChildOptions extends ProgramOptions,
//       const TChildConfig extends ProgramConfig,
//     >(
//       options: TChildOptions,
//       handler: ProgramHandler<
//         TChildOptions,
//         MergeObject<TParentConfig, TChildConfig>
//       >,
//       config: TChildConfig
//     ) {
//       type NewOptions = TChildOptions
//       type NewConfig = MergeObject<TParentConfig, TChildConfig>

//       const program = new NoArgProgram(
//         { ...options },
//         { ...parent.getConfig(), ...config }
//       )

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       parent.setProgram(program as any)

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       return createProgram<NewOptions, NewConfig>(program as any)
//     },
//   }
// }

// export function createApp<
//   const TOptions extends ProgramOptions,
//   const TConfig extends SystemConfig,
// >(
//   options: TOptions,
//   handler: ProgramHandler<Prettify<TOptions>, TConfig>,
//   appConfig: TConfig
// ) {
//   type NewOptions = TOptions

//   const appProgram = new NoArgProgram<NewOptions, TConfig>(
//     { ...options },
//     { ...appConfig },
//     handler
//   )

//   function app(args: string[] = process.argv.slice(2)) {
//     appProgram.run(args)
//   }

//   app.createProgram = createProgram(appProgram).createProgram

//   return app
// }
