<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div id="app">
    <button @click="populate()">populate tree</button>
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
import {G8TreeItem, G8TreeView} from './';

@Component({
  components: {
    G8TreeView,
  },
})
export default class App extends Vue {
  item: G8TreeItem = {
    key: 'root',
    name: 'Click the button above to populate me.',
  };

  itemClicked = '';

  itemDblClicked = '';

  tagClicked = '';

  tagDblClicked = '';

  populate() {
    const total = 1000;
    this.item = {
      key: 'root',
      name: 'root name',
      tags: [{key: 'root tag', label: 'root label'}],
      children: [],
    };
    for (let i = 1; i < total; i++) {
      const child: G8TreeItem = {
        key: `key-${i}`,
        name: `name ${i}`,
        tags: [{key: `tag-${i}`, label: `tag ${i}`}],
        children: [],
      };
      for (let j = 1; j < total; j++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        child.children!.push({
          key: `key-${i}`,
          name: `name ${i}`,
          tags: [{key: `tag-${i}`, label: `tag ${i}`}],
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.item.children!.push(child);
    }
  }
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
