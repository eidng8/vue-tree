<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div id="app">
    <ul class="g8-tree-view g8-tree__highlight_hover">
      <g8-tree-view
        checker="1"
        :item="item"
        @click="itemClicked=$event"
        @dblclick="itemDblClicked=$event"
        @tag-clicked="tagClicked=`${$event.node},${$event.tag},${$event.index}`"
        @tag-dbl-clicked="tagDblClicked=`${$event.node},${$event.tag},${$event.index}`"
      ></g8-tree-view>
    </ul>
    <input id="itemClicked" :value="itemClicked"/>
    <input id="itemDblClicked" :value="itemDblClicked"/>
    <input id="tagClicked" :value="tagClicked"/>
    <input id="tagDblClicked" :value="tagDblClicked"/>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import G8TreeView from '@/components/G8TreeView.vue';
import {G8TreeItem} from '@/components/types';

@Component({
  components: {
    G8TreeView,
  },
})
export default class App extends Vue {
  item: G8TreeItem = {
    key: 'root',
    name: 'root name',
    tags: [{key: 'root tag', label: 'root label'}],
    children: [
      {
        key: 'item-1',
        name: 'item 1',
        tags: [
          {key: 1, label: 'tag1.1'},
          {key: 1, label: 'tag1.2', hint: '2nd tag in the 2nd branch'},
        ],
      },
      {
        key: 'item-2',
        name: 'item 2',
        tags: [{key: 2, label: 'tag1.1'}],
        children: [
          {
            key: 'item-2.1',
            name: 'item 2.1',
            tags: [
              {key: '2.1.1', label: 'tag2.1.1'},
              {key: '2.1.2', label: 'tag2.1.2'},
            ],
          },
          {
            key: 'item-2.2',
            name: 'item 2.2',
          },
        ],
      },
    ],
  };

  itemClicked = '';

  itemDblClicked = '';

  tagClicked = '';

  tagDblClicked = '';
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
