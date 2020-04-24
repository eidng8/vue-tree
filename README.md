# vue-tree

[![master build](https://img.shields.io/travis/com/eidng8/vue-tree?color=333&logo=travis)](https://travis-ci.com/eidng8/vue-tree) [![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/eidng8/vue-tree?color=333&logo=snyk)](https://snyk.io/test/github/eidng8/vue-tree?targetFile=package.json) [![maintainability](https://img.shields.io/codeclimate/maintainability/eidng8/vue-tree?color=333&logo=code-climate)](https://codeclimate.com/github/eidng8/vue-tree/maintainability) [![master coverage](https://img.shields.io/coveralls/github/eidng8/vue-tree/master?color=333&logo=coveralls)](https://coveralls.io/github/eidng8/vue-tree?branch=master) [![dev build](https://img.shields.io/travis/com/eidng8/vue-tree/dev?color=333&label=dev%20build&logo=travis)](https://travis-ci.com/eidng8/vue-tree/tree/dev) [![dev coverage](https://img.shields.io/coveralls/github/eidng8/vue-tree/dev?color=333&label=dev%20coverage&logo=coveralls)](https://coveralls.io/github/eidng8/vue-tree?branch=dev)

A Vue tree view component with stable DOM structure. By stable, it means the DOM structure will not change once it is rendered.

## Performance Consideration

The DOM structure of this component doesn't change once rendered. Comparing to others using `v-if`, which generate sub-nodes while expanded. While working on long list of items, lags will be obvious.

- This component will have a lag when it is being rendered for the first time. After it is rendered, sub-trees are controlled by CSS, no DOM structure change.
- `v-if` components will lag whenever sub-trees are expanded, every time they are expanded.

There is an [issue](#24) for this. Check out more detail there.

## Theming

The bundled style sheet can be imported from `'g8-vue-tree/dist/g8-vue-tree.css'`. This component provides a dark theme out of box. To use it, just add the `g8-tree__dark` class to the element.

```html
<ul class="g8-tree-view g8-tree__dark">
  <g8-tree-view></g8-tree-view>
</ul>
```

If you want to change the color of the component, just define two variables before importing the scss file.

```scss
/* index.scss */

/* define these two variables before importing the scss file */
$g8-tree-bg: #ccc;
$g8-tree-fg: #333;

@import '~vue-tree/src/components/tree-view.scss';
```

## Props

| Prop name | Description | Type | Default |
| --- | --- | :-: | :-: |
| itemLabel | Key of the field in `item` that holds node label. | string | 'name' |
| tagsKey | Key of the field in `item` that holds tags array. | string | 'tags' |
| childrenKey | Key of the field in `item` that holds child nodes array. | string | 'children' |
| tagLabel | Key of the field in tags list of `item` that holds tag label. | string | 'label' |
| tagHint | Key of the field in tags list of `item` that holds tag tooltip. | string | 'hint' |
| handleRightClick <a id="handleRightClick"></a> | Whether to intercept right mouse click. | boolean | false |
| checker | Whether to add a checkbox before each item,<br>allowing multiple nodes tobe checked. | boolean | false |
| item | The tree data to be rendered.<br>Please note that data passed **_may_** be mutated by this<br>component to reflect various states of tree nodes.<br>Mutated fields include:<br>- checked<br>- intermediate<br>- rendered | [G8TreeItem](#G8TreeItem) |  |

## Events

| Event name | Type | Description |
| --- | :-: | --- |
| click | [G8TreeItem](#G8TreeItem) | A tree node has been clicked. |
| middle-click | [G8TreeItem](#G8TreeItem) | A tree node has been clicked with middle mouse button. |
| right-click | [G8TreeItem](#G8TreeItem) | A tree node has been clicked with right mouse button.<br>Only available if [handleRightClick](#handleRightClick) is `true` |
| dblclick | [G8TreeItem](#G8TreeItem) | A tree node has been double clicked. |
| tag-click | [G8TagClickEvent](#G8TagClickEvent) | A tree node tag has been clicked. |
| tag-middle-click | [G8TagClickEvent](#G8TagClickEvent) | A tree node tag has been clicked. |
| tag-right-click | [G8TagClickEvent](#G8TagClickEvent) | A tree node has been clicked with right mouse button.<br>Only available if [handleRightClick](#handleRightClick) is `true` |
| tag-dblclick | [G8TagClickEvent](#G8TagClickEvent) | A tree node tag has been double clicked. |
| state-changed | [G8TreeItem](#G8TreeItem) | Checkbox state of the node has changed. |

## Types

#### G8TreeItem

| Field name | Type | Description |
| --- | :-: | --- |
| name | string | Item name, serves as label, will be rendered as node label. |
| checked | boolean | Whether current node is checked. |
| intermediate | boolean | Intermediate check box state. Active while some of the children were checked, but not all. |
| rendered | boolean | Whether the sub-tree of this node has been rendered. |
| tags | [G8TreeItemTag](#G8TreeItemTag)\[] | List of tags. |
| children | [G8TreeItem](#G8TreeItem)\[] | List of child nodes. |

#### G8TreeItemTag

| Field name |  Type  | Description                                        |
| ---------- | :----: | -------------------------------------------------- |
| label      | string | Tag label.                                         |
| hint       | string | Tag tooltip. Visible when mouse hovers on the tag. |

#### G8TagClickEvent

| Field name | Type | Description |
| --- | :-: | --- |
| node | [G8TreeItem](#G8TreeItem) | Key of the node that triggered the event. |
| tag | [G8TreeItemTag](#G8TreeItemTag) | The tag that triggered the event. |
| index | number | Numeric index of the entry in the tag list. |
