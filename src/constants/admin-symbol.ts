export const trustedSymbol = Symbol('NoArgConstructorAdmin')

export function verifySymbol(symbol: symbol, message?: string) {
  if (symbol !== trustedSymbol) {
    throw new Error(message ?? 'Invalid symbol')
  }
}
