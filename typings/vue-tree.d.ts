/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { Vue } from 'vue-property-decorator';
import { G8TreeItem } from '.';

declare class G8TreeView extends Vue {
  /**
   * The tree data to be rendered.
   */
  item: G8TreeItem;

  /**
   * Whether to add a checkbox before each item, allowing multiple nodes to
   * be checked.
   */
  checker: boolean;

  /**
   * Whether the node is expanded.
   */
  expanded: boolean;

  /**
   * Whether the node is checked.
   */
  checked: boolean;
  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all were checked.
   */
  ints: boolean;

  /**
   * Whether the current node has any child.
   */
  get hasChild(): number | undefined;

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
  clicked(): void;

  /**
   * Handles double click event of nodes, emitting the `dblclick` event.
   */
  dblClicked(): void;

  /**
   * Handles double click event of tags, emitting the `tag-clicked` event.
   * @param tag
   * @param index
   */
  tagClicked(tag: number | string, index: number): void;

  /**
   * Handles double click event of tags, emitting the `tag-dblclicked`
   * event.
   * @param tag
   * @param index
   */
  tagDblClicked(tag: number | string, index: number): void;

  /**
   * Handles `state-changed` events emitted by children, updating the check
   * state of current node according. This method also bubbles up the
   * `state-changed` event.
   * @param evt
   */
  childrenStateChanged(evt: G8TreeItem): void;
}
