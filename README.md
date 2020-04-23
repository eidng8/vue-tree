# vue-tree

[![master build](https://img.shields.io/travis/com/eidng8/vue-tree?color=333&logo=travis)](https://travis-ci.com/eidng8/vue-tree) [![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/eidng8/vue-tree?color=333&logo=snyk)](https://snyk.io/test/github/eidng8/vue-tree?targetFile=package.json) [![maintainability](https://img.shields.io/codeclimate/maintainability/eidng8/vue-tree?color=333&logo=code-climate)](https://codeclimate.com/github/eidng8/vue-tree/maintainability) [![master coverage](https://img.shields.io/coveralls/github/eidng8/vue-tree/master?color=333&logo=coveralls)](https://coveralls.io/github/eidng8/vue-tree?branch=master) [![dev build](https://img.shields.io/travis/com/eidng8/vue-tree/dev?color=333&label=dev%20build&logo=travis)](https://travis-ci.com/eidng8/vue-tree/tree/dev) [![dev coverage](https://img.shields.io/coveralls/github/eidng8/vue-tree/dev?color=333&label=dev%20coverage&logo=coveralls)](https://coveralls.io/github/eidng8/vue-tree?branch=dev)

A Vue tree view component with stable DOM structure. By stable, it means the DOM structure will not change once it is rendered.

## Performance Consideration

The DOM structure of this component doesn't change once rendered. Comparing to others using `v-if`, which generate sub-nodes while expanded. While working on long list of items, lags will be obvious.

- This component will have a lag when once it is being rendered. After it is rendered, sub-trees are controlled by CSS, no DOM structure happens.
- `v-if` components will lag whenever sub-trees are expanded, every time they are expanded.

## Theming

The bundled style sheet can be imported from `'g8-vue-tree/dist/g8-vue-tree.css'`. This component provides a dark theme out of box. To use it, just add the `g8-tree__dark` class to the element.

```html
<ul class="g8-tree-view g8-tree__dark">
  <g8-tree-view></g8-tree-view>
</ul>
```

If you want to change the color of the component, just defined two variables before importing the scss file.

```scss
/* index.scss */

/* define these two variables before importing the scss file */
$g8-tree-bg: #ccc;
$g8-tree-fg: #333;

@import '~vue-tree/src/components/tree-view.scss';
```

## Props

| Prop name | Description | Type | Values | Default |
| --- | --- | --- | --- | --- |
| item | The tree data to be rendered. | G8TreeItem | - |  |
| checker | Whether to add a checkbox before each item, allowing multiple nodes to<br>be checked. | boolean | - | false |

## Events

| Event name | Type | Description |
| --- | --- | --- |
| click | G8ClickEvent | A tree node has been clicked. |
| dblclick | G8ClickEvent | A tree node has been double clicked. |
| tag-clicked | G8TagClickEvent | A tree node tag has been clicked. |
| tag-dbl-clicked | G8TagClickEvent | A tree node tag has been double clicked. |
| state-changed | G8StateChangeEvent | Checkbox state of the node has changed. |
