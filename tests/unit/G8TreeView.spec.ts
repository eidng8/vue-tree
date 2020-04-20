/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, shallowMount } from '@vue/test-utils';
import { G8TreeView } from '../../src';

const tree = {
  item: {
    name: 'root name',
    tags: [{ label: 'root label' }],
    children: [
      {
        name: 'item 1',
        tags: [{ label: 'tag1.1' }, { label: 'tag1.2' }],
      },
      {
        name: 'item 2',
        tags: [{ label: 'tag1.1' }],
        children: [
          {
            name: 'item 2.1',
            tags: [{ label: 'tag2.1.1' }, { label: 'tag2.1.2' }],
          },
          {
            name: 'item 2.2',
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
        name: 'name',
        tags: [{ label: 'tag1' }],
      },
    };
    let wrapper = shallowMount(G8TreeView, { propsData });
    expect(wrapper.props('item')).toEqual({
      name: 'name',
      tags: [{ label: 'tag1' }],
    });
    expect(wrapper.find('.g8-tree__node_label_text').text()).toBe('name');
    expect(wrapper.find('.g8-tree__node_tag').text()).toBe('tag1');

    propsData = {
      item: {
        name: 'signal',
        tags: [{ label: 'tag2' }],
      },
    };
    wrapper = shallowMount(G8TreeView, { propsData });
    expect(wrapper.props('item')).toEqual({
      name: 'signal',
      tags: [{ label: 'tag2' }],
    });
    expect(wrapper.find('.g8-tree__node_label_text').text()).toBe('signal');
    expect(wrapper.find('.g8-tree__node_tag').text()).toBe('tag2');
  });

  it('expends/collapses and renders branches on click', async () => {
    expect.assertions(11);
    // initially no branch were expanded nor rendered
    const wrapper = mount(G8TreeView, { propsData: tree });
    expect(wrapper.find('.g8-tree__node_expended').exists()).toBeFalsy();
    expect(wrapper.findAll('.g8-tree__branch').length).toBe(0);
    expect(wrapper.findAll('.g8-tree__node_label_text').length).toBe(1);
    // click the first branch to expand it and render the sub-tree
    wrapper.find('.g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll('.g8-tree__node_expended').length).toBe(1);
      const labels = wrapper.findAll('.g8-tree__node_label_text');
      expect(labels.length).toBe(3);
      expect(labels.at(0).text()).toBe('root name');
      expect(labels.at(1).text()).toBe('item 1');
    });
    // click the second branch to expand it and render the sub-tree
    wrapper.findAll('.g8-tree__branch .g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll('.g8-tree__node_expended').length).toBe(2);
      expect(wrapper.findAll('.g8-tree__node_label_text').length).toBe(5);
    });
    // click branches to collapse them all
    wrapper.findAll('.g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.find('.g8-tree__node_expended').exists()).toBeFalsy();
      expect(wrapper.findAll('.g8-tree__node_label_text').length).toBe(5);
    });
  });

  it('emits click events', async () => {
    expect.assertions(3);
    const wrapper = mount(G8TreeView, { propsData: tree });
    wrapper.find('.g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('click');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0]).toBe(tree.item);
  });

  it('emits double click events', async () => {
    expect.assertions(3);
    const wrapper = mount(G8TreeView, { propsData: tree });
    wrapper.find('.g8-tree__node_label').trigger('dblclick');
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('dblclick');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0]).toBe(tree.item);
  });

  it('emits tag click events', async () => {
    expect.assertions(6);
    const wrapper = mount(G8TreeView, { propsData: tree });
    wrapper.findAll('.g8-tree__node_tag').trigger('click');
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('tag-clicked');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(6);
    expect(emitted[0][0]).toBe(tree.item.children[0].tags[0]);
    expect(emitted[1][0]).toBe(tree.item.children[0].tags[1]);
    expect(emitted[2][0]).toBe(tree.item.children[1].tags[1]);
    // @ts-ignore
    expect(emitted[2][0]).toBe(tree.item.children[1].children[0].tags[0]);
    // @ts-ignore
    expect(emitted[2][0]).toBe(tree.item.children[1].children[0].tags[1]);
  });

  it('emits tag double click events', async () => {
    expect.assertions(1);
    const wrapper = mount(G8TreeView, { propsData: tree });
    wrapper.findAll('.g8-tree__node_tag').trigger('dblclick');
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted('tag-dbl-clicked')).toEqual([
      [{ node: 'root', tag: 'root tag', index: 0 }],
      [{ node: 'item-1', tag: 1, index: 0 }],
      [{ node: 'item-1', tag: 1, index: 1 }],
      [{ node: 'item-2', tag: 2, index: 0 }],
      [{ node: 'item-2.1', tag: '2.1.1', index: 0 }],
      [{ node: 'item-2.1', tag: '2.1.2', index: 1 }],
    ]);
  });

  it('toggles check state', async () => {
    expect.assertions(1);
    const data = JSON.parse(JSON.stringify(tree));
    data.checker = true;
    const wrapper = mount(G8TreeView, { propsData: data });
    // check root node = checks all
    wrapper.find('.g8-tree__checker').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__checked').length).toBe(5);
  });

  it('toggles parent intermediate check state 1', async () => {
    expect.assertions(1);
    const data = JSON.parse(JSON.stringify(tree));
    data.checker = true;
    const wrapper = mount(G8TreeView, { propsData: data });
    // check 2nd branch = set root to intermediate state
    const checkers = wrapper.findAll('.g8-tree__checker');
    checkers.at(1).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-tree__checker').classes()).toContain(
      'g8-tree__checked_some',
    );
  });

  it('toggles parent intermediate check state 2', async () => {
    expect.assertions(2);
    const data = JSON.parse(JSON.stringify(tree));
    data.checker = true;
    const wrapper = mount(G8TreeView, { propsData: data });
    wrapper.find('.g8-tree__checker').trigger('click');
    // uncheck 2nd branch = set root to intermediate state
    const checkers = wrapper.findAll('.g8-tree__checker');
    checkers.at(1).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-tree__checker').classes()).toContain(
      'g8-tree__checked_some',
    );
    expect(wrapper.findAll('.g8-tree__checked').length).toBe(4);
  });

  it('toggles intermediate check state', async () => {
    expect.assertions(6);
    const data = JSON.parse(JSON.stringify(tree));
    data.checker = true;
    const wrapper = mount(G8TreeView, { propsData: data });
    const checkers = wrapper.findAll('.g8-tree__checker');
    // check last node = set root & 2nd branch to intermediate
    checkers.at(checkers.length - 1).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__checked_some').length).toBe(2);
    // check root node = check all
    checkers.at(0).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__checked').length).toBe(5);
    // uncheck last node = set root & 2nd branch to intermediate
    checkers.at(checkers.length - 1).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__checked_some').length).toBe(2);
    expect(wrapper.findAll('.g8-tree__checked').length).toBe(4);
    // uncheck 2nd last node = set root & 2nd branch to intermediate
    checkers.at(checkers.length - 2).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__checked_some').length).toBe(1);
    expect(wrapper.findAll('.g8-tree__checked').length).toBe(2);
  });
});
