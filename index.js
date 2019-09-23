const vuese = require('@vuese/parser')
const faker = require('faker')

const resolvePath = (object, path, defaultValue) => path
   .split('.')
   .reduce((o, p) => o ? o[p] : defaultValue, object)

class VUETransformer {
  static mimeTypes () {
    return ['application/x-vue']
  }

  parse (source) {
    const result = vuese.parser(source)

    result.props && result.props.forEach(p => {
      p.type = typeof p.type === 'string' ? [p.type] : p.type
      if (p.describe && p.describe.indexOf('Image') > -1) p.isImage = true
    })

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
            let fake = p.describe && p.describe.find(d => d.indexOf('faker.') > -1)
            if (fake) {
              let fn = resolvePath(faker, fake.replace('faker.',''))
              if (typeof fn === 'function') {
                return mock[p.name] = fn()
              } else console.log(`WARNING: ${fake} is not a valid faker function`)
            }

            if (p.isImage) return `https://source.unsplash.com/random?${performance.now()}`

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
