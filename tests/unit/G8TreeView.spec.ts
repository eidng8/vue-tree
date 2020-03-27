/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {shallowMount} from '@vue/test-utils';
import G8TreeView from '@/components/G8TreeView.vue';

describe('Tree View', () => {
  it('renders correctly with different props', () => {
    const propsData = {
      item: {
        key: 'Hello',
        name: 'name',
      },
    };
    const wrapper = shallowMount(G8TreeView, {propsData});
    expect(wrapper.props('item')).toEqual(propsData.item);
  });
});
