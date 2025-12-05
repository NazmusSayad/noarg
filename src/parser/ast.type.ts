import { Prettify } from '@/utils/utils.type'

type AstBaseNode = {
  id: string
}

export type InternalASTOptionNode = Prettify<
  AstBaseNode & {
    type: 'option'

    arg: string
    key: string
    value: string | null
  }
>

export type InternalASTArgumentNode = Prettify<
  AstBaseNode & {
    type: 'argument'

    arg: string
  }
>

export type InternalASTNode = InternalASTOptionNode | InternalASTArgumentNode
