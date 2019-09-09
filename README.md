# gridsome-transformer-vue

> VUE transformer for Gridsome

- Create documentation for your vue components
- Preview your components and build interactive demos with them

## [View Demo](https://gridsome-vue-starter.day4.now.sh/)

Supports (vuese comments)[https://vuese.org/cli/#about-comments] for detailing extra information within your components.

## Install

- `yarn add gridsome-transformer-vue`
- `npm install gridsome-transformer-vue`

## Usage

>Feel free to use the Starter that already includes some examples on how to use this.

```
// gridsome.config.js
module.exports = {
  plugins: [
    {
      use: '@gridsome/source-filesystem',
      options: {
        baseDir: './src/library',
        path: '**/*.vue',
        typeName: 'VueComponent'
      }
    }
  ]
}
```

### Template usage

```
<page-query>
query VueComponent ($id: String!) {
  comp: vueComponent (id: $id) {
    id
    name
    mockData
    source
    fileInfo {
      path
      directory
    }
    props {
      name
      describe
      type
      required
      default
    }
    slots {
      name
      describe
    }
    methods {
      name
      describe
      argumentsDesc
    }
  }
}
</page-query>
```

## Mock data

For each prop on a component you can define a (faker)[https://www.npmjs.com/package/faker] function that will be used to generate fake data and store it as a JSON string in `mockData`

**Example**

```
<script>
export default {
  // faker.commerce.productName
  title: {
    type: String,
    required: true
  },
  // faker.lorem.paragraph
  excerpt: {
    type: String
  },
  // faker.image.imageUrl
  image: {
    type: [Object, String],
    required: true
  }
}
</script>
```