# 📐 vue-sync-size

Vue directive which allows to synchronize element sizes.

## Installation

```bash
# via npm:
npm i vue-sync-size

# or yarn:
yarn add vue-sync-size
```

## Usage

### Connect to Vue app
```js
import { createApp } from 'vue'
import VueSyncSize from 'vue-sync-size'

app.directive('sync', VueSyncSize())
```

### Call in component
Directive syntax is pretty straightforward: `v-sync:[side]="reference"`:
```vue
<template>
  <div ref="reference">Reference element</div>
  <div v-sync:width="reference">This element will have same width as reference</div>
</template>
```
`side` is optional and can be either `width`, `height` or `both`:
```vue
<template>
  <div ref="reference">Reference element</div>
  <div v-sync:width="reference">This element will have same width as reference</div>
  <div v-sync:height="reference">This element will have same height as reference</div>
  <div v-sync="reference">This element will have same width and height as reference</div>
  <div v-sync:both="reference">Same as a `v-sync` without argument</div>
</template>
```
Absence of `side` works the same way as `both`.

### Referencing a component
The `reference` can be not only an element but also a component:
```vue
<template>
  <some-component ref="reference"/>
  <div v-sync:width="reference"></div>
</template>
```

### Sync with multiple elements
It's also possible to sync element sizes with different elements:
```vue
<template>
  <div ref="reference-a"></div>
  <div ref="reference-b"></div>
  <div v-sync:width="reference-a" v-sync:height="reference-b"></div>
</template>
```

## Vue 2 support
By default the directive is created for Vue 3. Add `version: 2` parameter to enable Vue 2 support:
```js
Vue.directive('sync', VueSyncSize({ version: 2 }))
```

## Dependencies
The package is based on [ElementSizeObserver](https://github.com/arlegotin/element-size-observer), which is a wrapper around [ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver).

## Contribution

Feel free to open [issues](https://github.com/arlegotin/vue-sync-size/issues) and [pull-requests](https://github.com/arlegotin/vue-sync-size/pulls).