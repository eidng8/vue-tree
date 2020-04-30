/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Vue } from 'vue-property-decorator';

/**
 * Tree item data
 */
declare interface G8TreeItem {
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
declare interface G8TreeItemTag {
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

declare class G8ClickEvent extends MouseEvent {
  data?: { expanded: boolean; item: G8TreeItem };
}

/**
 * A tree view component with stable DOM structure. Stable means its structure
 * will not change once rendered. This component uses CSS to toggle sub-tree.
 * To improve performance, sub-trees are not rendered until they are first
 * expanded. Once expanded, further collapse/expand action won't cause the
 * sub-tree to be rendered again. Currently there is an
 * [issue](https://github.com/eidng8/vue-tree/issues/24) about performance
 * problem of large tree data set.
 */
declare class G8VueTree extends Vue {
  /**
   * Key of the field in `item` to be used as element's `id` attribute.
   */
  itemId: string;

  /**
   * Key of the field in `item` that holds node label.
   */
  itemLabel: string;

  /**
   * Key of the field in `item` that holds tags array.
   */
  tagsKey: string;

  /**
   * Key of the field in `item` that holds child nodes array.
   */
  childrenKey: string;

  /**
   * Key of the field in tags list of `item` to be used as tag element's `id`
   * attribute.
   */
  tagId: string;

  /**
   * Key of the field in tags list of `item` that holds tag label.
   */
  tagLabel: string;

  /**
   * Key of the field in tags list of `item` that holds tag tooltip.
   */
  tagHint: string;

  /**
   * Whether to add a checkbox before each item, allowing multiple nodes to
   * be checked.
   */
  checker: boolean;

  /**
   * The tree data to be rendered. Please note that data passed ***may*** be
   * mutated by this component to reflect various states of tree nodes. Mutated
   * fields include:
   *
   * - checked
   * - intermediate
   * - rendered
   */
  item: G8TreeItem;

  /**
   * Whether the node is expanded.
   */
  expanded: boolean;

  /**
   * Whether the node is checked. This must be a member field in order for
   * binding to work.
   */
  checked: boolean;

  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all were checked. This must be a member field in order for
   * binding to work.
   */
  intermediate: boolean;

  /**
   * Whether the current node has any child.
   */
  get hasChild(): boolean;

  /**
   * Handles the click event of checkboxes. Sets whether the current node is
   * checked. Also set propagates the state to all immediate children.
   * This method emits the `state-changed` event.
   * @param state
   */
  setState(state: boolean): void;

  /**
   * Handles click event of nodes, expanding/collapsing sub-tree if
   * applicable. This method emits the `click` event.
   */
  clicked(event: G8ClickEvent): void;

  /**
   * Handles `state-changed` events emitted by children, updating the check
   * state of current node according. This method also bubbles up the
   * `state-changed` event.
   * @param node
   */
  childrenStateChanged(node: G8TreeItem): void;
}
