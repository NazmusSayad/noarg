export class TypeSchemaBase {
  constructor() {}
}

export interface TypeSchema<T> {
  validate(value: unknown): T
}
