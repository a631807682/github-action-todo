const fsp = require('fs').promises

const defaultParserOptions = {
  delimiters: [`{{`, `}}`]
}

const NodeTypes = {
  TEXT: 0,
  Expression: 1
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
function parseTemplate(source, options) {
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

const getReadmeTemplate = async () => {
  return fsp.readFile('../templates/README.md', 'utf8')
}

const buildReadmeContent = async (context, options) => {
  let source = await getReadmeTemplate()
  let nodes = parseTemplate(source, {
    ...defaultParserOptions,
    ...options
  })
}

module.exports = {
  defaultParserOptions,
  NodeTypes,
  parseTemplate,
  buildReadmeContent
}
