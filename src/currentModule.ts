const isCJS = typeof module !== 'undefined' && typeof exports !== 'undefined'

const isESM =
  typeof __filename === 'undefined' || typeof __dirname === undefined

export default { isCJS, isESM }
