import { verifySymbol } from '../constants/admin-symbol'

export class NoArgError extends Error {
  constructor(messages: string) {
    super(messages)
  }
}

export function verifyNoArgSymbol(symbol: symbol, className: string) {
  verifySymbol(symbol, `${className} is not meant to be instantiated directly`)
}
