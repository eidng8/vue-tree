<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <li class="g8-tree__node" :class="{'g8-tree__node_expended':expanded}">
    <div class="g8-tree__node_label"
         :class="{'g8-tree__branch_label': isFolder}"
         @click.stop="clicked(item.key)"
         @dblclick.stop="dblClicked(item.key)">
      <span class="g8-tree__toggle"></span>
      <span class="g8-tree__checker"
            :class="{'g8-tree__checked':checked}"
            v-if="checker"
            @click.stop="checkerClicked(item.key)"></span>
      <span class="g8-tree__node_label_text">{{ item.name }}</span>
      <span class="g8-tree__node_tags">
        <label class="g8-tree__node_tag"
               v-for="(tag, idx) in item.tags"
               :key="idx"
               :title="tag.hint"
               @click.stop="tagClicked(item.key,tag.key,idx)"
               @dblclick.stop="tagDblClicked(item.key,tag.key,idx)"
        >{{ tag.label }}</label>
      </span>
    </div>
    <ul v-if="isFolder" class="g8-tree__branch">
      <g8-tree-view v-for="(child, index) in item.children"
                    :key="index"
                    :item="child"
                    :checker="checker"
                    @click="$emit('click',$event)"
                    @dblclick="$emit('dblclick',$event)"
                    @checked="$emit('checked',$event)"
                    @tag-clicked="$emit('tag-clicked', $event)"
                    @tag-dbl-clicked="$emit('tag-dbl-clicked',$event)"
      ></g8-tree-view>
    </ul>
  </li>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {G8TreeItem} from '@/components/types';

@Component({
  name: 'g8-tree-view',
})
export default class G8TreeView extends Vue {
  @Prop() item!: G8TreeItem;

  @Prop() checker!: 'radio' | 'select';

  expanded = false;

  checked = false;

  get isFolder() {
    return this.item.children && this.item.children.length;
  }

  clicked(key: number | string) {
    if (this.isFolder) {
      this.expanded = !this.expanded;
    }
    this.$emit('click', key);
  }

  dblClicked(key: number | string) {
    this.$emit('dblclick', key);
  }

  tagClicked(node: number | string, tag: number | string, index: number) {
    this.$emit('tag-clicked', {node, tag, index});
  }

  tagDblClicked(node: number | string, tag: number | string, index: number) {
    this.$emit('tag-dbl-clicked', {node, tag, index});
  }

  checkerClicked(node: number | string) {
    this.checked = !this.checked;
    this.$emit('checked', {node, state: this.checked});
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

.g8-tree__checked.g8-tree__checker:after {
  visibility: visible;
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
