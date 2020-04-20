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
        v-if="checker"
        class="g8-tree__checker"
        @click.stop="setState(!item.checked)"
        :class="{
          'g8-tree__checked': item.checked,
          'g8-tree__checked_some': item.intermediate,
        }"
      ></span>
      <span class="g8-tree__node_label_text">{{ item[itemLabel] }}</span>
      <span class="g8-tree__node_tags">
        <label
          class="g8-tree__node_tag"
          v-for="(tag, idx) in item[tagsKey]"
          :key="idx"
          :title="tag[tagHint]"
          @click.stop="tagClicked(tag, idx)"
          @dblclick.stop="tagDblClicked(tag, idx)"
          >{{ tag[tagLabel] }}</label
        >
      </span>
    </div>
    <ul v-if="expanded || item.rendered" class="g8-tree__branch">
      <g8-tree-view
        v-for="(child, index) in item[childrenKey]"
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
import { G8TreeItem, G8TreeItemTag } from './types';

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
  @Prop({ default: 'name' }) itemLabel!: string;

  @Prop({ default: 'tags' }) tagsKey!: string;

  @Prop({ default: 'children' }) childrenKey!: string;

  @Prop({ default: 'label' }) tagLabel!: string;

  @Prop({ default: 'hint' }) tagHint!: string;

  /**
   * The tree data to be rendered. Please note that data passed ***may*** be
   * mutated by this component to reflect various state of tree nodes. Mutated
   * fields include:
   *
   * * checked
   * * intermediate
   * * rendered
   */
  @Prop() item!: G8TreeItem;

  /**
   * Whether to add a checkbox before each item, allowing multiple nodes to
   * be checked.
   */
  @Prop({ default: false }) checker!: boolean;

  /**
   * Whether the node is expanded.
   */
  expanded = false;

  /**
   * Whether the current node has any child.
   */
  get hasChild(): boolean {
    const children = this.item[this.childrenKey] as G8TreeItem[] | null;
    return children != null && children.length > 0;
  }

  /**
   * Handles the click event of checkboxes. Sets whether the current node is
   * checked. Also set propagates the state to all immediate children.
   * This method emits the `state-changed` event.
   * @param state
   */
  setState(state: boolean) {
    this.item.checked = state;
    this.$children.forEach(c => (c as G8TreeView).setState(state));
    /**
     * Checkbox state of the node has changed.
     * @param {G8StateChangeEvent} state
     */
    this.$emit('state-changed', this.item);
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
    this.$emit('click', this.item);
  }

  /**
   * Handles double click event of nodes, emitting the `dblclick` event.
   */
  dblClicked() {
    /**
     * A tree node has been double clicked.
     * @param {G8ClickEvent} key the item's `key`
     */
    this.$emit('dblclick', this.item);
  }

  /**
   * Handles double click event of tags, emitting the `tag-clicked` event.
   * @param tag
   * @param index
   */
  tagClicked(tag: G8TreeItemTag, index: number) {
    /**
     * A tree node tag has been clicked.
     * @param {G8TagClickEvent} key
     */
    this.$emit('tag-clicked', { node: this.item, tag, index });
  }

  /**
   * Handles double click event of tags, emitting the `tag-dbl-clicked`
   * event.
   * @param tag
   * @param index
   */
  tagDblClicked(tag: G8TreeItemTag, index: number) {
    /**
     * A tree node tag has been double clicked.
     * @param {G8TagClickEvent} key
     */
    this.$emit('tag-dbl-clicked', {
      node: this.item,
      tag,
      index,
    });
  }

  /**
   * Handles `state-changed` events emitted by children, updating the check
   * state of current node according. This method also bubbles up the
   * `state-changed` event.
   * @param node
   */
  childrenStateChanged(node: G8TreeItem) {
    let checked = 0;
    const children: G8TreeItem[] = this.item.children as G8TreeItem[];
    for (const child of children) {
      if (child.intermediate) {
        this.item.intermediate = true;
        this.$emit('state-changed', node);
        return;
      }
      if (child.checked) {
        checked++;
      }
    }
    if (children.length == checked) {
      this.item.intermediate = false;
      this.item.checked = true;
    } else if (0 == checked) {
      this.item.intermediate = false;
      this.item.checked = false;
    } else {
      this.item.intermediate = true;
    }
    this.$emit('state-changed', node);
  }
}
</script>
