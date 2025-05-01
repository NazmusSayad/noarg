export const trustedSymbol = Symbol('TRUSTED SYMBOL')

export function verifyTrustedSymbol(sym: symbol) {
  if (sym !== trustedSymbol) {
    throw new Error('Trusted symbol verification failed!')
  }
}
