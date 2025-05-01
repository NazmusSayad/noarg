export function validateNonEmptyString(
  value: string | undefined,
  name: string
) {
  if (typeof value !== 'string' || !value) {
    throw new Error(`\`${name}\` must be a non empty string`)
  }
}
