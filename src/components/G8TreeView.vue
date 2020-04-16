<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <li class="g8-tree__node" :class="{ 'g8-tree__node_expended': expanded }">
    <div
      class="g8-tree__node_label"
      :class="{ 'g8-tree__branch_label': hasChild }"
      @click.stop="clicked()"
      @dblclick.stop="dblClicked()"
    >
      <span class="g8-tree__toggle"></span>
      <span
        class="g8-tree__checker"
        :class="{ 'g8-tree__checked': checked, 'g8-tree__checked_some': ints }"
        v-if="checker"
        @click.stop="setState(!checked)"
      ></span>
      <span class="g8-tree__node_label_text">{{ item.name }}</span>
      <span class="g8-tree__node_tags">
        <label
          class="g8-tree__node_tag"
          v-for="(tag, idx) in item.tags"
          :key="idx"
          :title="tag.hint"
          @click.stop="tagClicked(tag.key, idx)"
          @dblclick.stop="tagDblClicked(tag.key, idx)"
          >{{ tag.label }}</label
        >
      </span>
    </div>
    <ul v-if="expanded || item.rendered" class="g8-tree__branch">
      <g8-tree-view
        v-for="(child, index) in item.children"
        :key="index"
        :item="child"
        :checker="checker"
        @click="$emit('click', $event)"
        @dblclick="$emit('dblclick', $event)"
        @state-changed="childrenStateChanged($event)"
        @tag-clicked="$emit('tag-clicked', $event)"
        @tag-dbl-clicked="$emit('tag-dbl-clicked', $event)"
      ></g8-tree-view>
    </ul>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { G8StateChangeEvent, G8TreeItem } from './types';

/**
 * A tree view component with stable DOM structure. Stable means its structure
 * will not change once rendered. This component uses CSS to toggle sub-tree.
 * To improve performance, sub-trees are not rendered until they are first
 * expanded. Once expanded, further collapse/expand action won't cause the
 * sub-tree to be rendered again. Currently there is an
 * [issue](https://github.com/eidng8/vue-tree/issues/24) about performance
 * problem of large tree data set.
 */
@Component({ name: 'g8-tree-view' })
export default class G8TreeView extends Vue {
  /**
   * The tree data to be rendered.
   */
  @Prop() item!: G8TreeItem;

  /**
   * Whether to add a checkbox before each item, allowing multiple nodes to
   * be checked.
   */
  @Prop() checker!: boolean;

  /**
   * Whether the node is expanded.
   */
  expanded = false;

  /**
   * Whether the node is checked.
   */
  checked = false;

  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all were checked.
   */
  ints = false;

  /**
   * Whether the current node has any child.
   */
  get hasChild() {
    return this.item.children && this.item.children.length;
  }

  /**
   * Handles the click event of checkboxes. Sets whether the current node is
   * checked. Also set propagates the state to all immediate children.
   * This method emits the `state-changed` event.
   * @param state
   */
  setState(state: boolean) {
    this.item.checked = this.checked = state;
    this.$children.forEach(c => (c as G8TreeView).setState(state));
    /**
     * Checkbox state of the node has changed.
     * @param {G8StateChangeEvent} state
     */
    this.$emit('state-changed', { node: this.item.key, state: this.checked });
  }

  /**
   * Handles click event of nodes, expanding/collapsing sub-tree if
   * applicable. This method emits the `click` event.
   */
  clicked() {
    if (this.hasChild) {
      this.item.rendered = true;
      this.expanded = !this.expanded;
    }
    /**
     * A tree node has been clicked.
     * @param {G8ClickEvent} key the item's `key`
     */
    this.$emit('click', this.item.key);
  }

  /**
   * Handles double click event of nodes, emitting the `dblclick` event.
   */
  dblClicked() {
    /**
     * A tree node has been double clicked.
     * @param {G8ClickEvent} key the item's `key`
     */
    this.$emit('dblclick', this.item.key);
  }

  /**
   * Handles double click event of tags, emitting the `tag-clicked` event.
   * @param tag
   * @param index
   */
  tagClicked(tag: number | string, index: number) {
    /**
     * A tree node tag has been clicked.
     * @param {G8TagClickEvent} key
     */
    this.$emit('tag-clicked', { node: this.item.key, tag, index });
  }

  /**
   * Handles double click event of tags, emitting the `tag-dbl-clicked`
   * event.
   * @param tag
   * @param index
   */
  tagDblClicked(tag: number | string, index: number) {
    /**
     * A tree node tag has been double clicked.
     * @param {G8TagClickEvent} key
     */
    this.$emit('tag-dbl-clicked', { node: this.item.key, tag, index });
  }

  /**
   * Handles `state-changed` events emitted by children, updating the check
   * state of current node according. This method also bubbles up the
   * `state-changed` event.
   * @param evt
   */
  childrenStateChanged(evt: G8StateChangeEvent) {
    let checked = 0;
    const children: G8TreeItem[] = this.item.children as G8TreeItem[];
    for (const child of children) {
      if (child.intermediate) {
        this.item.intermediate = true;
        this.ints = true;
        this.$emit('state-changed', evt);
        return;
      }
      if (child.checked) {
        checked++;
      }
    }
    if (children.length == checked) {
      this.ints = false;
      this.checked = true;
      this.item.intermediate = false;
      this.item.checked = true;
    } else if (0 == checked) {
      this.ints = false;
      this.checked = false;
      this.item.intermediate = false;
      this.item.checked = false;
    } else {
      this.ints = true;
      this.item.intermediate = true;
    }
    this.$emit('state-changed', evt);
  }
}
</script>
