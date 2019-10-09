const vuese = require('@vuese/parser')
const faker = require('faker')

function resolvePath(object, path, defaultValue) {
  return path.split('.').reduce((o, p) => o ? o[p] : defaultValue, object)
}

class VUETransformer {
  static mimeTypes () {
    return ['application/x-vue']
  }

  parse (source) {
    const result = vuese.parser(source)

    if (result.props) {
      result.props.forEach(p => {
        p.type = typeof p.type === 'string' ? [p.type] : p.type
        if (p.describe && p.describe.indexOf('Image') > -1) p.isImage = true

        let fakerFn = p.describe && p.describe.find(d => d.indexOf('faker.') > -1)
        if (fakerFn) {
          fakerFn = fakerFn.replace('faker.','')
          if (typeof resolvePath(faker, fakerFn) === 'function') p.fakerFn = fakerFn
          else console.log(`WARNING: ${fake} is not a valid faker function`)
        }
      })
    }

    if (result && typeof result === 'object') {
      return {
        ...result,
        source
      }
    }

    return null
  }

  extendNodeType ({ graphql }) {
    return {
      name: {
        type: graphql.GraphQLString,
        resolve: node => node.name || node.fileInfo.name
      },
      mockData: {
        type: graphql.GraphQLString,
        resolve: node => {
          let mock = {}
          node.props && node.props.forEach(p => {
            let type = Array.isArray(p.type) ? p.type[0] : p.type

            // v-model
            if (p.name === 'value') return null

            // Ignore if default value is specify
            if (p.default !== undefined && p.default !== null) return null

            // Faker data
            if (p.fakerFn) return mock[p.name] = resolvePath(faker, p.fakerFn)()

            // Image - Unsplash
            if (p.isImage) return mock[p.name] = `https://source.unsplash.com/random?${Math.random()}`.replace('0.', '?')

            // Excerpt
            switch(type) {
              case 'String': return mock[p.name] = faker.random.word()
              case 'Boolean': return mock[p.name] = faker.random.boolean()
              case 'Number': return mock[p.name] = faker.random.number()
              case 'Object': return mock[p.name] = faker.helpers.createCard()
              default: return mock[p.name] = 'Default'
            }
          })
          return JSON.stringify(mock)
        }
      }
    }
  }
}

module.exports = VUETransformer
