import { InternalASTNode } from '../ast.type'
import { ProgramParserAST } from '../program-parser-ast'

export class FakeProgramParserAST extends ProgramParserAST {
  public parse(args: InternalASTNode[]) {
    return super.parse(args)
  }
}
