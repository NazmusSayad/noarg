import table from 'cli-table3'

// @ts-expect-error Module Shit
export default (table.default ?? table) as typeof table
