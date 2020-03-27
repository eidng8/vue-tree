<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <li class="g8-tree__node" :class="{'g8-tree__node_expended':isOpen}">
    <div class="g8-tree__node_label"
         :class="{'g8-tree__branch_label': isFolder}"
         @click.stop="clicked(item.key)"
         @dblclick.stop="dblClicked(item.key)">
      <span class="g8-tree__toggle"></span>
      <span class="g8-tree__node_label_text">{{ item.name }}</span>
      <span class="g8-tree__node_tags">
      <span class="g8-tree__node_tag"
            v-for="(tag, idx) in item.tags"
            :key="idx"
            @click.stop="tagClicked(item.key,tag,idx)"
            @dblclick.stop="tagDblClicked(item.key,tag,idx)"
      >{{ tag.label }}</span>
      </span>
    </div>
    <ul v-if="isFolder" class="g8-tree__branch">
      <g8-tree-view v-for="(child, index) in item.children"
                    :key="index"
                    :item="child"></g8-tree-view>
    </ul>
  </li>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import {G8TreeItem, G8TreeItemTag} from '@/components/types';

@Component({
  name: 'g8-tree-view',
})
export default class G8TreeView extends Vue {
  @Prop() item!: G8TreeItem;

  isOpen = false;

  get isFolder() {
    return this.item.children && this.item.children.length;
  }

  clicked(key: string) {
    if (this.isFolder) {
      this.isOpen = !this.isOpen;
    }
    this.$emit('click', key);
  }

  dblClicked(key: string) {
    this.$emit('dblclick', key);
  }

  tagClicked(key: string, tag: G8TreeItemTag, index: number) {
    this.$emit('tagClicked', {key, tag, index});
  }

  tagDblClicked(key: string, tag: G8TreeItemTag, index: number) {
    this.$emit('tagDblClicked', {key, tag, index});
  }
}
</script>

<style lang="scss">
.g8-tree-view {
  margin: 0;
  padding: 0;

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

  > * {
    display: inline-block;
  }
}

.g8-tree__toggle {
  font-size: .8rem;
  width: 1rem;
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
  font-size: .8rem;
  max-width: 6rem;
  border-radius: .2rem;
  background-color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
}

.g8-tree__node_expended {
  > .g8-tree__branch {
    display: block;
  }

  > .g8-tree__node_label > .g8-tree__toggle:before {
    content: '\25bc';
  }
}

.g8-tree__highlight_hover {
  .g8-tree__node_label:hover,
  .g8-tree__node_label:focus {
    background-color: #1f2650;
  }
}
</style>
