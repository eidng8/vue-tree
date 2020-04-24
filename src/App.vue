<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div id="app">
    <div>
      <span id="itemClicked">[click] {{ itemClicked }}</span>
      <span id="itemMiddleClicked">[middle-click] {{ itemMiddleClicked }}</span>
      <span id="itemRightClicked">[right-click] {{ itemRightClicked }}</span>
      <span id="itemDblClicked">[dblclick] {{ itemDblClicked }}</span>
      <span id="tagClicked">[tag-click] {{ tagClicked }} </span>
      <span id="tagMiddleClicked"
        >[tag-middle-click] {{ tagMiddleClicked }}
      </span>
      <span id="tagRightClicked">[tag-right-click] {{ tagRightClicked }} </span>
      <span id="tagDblClicked">[tag-dblclick] {{ tagDblClicked }}</span>
    </div>
    <div>
      <button @click="populate()">populate tree</button>
      <ul class="g8-tree-view g8-tree__highlight_hover">
        <g8-tree-view
          checker="1"
          :item="item"
          :handle-right-click="true"
          @click="itemClicked = $event.name"
          @middle-click="itemMiddleClicked = $event.name"
          @right-click="itemRightClicked = $event.name"
          @dblclick="itemDblClicked = $event.name"
          @tag-click="
            tagClicked = `${$event.node.name},${$event.tag.label},${$event.index}`
          "
          @tag-middle-click="
            tagMiddleClicked = `${$event.node.name},${$event.tag.label},${$event.index}`
          "
          @tag-right-click="
            tagRightClicked = `${$event.node.name},${$event.tag.label},${$event.index}`
          "
          @tag-dblclick="
            tagDblClicked = `${$event.node.name},${$event.tag.label},${$event.index}`
          "
        >
          <template #default="{ item }">
            <span :class="{ blue: !item.color }">
              {{ item.name }} (default slot)
            </span>
          </template>
          <template #tag="{ tag }">
            <span :class="{ blue: !tag.color }">
              {{ tag.label }} (tag slot)
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
  item: G8TreeItem = {
    key: 'root',
    name: 'Click the button above to populate me.',
  };

  itemClicked = '';

  itemMiddleClicked = '';

  itemRightClicked = '';

  itemDblClicked = '';

  tagClicked = '';

  tagMiddleClicked = '';

  tagRightClicked = '';

  tagDblClicked = '';

  populate() {
    const total = 100;
    this.item = {
      key: 'root',
      name: 'root name',
      tags: [{ label: 'root label' }],
      children: [],
    };
    for (let i = 1; i < total; i++) {
      const child: G8TreeItem = {
        key: `key-${i}`,
        name: `name ${i}`,
        color: i % 5,
        tags: [{ color: i % 5, label: `tag ${i}` }],
        children: [],
      };
      for (let j = 1; j < total; j++) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        child.children!.push({
          key: `key-${i}.${j}`,
          name: `name ${i}.${j}`,
          color: j % 5,
          tags: [{ color: j % 5, label: `tag ${i}.${j}` }],
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.item.children!.push(child);
    }
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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
  height: 100%;
  flex-direction: column;

  > div:last-child {
    flex: 1;
    overflow: auto;
  }
}

span[id] {
  margin: 5px;
  padding: 0 2px;
  border: 1px solid;
  display: inline-block;
}

.blue {
  color: blue;
}
</style>
