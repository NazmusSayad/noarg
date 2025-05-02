export type PrimitiveLiteralType =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor

export type EnumLiteralType = (string | number | boolean)[]

export type AvailableLiteralType =
  | EnumLiteralType
  | PrimitiveLiteralType
  | [PrimitiveLiteralType] // Array
  | [PrimitiveLiteralType, ...PrimitiveLiteralType[]] // Tuple
