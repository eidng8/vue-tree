<!--
  - GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
  -
  - Author: eidng8
  -->

<template>
  <div id="app">
    <g8-tree-view :item="item"></g8-tree-view>
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
    key: 'item 1',
    name: 'item 1',
  };
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
