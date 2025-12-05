type InternalASTOptionNode = {
  type: 'option'

  arg: string
  key: string
  value: string | null
}

type InternalASTArgumentNode = {
  type: 'argument'

  arg: string
}

export type InternalASTNode = InternalASTOptionNode | InternalASTArgumentNode
