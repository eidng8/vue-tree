/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {Vue} from 'vue-property-decorator';
import {G8StateChangeEvent, G8TreeItem} from '.';

export declare class G8TreeView extends Vue {
  item: G8TreeItem;
  checker: boolean;
  expanded: boolean;
  checked: boolean;
  /**
   * Intermediate check box state. Active while some of the children were
   * checked, but not all were checked.
   */
  ints: boolean;

  get hasChild(): number | undefined;

  setState(state: boolean): void;

  clicked(): void;

  dblClicked(): void;

  tagClicked(tag: number | string, index: number): void;

  tagDblClicked(tag: number | string, index: number): void;

  childrenStateChanged(evt: G8StateChangeEvent): void;
}
