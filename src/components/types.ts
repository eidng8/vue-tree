/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

export interface G8TreeItem {
  key: number | string;

  name: string;

  tags?: G8TreeItemTag[];

  children?: G8TreeItem[];
}

export interface G8TreeItemTag {
  key: number | string;

  label: string;
}
