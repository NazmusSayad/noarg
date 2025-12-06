import { InternalASTNode } from '../ast.type'
import { NodeParserAST } from '../node-parser-ast'

export class FakeProgramParserAST extends NodeParserAST {
  public parse(args: InternalASTNode[]) {
    return super.parse(args)
  }
}
