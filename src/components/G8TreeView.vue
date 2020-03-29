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
    <ul v-if="hasChild" class="g8-tree__branch">
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

@Component({
  name: 'g8-tree-view',
})
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

  setState(state: boolean) {
    this.item.checked = this.checked = state;
    this.$children.forEach(c => (c as G8TreeView).setState(state));
    this.$emit('state-changed', {node: this.item.key, state: this.checked});
  }

  clicked() {
    if (this.hasChild) {
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
$g8-tree-bg: #ccc !default;
$g8-tree-fg: #333 !default;

.g8-tree-view {
  margin: 0;
  padding: 0;
  color: $g8-tree-fg;
  text-align: left;
  user-select: none;

  > .g8-tree__node {
    padding-left: 0;
    margin-left: 0;
  }

  .g8-tree__branch {
    padding: 0;
    display: none;
  }
}

.g8-tree__node {
  list-style: none;
  padding: .1rem 0 .1rem 1rem;
}

.g8-tree__node_label {
  cursor: pointer;
  border-radius: 4px;

  > * {
    display: inline-block;
  }
}

.g8-tree__toggle,
.g8-tree__checker {
  font-size: .8rem;
  width: 1rem;
  text-align: center;
}

.g8-tree__toggle:before {
  content: '\2022';
}

.g8-tree__checker {
  position: relative;
  margin-right: 4px;

  &:after {
    content: '\2714';
    position: relative;
    visibility: hidden;
  }

  &:before {
    content: ' ';
    background: $g8-tree-bg;
    border-radius: 4px;
    display: block;
    position: absolute;
    left: 1px;
    bottom: 1px;
    width: 90%;
    height: 80%;
  }

  &:hover,
  &:focus {
    &:before {
      background: darken($g8-tree-bg, 20%);
    }
  }
}

.g8-tree__checked_some:after {
  content: '\2237';
  visibility: visible;
}

.g8-tree__checked {
  &.g8-tree__checked_some:after {
    content: '\2237';
  }

  &.g8-tree__checker:after {
    visibility: visible;
  }
}

.g8-tree__branch_label {
  font-weight: bold;

  .g8-tree__toggle:before {
    padding-right: .5rem;
    content: '\25ba';
  }
}

.g8-tree__node_tags,
.g8-tree__node_tag {
  display: inline-block;
}

.g8-tree__node_tag {
  margin-left: .5rem;
  padding: 0 .2rem;
  font-size: .6rem;
  font-weight: normal;
  max-width: 6rem;
  border-radius: .2rem;
  background-color: $g8-tree-bg;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;

  &:hover,
  &:focus {
    background: darken($g8-tree-bg, 20%);
  }
}

.g8-tree__node_expended {
  > .g8-tree__branch {
    display: block;
  }

  > .g8-tree__node_label > .g8-tree__toggle:before {
    content: '\25bc';
  }
}

.g8-tree__highlight_hover .g8-tree__node_label {
  &:hover,
  &:focus {
    background: lighten($g8-tree-bg, 10%);
  }
}
</style>
