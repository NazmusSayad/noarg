import { PrimitiveLiteralType } from './literal.type'

export class EnumConstructor<T extends (string | number | boolean)[]> {
  constructor(public items: T) {}
}

export class TupleConstructor<T extends PrimitiveLiteralType[]> {
  constructor(public items: T) {}
}

export function Enum<const T extends (string | number | boolean)[]>(
  ...items: T
): EnumConstructor<T> {
  return new EnumConstructor(items)
}

export function Tuple<const T extends PrimitiveLiteralType[]>(...items: T) {
  return new TupleConstructor(items)
}
