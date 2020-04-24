/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { G8TreeView as VueTree } from './vue-tree';

/**
 * A tree view component with stable DOM structure. Stable means its structure
 * will not change once rendered. This component uses CSS to toggle sub-tree.
 * To improve performance, sub-trees are not rendered until they are first
 * expanded. Once expanded, further collapse/expand action won't cause the
 * sub-tree to be rendered again. Currently there is an
 * [issue](https://github.com/eidng8/vue-tree/issues/24) about performance
 * problem of large tree data set.
 */
declare class G8TreeView extends VueTree {}

/**
 * Tree data
 */
declare interface G8TreeItem {
  /**
   * Item key, serves as identifier
   */
  key: number | string;

  /**
   * Item name (its label)
   */
  name: string;

  /**
   * Checkbox state
   */
  checked?: boolean;

  /**
   * Intermediate check box state. `true` while some of the children were
   * checked, but not all.
   */
  intermediate?: boolean;

  /**
   * Tags attached to the item
   */
  tags?: G8TreeItemTag[];

  /**
   * List of child items
   */
  children?: G8TreeItem[];
}

/**
 * Item tag data, rendered using `<label>` tag.
 */
declare interface G8TreeItemTag {
  /**
   * Tag key, serves as identifier
   */
  key: number | string;

  /**
   * Tag label
   */
  label: string;

  /**
   * The `<label>` tag's `title` attribute
   */
  hint?: string;
}

/**
 * `key` of the item clicked
 */
declare type G8ClickEvent = string | number;

/**
 * The tag being clicked
 */
declare type G8TagClickEvent = {
  /**
   * The item's `key`
   */
  node: number | string;

  /**
   * The tag's `key`
   */
  tag: number | string;

  /**
   * Index of the tag in the array
   */
  index: number;
};
