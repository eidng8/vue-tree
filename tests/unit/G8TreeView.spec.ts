/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {mount, shallowMount} from '@vue/test-utils';
import G8TreeView from '@/components/G8TreeView.vue';
import {G8TreeItem} from '@/components/types';

describe('Tree View', () => {
  it('renders different props', () => {
    expect.assertions(6);
    let propsData = {
      item: {
        key: 'Hello',
        name: 'name',
        tags: [{key: 1, label: 'tag1'}],
      } as G8TreeItem,
    };
    let wrapper = shallowMount(G8TreeView, {propsData});
    expect(wrapper.props('item'))
      .toEqual({key: 'Hello', name: 'name', tags: [{key: 1, label: 'tag1'}]});
    expect(wrapper.find('.g8-tree__node_label_text').text())
      .toBe('name');
    expect(wrapper.find('.g8-tree__node_tag').text())
      .toBe('tag1');

    propsData = {
      item: {
        key: 'wow',
        name: 'signal',
        tags: [{key: 2, label: 'tag2'}],
      },
    };
    wrapper = shallowMount(G8TreeView, {propsData});
    expect(wrapper.props('item'))
      .toEqual({key: 'wow', name: 'signal', tags: [{key: 2, label: 'tag2'}]});
    expect(wrapper.find('.g8-tree__node_label_text').text())
      .toBe('signal');
    expect(wrapper.find('.g8-tree__node_tag').text())
      .toBe('tag2');
  });

  it('renders hierarchy', async () => {
    const propsData = {
      item: {
        key: 'item-1',
        name: 'item 1',
        tags: [{key: 1, label: 'tag1'}],
        children: [
          {
            key: 'item-1_1',
            name: 'item 1.1',
            tags: [
              {key: 1.1, label: 'tag1.1'},
              {key: 1.2, label: 'tag1.2'},
            ],
          },
        ],
      },
    };

    const wrapper = mount(G8TreeView, {propsData});
    expect(wrapper.props('item')).toEqual(propsData.item);

    const labels = wrapper.findAll('.g8-tree__node_label_text');
    expect(wrapper.find('.g8-tree__node_expended').exists()).toBeFalsy();
    expect(labels.length).toBe(2);
    expect(labels.at(0).text()).toBe('item 1');
    expect(labels.at(1).text()).toBe('item 1.1');
    wrapper.find('.g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-tree__node_expended').exists()).toBeTruthy();
  });
});
