import { Prettify } from '@/utils/utils.type'

type AstBaseNode = {
  index: number
  raw: string
}

export type InternalASTOptionNode = Prettify<
  AstBaseNode & {
    type: 'option'
    isAlias: boolean
    key: string
    value: string | null
  }
>

export type InternalASTArgumentNode = Prettify<
  AstBaseNode & {
    type: 'argument'
  }
>

export type InternalASTNode = InternalASTOptionNode | InternalASTArgumentNode
