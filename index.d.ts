/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import Vue from 'vue';

declare interface G8TreeItem {
  key: number | string;

  name: string;

  checked?: boolean;

  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all were checked.
   */
  ints?: boolean;

  tags?: G8TreeItemTag[];

  children?: G8TreeItem[];
}

declare interface G8TreeItemTag {
  key: number | string;

  label: string;

  hint?: string;
}

declare type G8ClickEvent = string;

declare type G8TagClickEvent = {
  node: number | string;
  tag: number | string;
  index: number;
};

declare type G8StateChangeEvent = {
  node: number | string;
  state: boolean;
}

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
