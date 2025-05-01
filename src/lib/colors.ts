import colors from 'ansi-colors'

// @ts-expect-error Module Shit
export default (colors.default ?? colors) as typeof colors
