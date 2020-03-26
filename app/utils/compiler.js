const fsp = require('fs').promises
const {
  toDisplayString,
  isGloballyWhitelisted,
  isLiteralWhitelisted
} = require('./share')

const defaultParserOptions = {
  delimiters: [`{{`, `}}`]
}

const NodeTypes = {
  TEXT: 0,
  Expression: 1
}

const getReadmeTemplate = async () => {
  return fsp.readFile('../templates/README.md', 'utf8')
}

/**
 * parse text to textNodes like:
 * [{
 *   type: NodeTypes.TEXT,
 *   content: 'my name is'
 * },{
 *   type: NodeTypes.Expression,
 *   content: 'name'
 * }]
 * @param {string} source
 * @param {object} options
 */
function parse(source, options) {
  const [open, close] = options.delimiters
  let offset = 0
  let textNodes = []
  while (offset < source.length - 1) {
    let nodes = []
    const openIndex = source.indexOf(open)
    if (openIndex === -1) {
      nodes.push({
        type: NodeTypes.TEXT,
        content: source.slice(offset, source.length)
      })

      offset = source.length
    } else {
      // match '{{'
      const closeIndex = source.indexOf(close, openIndex)
      if (closeIndex === -1) {
        throw new Error('Interpolation end sign was not found.')
      } else {
        if (offset < openIndex) {
          nodes.push({
            type: NodeTypes.TEXT,
            content: source.slice(offset, openIndex)
          })
        }
        nodes.push({
          type: NodeTypes.Expression,
          content: source.slice(openIndex + open.length, closeIndex)
        })

        offset = closeIndex + close.length
      }
    }

    textNodes = textNodes.concat(nodes)
  }
  return textNodes
}

function transform(nodes) {
  for (let node of nodes) {
    if (node.type === NodeTypes.Expression) {
      // fast path if expression is a simple identifier.
      const rawExp = node.content
      const bailConstant = rawExp.indexOf(`(`) > -1
      if (!isGloballyWhitelisted(rawExp) && !isLiteralWhitelisted(rawExp)) {
        // Transform expressions like {{ foo }} to `_ctx.foo`
        node.content = `_ctx.` + node.content
      } else if (!bailConstant) {
      }
    }
  }
  return nodes
}

function generate(nodes) {
  let code = ''
}

const buildReadmeContent = async (context, options) => {
  let source = await getReadmeTemplate()
  let nodes = parse(source, {
    ...defaultParserOptions,
    ...options
  })
  let ast = transform(nodes)
  // return render()
}

module.exports = {
  defaultParserOptions,
  NodeTypes,
  parse,
  transform,
  buildReadmeContent
}
