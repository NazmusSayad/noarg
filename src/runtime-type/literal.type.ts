import { EnumConstructor, TupleConstructor } from './literal'

export type PrimitiveLiteralType =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | EnumConstructor<(string | number | boolean)[]>

export type AvailableLiteralType =
  | PrimitiveLiteralType
  | PrimitiveLiteralType[]
  | TupleConstructor<PrimitiveLiteralType[]>
