import MJSTable from 'cli-table3'
import * as CJSTable from 'cli-table3'
import currentModule from '../currentModule'

const terminalWidth = process.stdout.columns - 3
const tableWidth =
  terminalWidth > 80 ? 80 : terminalWidth < 50 ? 50 : terminalWidth

const Table = currentModule.isCJS
  ? CJSTable
  : currentModule.isESM
  ? MJSTable
  : undefined

if (!Table) {
  throw new Error('Invalid module type')
}

export default Table!

type Test<TArray extends number[]> = {
  [K in keyof TArray]: K extends `${number}` ? CJSTable.CellValue : TArray[K]
}

export function CustomTable<const TWidths extends number[]>(
  widths: TWidths,
  ...items: Test<TWidths>[]
) {
  const maxLength = Math.max(...items.map((item) => item.length))
  const totalWidth = widths.reduce((a, b) => (a ?? 0) + (b ?? 0), 0) ?? 0
  const colWidths = widths.map((width) => {
    return Math.floor((tableWidth / totalWidth) * (width ?? 1))
  })

  const table = new Table!({
    chars: {
      'top-left': '╭',
      'bottom-left': '╰',
      'top-right': '╮',
      'bottom-right': '╯',
    },

    colWidths,
    wordWrap: true,
    rowAligns: maxLength > 0 ? new Array(maxLength).fill('top') : [],
  })

  table.push(...items)
  console.log(table.toString())
}
