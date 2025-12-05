export const AST_NODE_TYPE = ['argument', 'option'] as const

export type InternalASTNode = {
  name: string
  type: (typeof AST_NODE_TYPE)[number]

  content: null | {
    key: string
    value: string
  }
}
