<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div id="app">
    <div>
      <span id="itemClicked">{{ itemClicked }}</span>
      <span id="tagClicked">{{ tagClicked }}</span>
    </div>
    <div>
      <button @click="populate()">populate tree</button>
      <ul class="g8-tree-view g8-tree__dark g8-tree__highlight_hover">
        <g8-tree-view :item="item" :checker="true">
          <template #default="{ item }">
            <span
              :id="item.key"
              :class="{ tint: !item.tint }"
              @click="itemClicked = item.name"
            >
              {{ item.name }}
            </span>
          </template>
          <template #tag="{ tag }">
            <span
              :id="tag.key"
              :class="{ tint: !tag.tint }"
              @click="tagClicked = tag.label"
            >
              {{ tag.label }}
            </span>
          </template>
        </g8-tree-view>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { G8TreeItem, G8TreeView } from './';

@Component({
  components: {
    G8TreeView,
  },
})
export default class App extends Vue {
  item = {
    key: 'root',
    name: 'Click the button above to populate me.',
  } as G8TreeItem;

  tab = 1;

  itemClicked = '';

  itemMiddleClicked = '';

  itemRightClicked = '';

  itemDblClicked = '';

  tagClicked = '';

  tagMiddleClicked = '';

  tagRightClicked = '';

  tagDblClicked = '';

  populate() {
    const total = 10;
    this.item = {
      key: 'root',
      name: 'root name',
      tags: [{ label: 'root label' }],
      cssClass: [''],
    };
    const children = [];
    for (let i = 1; i < total; i++) {
      const child: G8TreeItem = {
        key: `key-${i}`,
        name: `name ${i}`,
        tint: i % 5,
        tags: [{ tint: i % 5, key: `tag-${i}`, label: `tag ${i}` }],
      };
      const sub = [];
      for (let j = 1; j < total; j++) {
        sub.push({
          key: `key-${i}.${j}`,
          name: `name ${i}.${j}`,
          tint: j % 5,
          tags: [{ tint: j % 5, key: `tag-${i}.${j}`, label: `tag ${i}.${j}` }],
        });
      }
      child.children = sub;
      children.push(child);
    }
    this.item.children = children;
  }
}
</script>

<style lang="scss">
html,
body {
  margin: 0;
  padding: 0 3px;
  height: 100%;
}

html,
body,
button,
#app {
  color: #888888;
  background: #333333;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  display: flex;
  height: 100%;
  flex-direction: column;

  > div:last-child {
    flex: 1;
    overflow: auto;
  }
}

.tint {
  color: lightseagreen;
}
</style>
