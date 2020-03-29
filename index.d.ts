/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import Vue from 'vue';
import {
  G8ClickEvent,
  G8StateChangeEvent,
  G8TagClickEvent,
  G8TreeItem,
  G8TreeItemTag,
} from './src';

declare class G8TreeView extends Vue {
  item: G8TreeItem;

  checker: boolean;

  expanded: boolean;

  checked: boolean;

  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all were checked.
   */
  ints: boolean;

  get hasChild(): boolean;

  setState(): void;

  clicked(): void;

  dblClicked(): void;

  tagClicked(tag: number | string, index: number): void;

  tagDblClicked(tag: number | string, index: number): void;

  childrenStateChanged(evt: G8StateChangeEvent): void;
}


export {
  G8TreeView,
  G8TreeItem,
  G8TreeItemTag,
  G8ClickEvent,
  G8TagClickEvent,
  G8StateChangeEvent,
};
