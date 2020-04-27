# vue-tree

[![master build](https://img.shields.io/travis/com/eidng8/vue-tree?color=333&logo=travis)](https://travis-ci.com/eidng8/vue-tree) [![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/eidng8/vue-tree?color=333&logo=snyk)](https://snyk.io/test/github/eidng8/vue-tree?targetFile=package.json) [![maintainability](https://img.shields.io/codeclimate/maintainability/eidng8/vue-tree?color=333&logo=code-climate)](https://codeclimate.com/github/eidng8/vue-tree/maintainability) [![master coverage](https://img.shields.io/coveralls/github/eidng8/vue-tree/master?color=333&logo=coveralls)](https://coveralls.io/github/eidng8/vue-tree?branch=master) [![dev build](https://img.shields.io/travis/com/eidng8/vue-tree/dev?color=333&label=dev%20build&logo=travis)](https://travis-ci.com/eidng8/vue-tree/tree/dev) [![dev coverage](https://img.shields.io/coveralls/github/eidng8/vue-tree/dev?color=333&label=dev%20coverage&logo=coveralls)](https://coveralls.io/github/eidng8/vue-tree?branch=dev)

A Vue tree view component with stable DOM structure. By stable, it means the DOM structure will not change once it is rendered.

## Performance Consideration

The DOM structure of this component doesn't change once rendered. Comparing to others using `v-if`, which generate sub-nodes while expanded. While working on long list of items, lags will be obvious.

- This component will have a lag when it is being rendered for the first time. After it is rendered, sub-trees are controlled by CSS, no DOM structure change.
- `v-if` components will lag whenever sub-trees are expanded, every time they are expanded.

There is an [issue](https://github.com/eidng8/vue-tree/issues/24) for this. Check out more detail there.

## Props

| Prop name | Description | Type | Default |
| --- | --- | :-: | :-: |
| item-id | Key of the field in `item` to be used as element's `id` attribute. | string | 'id' |
| item-label | Key of the field in `item` that holds node label. | string | 'name' |
| tags-key | Key of the field in `item` that holds tags array. | string | 'tags' |
| children-key | Key of the field in `item` that holds child nodes array. | string | 'children' |
| tag-id | Key of the field in tags list of `item` to be used as tag element's `id` attribute. | string | 'id' |
| tag-label | Key of the field in tags list of `item` that holds tag label. | string | 'label' |
| tag-hint | Key of the field in tags list of `item` that holds tag tooltip. | string | 'hint' |
| checker | Whether to add a checkbox before each item,<br>allowing multiple nodes tobe checked. | boolean | false |
| item | The tree data to be rendered.<br>Please note that data passed **_may_** be mutated by this<br>component to reflect various states of tree nodes.<br>Mutated fields include:<br>- checked<br>- intermediate<br>- rendered | [G8TreeItem](#g8treeitem) |  |

## Scoped slots

#### Default slot

```vue
<span class="g8-tree__node_entry_label">
  <slot :item="item">{{ item[itemLabel] }}</slot>
</span>
```

This is the entry's main content slot. Defaults to `{{ item[itemLabel] }}`. The current item entry is exposed as scoped variable `item`.

#### Tag (badge) slot

```vue
<label
  class="g8-tree__node_entry_tags_tag"
  v-for="(tag, idx) in item[tagsKey]"
  :key="idx"
  :id="tag[tagId]"
  :title="tag[tagHint]"
>
  <slot name="tag" :tag="tag" :item="item">{{ tag[tagLabel] }}</slot>
</label>
```

This is the entry's tag content slot. Defaults to `{{ tag[tagLabel] }}`. The current item entry is exposed as scoped variable `item`. The current tag is exposed as scoped variable `tag`.

## Types

#### G8TreeItem

Below is a list of presumable fields, all of them are optional. You can place whatever data you want to a tree item, then use the [props](#props) mentioned above to specify content you want to display.

<!-- prettier-ignore -->
| Field name   | Type                               | Description                                                            |
| ------------ | :--------------------------------: | ---------------------------------------------------------------------- |
| name         | string                             | Item name, serves as label, will be rendered as node label.            |
| checked      | boolean                            | Whether the node is checked.                                           |
| intermediate | boolean                            | Intermediate check box state. Active while some children were checked. |
| rendered     | boolean                            | Whether the sub-tree of this node has been rendered.                   |
| tags         | [G8TreeItemTag](#g8treeitemtag)\[] | List of tags.                                                          |
| children     | [G8TreeItem](#g8treeitem)\[]       | List of child nodes.                                                   |

#### G8TreeItemTag

Below is a list of presumable fields, all of them are optional. You can place whatever data you want to tags, then use the [props](#props) mentioned above to specify content you want to display.

<!-- prettier-ignore -->
| Field name |  Type  | Description                                        |
| ---------- | :----: | -------------------------------------------------- |
| label      | string | Tag label.                                         |
| hint       | string | Tag tooltip. Visible when mouse hovers on the tag. |

#### G8ClickEvent

extends `MouseEvent`

<!-- prettier-ignore -->
| Field name | Type                                                  | Description                                                    |
| ---------- | :---------------------------------------------------: | -------------------------------------------------------------- |
| data       | { expanded: boolean, item: [G8TreeItem](#g8treeitem)} | The item triggered the event and if it were expanded (`true`). |

## Events

This component defines only two events, for expanding/collapsing nodes, and checkbox state changes.

<!-- prettier-ignore -->
| Event name    | Type                          | Description                                                                                            |
| ------------- | :---------------------------: | ------------------------------------------------------------------------------------------------------ |
| click         | [G8ClickEvent](#g8clickevent) | A tree node has been clicked. Use the `data.expanded` to determine if the node were expanded (`true`). |
| state-changed | [G8TreeItem](#g8treeitem)     | Checkbox state of the node has changed.                                                                |

#### Other events

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
