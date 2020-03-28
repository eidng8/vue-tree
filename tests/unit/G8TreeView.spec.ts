/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import {mount, shallowMount} from '@vue/test-utils';
import G8TreeView from '@/components/G8TreeView.vue';

const tree = {
  item: {
    key: 'root',
    name: 'root name',
    tags: [{key: 'root tag', label: 'root label'}],
    children: [
      {
        key: 'item-1',
        name: 'item 1',
        tags: [
          {key: 1, label: 'tag1.1'},
          {key: 1, label: 'tag1.2'},
        ],
      },
      {
        key: 'item-2',
        name: 'item 2',
        tags: [{key: 2, label: 'tag1.1'}],
        children: [
          {
            key: 'item-2.1',
            name: 'item 2.1',
            tags: [
              {key: '2.1.1', label: 'tag2.1.1'},
              {key: '2.1.2', label: 'tag2.1.2'},
            ],
          },
        ],
      },
    ],
  },
};

describe('Tree View', () => {
  it('renders different props', () => {
    expect.assertions(6);
    let propsData = {
      item: {
        key: 'Hello',
        name: 'name',
        tags: [{key: 1, label: 'tag1'}],
      },
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
    expect.assertions(4);
    const wrapper = mount(G8TreeView, {propsData: tree});
    expect(wrapper.props('item')).toEqual(tree.item);
    const labels = wrapper.findAll('.g8-tree__node_label_text');
    expect(labels.length).toBe(4);
    expect(labels.at(0).text()).toBe('root name');
    expect(labels.at(1).text()).toBe('item 1');
  });

  it('expends branches on click', async () => {
    // initially no branch were expanded
    const wrapper = mount(G8TreeView, {propsData: tree});
    expect(wrapper.find('.g8-tree__node_expended').exists()).toBeFalsy();
    expect(wrapper.findAll('.g8-tree__branch').length).toBe(2);
    // click the first branch to expand it
    wrapper.find('.g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__node_expended').length).toBe(1);
    // click the second branch to expand it
    wrapper.findAll('.g8-tree__branch .g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__node_expended').length).toBe(2);
    // click branches to collapse them all
    wrapper.findAll('.g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-tree__node_expended').exists()).toBeFalsy();
  });

  it('emits click events', async () => {
    const wrapper = mount(G8TreeView, {propsData: tree});
    // click the root node
    wrapper.find('.g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('click')).toEqual([['root']]);
    // double click the root node
    wrapper.find('.g8-tree__node_label').trigger('dblclick');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('dblclick')).toEqual([['root']]);
    // click all tags
    wrapper.findAll('.g8-tree__node_tag').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('tag-clicked')).toEqual([
      [{node: 'root', tag: 'root tag', index: 0}],
      [{node: 'item-1', tag: 1, index: 0}],
      [{node: 'item-1', tag: 1, index: 1}],
      [{node: 'item-2', tag: 2, index: 0}],
      [{node: 'item-2.1', tag: '2.1.1', index: 0}],
      [{node: 'item-2.1', tag: '2.1.2', index: 1}],
    ]);
    // double click all tags
    wrapper.findAll('.g8-tree__node_tag').trigger('dblclick');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('tag-dbl-clicked')).toEqual([
      [{node: 'root', tag: 'root tag', index: 0}],
      [{node: 'item-1', tag: 1, index: 0}],
      [{node: 'item-1', tag: 1, index: 1}],
      [{node: 'item-2', tag: 2, index: 0}],
      [{node: 'item-2.1', tag: '2.1.1', index: 0}],
      [{node: 'item-2.1', tag: '2.1.2', index: 1}],
    ]);
  });
});
