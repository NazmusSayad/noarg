import { InternalASTNode, InternalASTOptionNode } from './ast.type'
import { InternalProgramParserOptionEntry } from './program-parser.type'

export type OptionRecordEntry = {
	schema: InternalProgramParserOptionEntry

	keys: InternalASTOptionNode[]
	values: {
		valueNode: InternalASTNode
		optionNode: InternalASTOptionNode
	}[]
}
