/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export interface G8TreeItem {
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

export interface G8TreeItemTag {
  key: number | string;

  label: string;

  hint?: string;
}

export type G8ClickEvent = string;

export type G8TagClickEvent = {
  node: number | string,
  tag: number | string,
  index: number
};

export type G8StateChangeEvent = {
  node: number | string,
  state: boolean,
}
