<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <li class="g8-tree__node" :class="{'g8-tree__node_expended':expanded}">
    <div class="g8-tree__node_label"
         :class="{'g8-tree__branch_label': hasChild}"
         @click.stop="clicked()"
         @dblclick.stop="dblClicked()">
      <span class="g8-tree__toggle"></span>
      <span class="g8-tree__checker"
            :class="{'g8-tree__checked':checked, 'g8-tree__checked_some':ints}"
            v-if="checker"
            @click.stop="setState(!checked)"></span>
      <span class="g8-tree__node_label_text">{{ item.name }}</span>
      <span class="g8-tree__node_tags">
        <label class="g8-tree__node_tag"
               v-for="(tag, idx) in item.tags"
               :key="idx"
               :title="tag.hint"
               @click.stop="tagClicked(tag.key,idx)"
               @dblclick.stop="tagDblClicked(tag.key,idx)"
        >{{ tag.label }}</label>
      </span>
    </div>
    <ul v-if="expanded || item.rendered" class="g8-tree__branch">
      <g8-tree-view v-for="(child, index) in item.children"
                    :key="index"
                    :item="child"
                    :checker="checker"
                    @click="$emit('click',$event)"
                    @dblclick="$emit('dblclick',$event)"
                    @state-changed="childrenStateChanged($event)"
                    @tag-clicked="$emit('tag-clicked', $event)"
                    @tag-dbl-clicked="$emit('tag-dbl-clicked',$event)"
      ></g8-tree-view>
    </ul>
  </li>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {G8StateChangeEvent, G8TreeItem} from './types';

@Component({name: 'g8-tree-view'})
export default class G8TreeView extends Vue {
  @Prop() item!: G8TreeItem;

  @Prop() checker!: boolean;

  expanded = false;

  checked = false;

  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all were checked.
   */
  ints = false;

  get hasChild() {
    return this.item.children && this.item.children.length;
  }

  created() {
    console.log(`created: ${this.item.name}`);
  }

  setState(state: boolean) {
    this.item.checked = this.checked = state;
    this.$children.forEach(c => (c as G8TreeView).setState(state));
    this.$emit('state-changed', {node: this.item.key, state: this.checked});
  }

  clicked() {
    if (this.hasChild) {
      this.item.rendered = true;
      this.expanded = !this.expanded;
    }
    this.$emit('click', this.item.key);
  }

  dblClicked() {
    this.$emit('dblclick', this.item.key);
  }

  tagClicked(tag: number | string, index: number) {
    this.$emit('tag-clicked', {node: this.item.key, tag, index});
  }

  tagDblClicked(tag: number | string, index: number) {
    this.$emit('tag-dbl-clicked', {node: this.item.key, tag, index});
  }

  childrenStateChanged(evt: G8StateChangeEvent) {
    let checked = 0;
    const children: G8TreeItem[] = this.item.children as G8TreeItem[];
    for (const child of children) {
      if (child.ints) {
        this.item.ints = true;
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
      this.item.ints = false;
      this.item.checked = true;
    } else if (0 == checked) {
      this.ints = false;
      this.checked = false;
      this.item.ints = false;
      this.item.checked = false;
    } else {
      this.ints = true;
      this.item.ints = true;
    }
    this.$emit('state-changed', evt);
  }
}
</script>

<style lang="scss">
</style>
