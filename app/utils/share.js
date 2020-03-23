const isArray = Array.isArray
const objectToString = Object.prototype.toString
const toTypeString = value => objectToString.call(value)
const isPlainObject = val => toTypeString(val) === '[object Object]'

// for converting {{ interpolation }} values to displayed strings.
const toDisplayString = val => {
  return val == null
    ? ''
    : isArray(val) || (isPlainObject(val) && val.toString === objectToString)
    ? JSON.stringify(val, null, 2)
    : String(val)
}

const makeMap = (str, expectsLowerCase) => {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? val => !!map[val.toLowerCase()] : val => !!map[val]
}

const GLOBALS_WHITE_LISTED =
  'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
  'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
  'Object,Boolean,String,RegExp,Map,Set,JSON,Intl'

const isGloballyWhitelisted = makeMap(GLOBALS_WHITE_LISTED)

const isLiteralWhitelisted = makeMap('true,false,null,this')

module.exports = {
  toDisplayString,
  isGloballyWhitelisted,
  isLiteralWhitelisted
}
