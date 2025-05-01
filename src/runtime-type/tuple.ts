import { PrimitiveTypeConfigs } from '.'

export function Tuple<const T extends [...PrimitiveTypeConfigs[]]>(
  ...elements: T
) {
  return new TupleConstructor(elements)
}

export class TupleConstructor<const T extends [...PrimitiveTypeConfigs[]]> {
  name = 'Tuple'
  private elements: T

  constructor(elements: T) {
    this.elements = elements
  }

  public get() {
    return this.elements
  }
}
