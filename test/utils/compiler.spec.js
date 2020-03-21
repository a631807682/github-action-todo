const {
  NodeTypes,
  parseTemplate,
  defaultParserOptions: options
} = require('../../app/utils/compiler')

describe('compiler', () => {
  describe('parse', () => {
    test('parse text template', () => {
      let node = parseTemplate('My name is Tom', options)
      expect(node).toMatchObject([
        {
          type: NodeTypes.TEXT,
          content: 'My name is Tom'
        }
      ])
    })

    test('parse interpolation template', () => {
      let node = parseTemplate('{{name}}', options)
      expect(node).toMatchObject([
        {
          type: NodeTypes.Expression,
          content: 'name'
        }
      ])
    })

    test('parse hybrid template', () => {
      let node = parseTemplate('My name is {{name}}', options)
      expect(node).toMatchObject([
        {
          type: NodeTypes.TEXT,
          content: 'My name is '
        },
        {
          type: NodeTypes.Expression,
          content: 'name'
        }
      ])
    })
  })
})
