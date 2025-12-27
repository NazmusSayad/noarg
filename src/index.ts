import { createArgument, createOption, createProgram } from './program'

const noargCore = {
  createProgram: createProgram,
  argument: createArgument,
  option: createOption,
}

export const na = noargCore
export const noarg = noargCore

export * from './program/extract.type'
export * from './program/program.type'
