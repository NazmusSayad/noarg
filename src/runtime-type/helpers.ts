import {
  PrimitiveTypeConfigs,
  SimpleArrayConfig,
  SimpleTupleConfig,
} from './config.type'
import { TupleConstructor } from './tuple'

export function getTypeName(
  typeV2: (
    | PrimitiveTypeConfigs
    | SimpleArrayConfig
    | SimpleTupleConfig
  )['typeV2']
): string {
  if (typeV2 === String) {
    return 'String'
  } else if (typeV2 === Number) {
    return 'Number'
  } else if (typeV2 === Boolean) {
    return 'Boolean'
  } else if (Array.isArray(typeV2)) {
    return 'Array'
  } else if (typeV2 instanceof TupleConstructor) {
    return 'Tuple'
  }

  throw new Error('Unknown type')
}
