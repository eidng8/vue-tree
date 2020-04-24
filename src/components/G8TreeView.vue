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
      @click.middle.stop="middleClicked()"
      @click.right="rightClicked($event)"
      @dblclick.stop="dblClicked()"
    >
      <span class="g8-tree__toggle"></span>
      <span
        v-if="checker"
        class="g8-tree__checker"
        @click.stop="setState(!checked)"
        :class="{
          'g8-tree__checked': checked,
          'g8-tree__checked_some': intermediate,
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
          @click.middle.stop="tagMiddleClicked(tag, idx)"
          @click.right="tagRightClicked($event, tag, idx)"
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
        :item-label="itemLabel"
        :tags-key="tagsKey"
        :children-key="childrenKey"
        :tag-label="tagLabel"
        :tag-hint="tagHint"
        :handle-right-click="handleRightClick"
        @click="$emit('click', $event)"
        @click.middle.stop="$emit('middle-click', $event)"
        @click.right="$emit('right-click', $event)"
        @dblclick="$emit('dblclick', $event)"
        @state-changed="childrenStateChanged($event)"
        @tag-click="$emit('tag-click', $event)"
        @tag-middle-click="$emit('tag-middle-click', $event)"
        @tag-right-click="$emit('tag-right-click', $event)"
        @tag-dblclick="$emit('tag-dblclick', $event)"
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
  /**
   * Key of the field in `item` that holds node label.
   */
  @Prop({ default: 'name' }) itemLabel!: string;

  /**
   * Key of the field in `item` that holds tags array.
   */
  @Prop({ default: 'tags' }) tagsKey!: string;

  /**
   * Key of the field in `item` that holds child nodes array.
   */
  @Prop({ default: 'children' }) childrenKey!: string;

  /**
   * Key of the field in tags list of `item` that holds tag label.
   */
  @Prop({ default: 'label' }) tagLabel!: string;

  /**
   * Key of the field in tags list of `item` that holds tag tooltip.
   */
  @Prop({ default: 'hint' }) tagHint!: string;

  /**
   * Whether to intercept right mouse click.
   */
  @Prop({ default: false }) handleRightClick!: boolean;

  /**
   * Whether to add a checkbox before each item, allowing multiple nodes to
   * be checked.
   */
  @Prop({ default: false }) checker!: boolean;

  /**
   * The tree data to be rendered. Please note that data passed ***may*** be
   * mutated by this component to reflect various states of tree nodes. Mutated
   * fields include:
   *
   * - checked
   * - intermediate
   * - rendered
   */
  @Prop() item!: G8TreeItem;

  /**
   * Whether the node is expanded.
   */
  expanded = false;

  /**
   * Whether the node is checked. This must be a member field in order for
   * binding to work.
   */
  checked = false;

  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all were checked. This must be a member field in order for
   * binding to work.
   */
  intermediate = false;

  /**
   * Whether the current node has any child.
   */
  get hasChild(): boolean {
    const children = this.item[this.childrenKey] as G8TreeItem[] | null;
    return children != null && children.length > 0;
  }

  // noinspection JSUnusedGlobalSymbols
  /**
   * Vue life cycle hook {@link https://vuejs.org/v2/api/#created}.
   */
  created() {
    this.checked = this.item.checked as boolean;
    this.intermediate = this.item.intermediate as boolean;
  }

  /**
   * Handles the click event of checkboxes. Sets whether the current node is
   * checked. Also set propagates the state to all immediate children.
   * This method emits the `state-changed` event.
   * @param state
   */
  setState(state: boolean) {
    this.checked = this.item.checked = state;
    if (this.$children && this.$children.length) {
      // descend to all descendant sub-components and update their states,
      // also triggers their `state-changed` event.
      this.$children.forEach(c => {
        (c as G8TreeView).setState(state);
      });
    } else if (this.item.children && this.item.children.length) {
      // descend to all descendant's data and update their states,
      // this is necessary because sub-components have not been created yet.
      this.item.children.forEach(c => (c.checked = state));
    }
    /**
     * Checkbox state of the node has changed.
     * @param {G8TreeItem} state
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
     * @param {G8TreeItem} item
     */
    this.$emit('click', this.item);
  }

  /**
   * Handles middle click event of nodes, emitting the `middle-click` event.
   */
  middleClicked() {
    /**
     * A tree node has been clicked with middle mouse button.
     * @param {G8TreeItem} item
     */
    this.$emit('middle-click', this.item);
  }

  /**
   * Handles right click event of nodes, emitting the `right-click` event if
   * needed.
   */
  rightClicked(event: MouseEvent) {
    if (!this.handleRightClick) return;
    event.preventDefault();
    event.stopPropagation();
    /**
     * A tree node has been clicked with right mouse button. Only available if
     * {@see handleRightClick} is `true`.
     * @param {G8TreeItem} item
     */
    this.$emit('right-click', this.item);
  }

  /**
   * Handles double click event of nodes, emitting the `dblclick` event.
   */
  dblClicked() {
    /**
     * A tree node has been double clicked.
     * @param {G8TreeItem} item
     */
    this.$emit('dblclick', this.item);
  }

  /**
   * Handles double click event of tags, emitting the `tag-click` event.
   * @param tag
   * @param index
   */
  tagClicked(tag: G8TreeItemTag, index: number) {
    /**
     * A tree node tag has been clicked.
     * @param {G8TagClickEvent} event
     */
    this.$emit('tag-click', { node: this.item, tag, index });
  }

  /**
   * Handles middle click event of tags, emitting the `tag-middle-click` event.
   * @param tag
   * @param index
   */
  tagMiddleClicked(tag: G8TreeItemTag, index: number) {
    /**
     * A tree node tag has been clicked.
     * @param {G8TagClickEvent} event
     */
    this.$emit('tag-middle-click', { node: this.item, tag, index });
  }

  /**
   * Handles right click event of tags, emitting the `tag-right-click` event if
   * needed.
   */
  tagRightClicked(event: MouseEvent, tag: G8TreeItemTag, index: number) {
    if (!this.handleRightClick) return;
    event.preventDefault();
    event.stopPropagation();
    /**
     * A tree node has been clicked with right mouse button.. Only available if
     * {@see handleRightClick} is `true`.
     * @param {G8TagClickEvent} event
     */
    this.$emit('tag-right-click', { node: this.item, tag, index });
  }

  /**
   * Handles double click event of tags, emitting the `tag-dblclick` event.
   * @param tag
   * @param index
   */
  tagDblClicked(tag: G8TreeItemTag, index: number) {
    /**
     * A tree node tag has been double clicked.
     * @param {G8TagClickEvent} key
     */
    this.$emit('tag-dblclick', {
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
        this.intermediate = this.item.intermediate = true;
        this.$emit('state-changed', node);
        return;
      }
      if (child.checked) {
        checked++;
      }
    }
    if (children.length == checked) {
      this.intermediate = false;
      this.item.intermediate = false;
      this.checked = true;
      this.item.checked = true;
    } else if (0 == checked) {
      this.intermediate = false;
      this.item.intermediate = false;
      this.checked = false;
      this.item.checked = false;
    } else {
      this.intermediate = true;
      this.item.intermediate = true;
    }
    this.$emit('state-changed', node);
  }
}
</script>
