<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <li
    :id="item[itemId]"
    class="g8-tree__node"
    :class="{ 'g8-tree__node_expended': expanded }"
  >
    <div
      class="g8-tree__node__entry"
      :class="{ 'g8-tree__node__branch': hasChild }"
      @click="clicked($event)"
    >
      <span class="g8-tree__node__entry__toggle"></span>
      <span
        v-if="checker"
        class="g8-tree__checker"
        @click.stop.prevent="setState(!checked)"
        :class="{
          'g8-tree__checker--checked': checked,
          'g8-tree__checker--checked--intermediate': intermediate,
        }"
      ></span>
      <span class="g8-tree__node__entry_label">
        <slot :item="item">{{ item[itemLabel] }}</slot>
      </span>
      <span class="g8-tree__node__entry_tags">
        <label
          class="g8-tree__node__entry_tags_tag"
          v-for="(tag, idx) in item[tagsKey]"
          :key="idx"
          :id="tag[tagId]"
          :title="tag[tagHint]"
        >
          <slot name="tag" :tag="tag" :item="item">{{ tag[tagLabel] }}</slot>
        </label>
      </span>
    </div>
    <ul v-if="expanded || item.rendered" class="g8-tree__branch">
      <g8-tree-view
        v-for="(child, index) in item[childrenKey]"
        :key="index"
        :item="child"
        :checker="checker"
        :item-id="itemId"
        :item-label="itemLabel"
        :tags-key="tagsKey"
        :children-key="childrenKey"
        :tag-id="tagId"
        :tag-label="tagLabel"
        :tag-hint="tagHint"
        @click="$emit('click', $event)"
        @state-changed="childrenStateChanged($event)"
      >
        <template
          v-for="slot in Object.keys($scopedSlots)"
          :slot="slot"
          slot-scope="scope"
        >
          <slot :name="slot" v-bind="scope" />
        </template>
      </g8-tree-view>
    </ul>
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { G8ClickEvent, G8TreeItem } from './types';

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
   * Key of the field in `item` to be used as element's `id` attribute.
   */
  @Prop({ default: 'id' }) itemId!: string;

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
   * Key of the field in tags list of `item` to be used as tag element's `id`
   * attribute.
   */
  @Prop({ default: 'id' }) tagId!: string;

  /**
   * Key of the field in tags list of `item` that holds tag label.
   */
  @Prop({ default: 'label' }) tagLabel!: string;

  /**
   * Key of the field in tags list of `item` that holds tag tooltip.
   */
  @Prop({ default: 'hint' }) tagHint!: string;

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
    } else if (
      this.item[this.childrenKey] &&
      (this.item[this.childrenKey] as G8TreeItem[]).length
    ) {
      // descend to all descendant's data and update their states,
      // this is necessary because sub-components have not been created yet.
      this.walkItems(
        this.item[this.childrenKey] as G8TreeItem[],
        c => (c.checked = state),
      );
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
  clicked(event: G8ClickEvent) {
    if (this.hasChild) {
      this.item.rendered = true;
      this.expanded = !this.expanded;
    }
    event.data = { expanded: this.expanded, item: this.item };
    /**
     * A tree node has been clicked.
     * @param {G8ClickEvent} item
     */
    this.$emit('click', event);
  }

  /**
   * Handles `state-changed` events emitted by children, updating the check
   * state of current node according. This method also bubbles up the
   * `state-changed` event.
   * @param node
   */
  childrenStateChanged(node: G8TreeItem) {
    let checked = 0;
    const children: G8TreeItem[] = this.item[this.childrenKey] as G8TreeItem[];
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

  private walkItems(item: G8TreeItem[], cb: (entry: G8TreeItem) => void) {
    item.forEach(entry => {
      cb(entry);
      if (entry[this.childrenKey]) {
        this.walkItems(entry[this.childrenKey] as G8TreeItem[], cb);
      }
    });
  }
}
</script>
