# vue-tree

[![Master Build](https://travis-ci.com/eidng8/vue-tree.svg?branch=master)](https://travis-ci.com/eidng8/vue-tree)
[![Test Coverage](https://api.codeclimate.com/v1/badges/92ebfb84dd8b69b595c1/test_coverage)](https://codeclimate.com/github/eidng8/vue-tree/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/92ebfb84dd8b69b595c1/maintainability)](https://codeclimate.com/github/eidng8/vue-tree/maintainability)
[![Known Vulnerabilities](https://snyk.io/test/github/eidng8/vue-tree/badge.svg?targetFile=package.json)](https://snyk.io/test/github/eidng8/vue-tree?targetFile=package.json)
[![Dev Coverage](https://coveralls.io/repos/github/eidng8/vue-tree/badge.svg?branch=dev)](https://coveralls.io/github/eidng8/vue-tree?branch=dev)

A Vue.js tree view component with stable DOM tree. By stable, it means the
DOM structure will not change once it is rendered.


## Performance Consideration

The DOM structure of this component doesn't change once rendered.
Comparing to others using `v-if`, which generate sub-nodes while expanded.
While working on long list of items, lags will be obvious.

* This component will have a lag when once it is being rendered. After it is
rendered, sub-trees are controlled by CSS, no DOM structure happens.
* `v-if` components will lag whenever sub-trees are expanded, every time they
are expanded.


## Theming

This component provides a dark theme out of box. To use it, just add the
`g8-tree__dark` class to the element.

```html
<ul class="g8-tree-view g8-tree__dark">
  <g8-tree-view></g8-tree-view>
</ul>
```

If you want to change the color of the component, just defined two variables
before importing the scss file.

```scss
/* index.scss */

/* define these two variables before importing the scss file */
$g8-tree-bg: #ccc !default;
$g8-tree-fg: #333 !default;

@import "~vue-tree/src/components/tree-view.scss";
```
