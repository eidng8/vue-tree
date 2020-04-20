/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * Tree item data
 */
export interface G8TreeItem {
  /**
   * Just to allow accessing data via index syntax.
   */
  [key: string]: any;

  /**
   * Item name, serves as label, will be rendered as node label.
   */
  name: string;

  /**
   * Whether current node is checked.
   */
  checked?: boolean;

  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all.
   */
  intermediate?: boolean;

  /**
   * Whether the immediate sub-tree of this node has been rendered.
   */
  rendered?: boolean;

  /**
   * List of tags.
   */
  tags?: G8TreeItemTag[];

  /**
   * List of child nodes.
   */
  children?: G8TreeItem[];
}

/**
 * Node tag data
 */
export interface G8TreeItemTag {
  /**
   * Tag label.
   */
  label: string;

  /**
   * Tag tooltip. Visible when mouse hovers on the tag.
   */
  hint?: string;
}

/**
 * Mouse click event of tree node
 */
export type G8ClickEvent = string | number;

/**
 * Mouse click event of tag
 */
export type G8TagClickEvent = {
  /**
   * Key of the node that triggered the event.
   */
  node: number | string;

  /**
   * Key of the tag that triggered the event.
   */
  tag: number | string;

  /**
   * Numeric index of the item in the tag list.
   */
  index: number;
};

/**
 * Tree node state changed event
 */
export type G8StateChangeEvent = G8TreeItem;
