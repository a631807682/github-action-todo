const {
  NodeTypes,
  parse,
  transform,
  generate,
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
          type: NodeTypes.TEXT,
          content: 'My name is '
        },
        {
          type: NodeTypes.Expression,
          content: 'name'
        }
      ])

      expect(ast).toMatchObject([
        {
          type: NodeTypes.TEXT,
          content: '`My name is `'
        },
        {
          type: NodeTypes.Expression,
          content: '_ctx.name'
        }
      ])
    })
  })

  describe('generate', () => {
    const codeStringify = code => {
      let res = ''
      for (let line of code.split('\n')) {
        res += line.trim()
      }
      return res
    }

    test('generate hybrid ast', () => {
      const ast = [
        {
          type: NodeTypes.TEXT,
          content: '`My name is `'
        },
        {
          type: NodeTypes.Expression,
          content: '_ctx.name'
        }
      ]
      let code = generate(ast)
      expect(codeStringify(code)).toMatch(
        codeStringify(`return function render(_ctx) {
          return \`My name is \`+_ctx.name
        }`)
      )
      let render = new Function(code)()
      expect(render({ name: 'Tom' })).toMatch('My name is Tom')
    })
  })
})
