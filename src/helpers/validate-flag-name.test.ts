import { describe, test, expect } from 'bun:test'
import validateFlagName from './validate-flag-name'

describe('validateFlagName', () => {
  test('throws error for empty flag name', () => {
    expect(() => validateFlagName('')).toThrow()
  })

  test('throws error for flag name containing spaces', () => {
    expect(() => validateFlagName('flag name')).toThrow(
      'can not contain spaces'
    )
  })

  test('throws error for flag name starting with a dash', () => {
    expect(() => validateFlagName('-flag')).toThrow("should not start with '-'")
  })

  test('throws error for flag name containing an equals sign', () => {
    expect(() => validateFlagName('flag=name')).toThrow(
      "should not contain '='"
    )
  })

  test('throws error for flag name ending with booleanFalseEnding', () => {
    expect(() => validateFlagName('flag-false', '-false')).toThrow()
  })

  test('does not throw error for valid flag name', () => {
    expect(() => validateFlagName('flag')).not.toThrow()
  })

  test('does not throw error for flag name with special characters', () => {
    expect(() => validateFlagName('flag_name')).not.toThrow()
  })

  test('throws error for flag name with multiple spaces', () => {
    expect(() => validateFlagName('flag name with spaces')).toThrow(
      'can not contain spaces'
    )
  })

  test('throws error for flag name with leading spaces', () => {
    expect(() => validateFlagName(' flag')).toThrow('can not contain spaces')
  })

  test('throws error for flag name with trailing spaces', () => {
    expect(() => validateFlagName('flag ')).toThrow('can not contain spaces')
  })

  test('throws error for flag name with multiple dashes at the start', () => {
    expect(() => validateFlagName('--flag')).toThrow(
      "should not start with '-'"
    )
  })

  test('throws error for flag name with multiple equals signs', () => {
    expect(() => validateFlagName('flag=name=value')).toThrow(
      "should not contain '='"
    )
  })

  test('throws error for flag name ending with booleanFalseEnding even if valid otherwise', () => {
    expect(() => validateFlagName('valid-false', '-false')).toThrow()
  })

  test('does not throw error for flag name with numbers', () => {
    expect(() => validateFlagName('flag123')).not.toThrow()
  })

  test('does not throw error for flag name with mixed case', () => {
    expect(() => validateFlagName('FlagName')).not.toThrow()
  })

  test('throws error for flag name with only dashes', () => {
    expect(() => validateFlagName('---')).toThrow("should not start with '-'")
  })

  test('throws error for flag name with only spaces', () => {
    expect(() => validateFlagName('   ')).toThrow()
  })

  test('does not throw error for flag name with hyphens in the middle', () => {
    expect(() => validateFlagName('flag-name')).not.toThrow()
  })

  test('throws error for flag name ending with a space and booleanFalseEnding', () => {
    expect(() => validateFlagName('flag -false', '-false')).toThrow()
  })
})
