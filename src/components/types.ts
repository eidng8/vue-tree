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
   * Just to allow accessing data via index syntax and arbitrary data to fit in.
   */
  [key: string]: unknown;

  /**
   * Item name, serves as label, will be rendered as node label.
   */
  name?: string;

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
   * Whether the sub-tree of this node has been rendered.
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
   * Just to allow accessing data via index syntax and arbitrary data to fit in.
   */
  [key: string]: unknown;

  /**
   * Tag label.
   */
  label: string;

  /**
   * Tag tooltip. Visible when mouse hovers on the tag.
   */
  hint?: string;
}

export class G8ClickEvent extends MouseEvent {
  data?: unknown;
}
