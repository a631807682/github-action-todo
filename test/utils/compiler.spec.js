const {
  NodeTypes,
  parse,
  transform,
  defaultParserOptions: options
} = require('../../app/utils/compiler')

describe('compiler', () => {
  describe('parse', () => {
    test('parse text template', () => {
      let node = parse('My name is Tom', options)
      expect(node).toMatchObject([
        {
          type: NodeTypes.TEXT,
          content: 'My name is Tom'
        }
      ])
    })

    test('parse interpolation template', () => {
      let node = parse('{{name}}', options)
      expect(node).toMatchObject([
        {
          type: NodeTypes.Expression,
          content: 'name'
        }
      ])
    })

    test('parse hybrid template', () => {
      let node = parse('My name is {{name}}', options)
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

  describe('transform', () => {
    test('transform interpolation expressions', () => {
      const ast = transform([
        {
          type: NodeTypes.Expression,
          content: 'name'
        }
      ])

      expect(ast).toMatchObject([
        {
          type: NodeTypes.Expression,
          content: '_ctx.name'
        }
      ])
    })
  })
})
