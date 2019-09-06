# @gridsome/transformer-vue

> VUE transformer for Gridsome

Useful for creating documentation for your vue components

## Install

- `yarn add @gridsome/transformer-vue`
- `npm install @gridsome/transformer-vue`

## Usage

 Feel free to use the Starter that already includes some examples on how to use this.

```
<page-query>
query VueComponent ($id: String!) {
  comp: vueComponent (id: $id) {
    id
    name
    mockData
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