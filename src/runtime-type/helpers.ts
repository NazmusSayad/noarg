import {
  PrimitiveTypeConfigs,
  SimpleArrayConfig,
  SimpleTupleConfig,
} from './config.type'
import { TupleConstructor } from './data-types'

export function getTypeName(
  type: (
    | PrimitiveTypeConfigs
    | SimpleArrayConfig
    | SimpleTupleConfig
  )['type']
): string {
  if (type === String) {
    return 'String'
  } else if (type === Number) {
    return 'Number'
  } else if (type === Boolean) {
    return 'Boolean'
  } else if (Array.isArray(type)) {
    return 'Array'
  } else if (type instanceof TupleConstructor) {
    return 'Tuple'
  }

  throw new Error('Unknown type')
}
