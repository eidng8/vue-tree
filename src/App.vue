<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<!--
  - This is the E2E test page. Please make sure tests are updated accordingly.
  -->

<template>
  <div id="app">
    <div id="events">
      <span id="itemClicked">{{ itemClicked }}</span>
      <span id="tagClicked">{{ tagClicked }}</span>
      <span id="stateChanged">{{ stateChanged }}</span>
    </div>
    <div>
      <button id="populate" @click="populate()">populate tree</button>
      <ul class="g8-tree-view g8-tree__dark g8-tree__highlight_hover">
        <g8-tree-view
          item-id="key"
          item-label="text"
          tags-key="badges"
          children-key="nodes"
          tag-id="key"
          tag-label="text"
          tag-hint="tip"
          :item="item"
          :checker="true"
          @click="
            itemClicked = `${$event.data.expanded ? '+' : '-'} ${
              $event.data.item.text
            }`
          "
          @state-changed="
            stateChanged = `${$event.text},${
              $event.checked ? 'checked' : 'unchecked'
            }`
          "
        >
          <template #default="{ item }">
            <span :class="{ tint: !item.tint }">
              {{ item.text }}
            </span>
          </template>
          <template #tag="{ item, tag }">
            <span
              :class="{ tint: !tag.tint }"
              @click.prevent.stop="tagClicked = `${item.text}, ${tag.text}`"
            >
              {{ tag.text }}
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
    text: 'Click the button above to populate me.',
  } as G8TreeItem;

  itemClicked = '';

  tagClicked = '';

  stateChanged = '';

  populate() {
    const total = 10;
    this.item = {
      key: 'root',
      text: 'root name',
      badges: [{ text: 'root tag' }],
    };
    const children = [];
    for (let i = 1; i < total; i++) {
      const child: G8TreeItem = {
        key: `key-${i}`,
        text: `name ${i}`,
        tint: i % 5,
        badges: [
          { tint: i % 5, key: `tag-${i}`, text: `tag ${i}`, tip: `tip ${i}` },
        ],
      };
      const sub = [];
      for (let j = 1; j < total; j++) {
        sub.push({
          key: `key-${i}-${j}`,
          text: `name ${i}.${j}`,
          tint: j % 5,
          badges: [
            {
              tint: j % 5,
              key: `tag-${i}-${j}`,
              text: `tag ${i}.${j}`,
              tip: `tip ${i}.${j}`,
            },
          ],
        });
      }
      child.nodes = sub;
      children.push(child);
    }
    this.item.nodes = children;
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

#events {
  padding: 2px;

  > * {
    margin: 0 3px;
    padding: 0 2px;
    border: solid 1px;
  }
}

.tint {
  color: lightseagreen;
}
</style>
