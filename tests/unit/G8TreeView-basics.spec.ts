/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, shallowMount } from '@vue/test-utils';
import { G8TreeView } from '../../src';

describe('Tree View props', () => {
  it('renders using default props', () => {
    expect.assertions(3);
    const propsData = {
      item: {
        name: 'name',
        tags: [{ label: 'tag1' }],
      },
    };
    const wrapper = shallowMount(G8TreeView, { propsData });
    expect(wrapper.props('item')).toEqual({
      name: 'name',
      tags: [{ label: 'tag1' }],
    });
    expect(wrapper.find('.g8-tree__node__entry_label').text()).toBe('name');
    expect(wrapper.find('.g8-tree__node__entry__tags__tag').text()).toBe(
      'tag1',
    );
  });

  it('defaults to have no checkbox', () => {
    expect.assertions(1);
    const propsData = { item: { name: 'signal' } };
    const wrapper = shallowMount(G8TreeView, { propsData });
    expect(wrapper.find('.g8-tree__checker').exists()).toBeFalsy();
  });

  it('turns on checkbox rendering', () => {
    expect.assertions(1);
    let propsData = {
      checker: true,
      item: { name: 'name' },
    };
    let wrapper = shallowMount(G8TreeView, { propsData });
    expect(wrapper.find('.g8-tree__checker').exists()).toBeTruthy();
  });

  it('defaults to render only top level', () => {
    expect.assertions(3);
    const propsData = {
      item: {
        name: 'item 1',
        tags: [{ label: 'tag 1' }],
        children: [{ name: 'item 1.1', tags: [{ label: 'tag 2' }] }],
      },
    };
    const wrapper = shallowMount(G8TreeView, { propsData });
    expect(wrapper.findAll('.g8-tree__node').length).toBe(1);
    expect(wrapper.findAll('.g8-tree__node__entry__tags__tag').length).toBe(1);
    expect(wrapper.find('.g8-tree__branch').exists()).toBeFalsy();
  });

  it('renders using custom props', async () => {
    expect.assertions(4);
    const propsData = {
      itemId: 'text',
      itemLabel: 'text',
      tagsKey: 'badges',
      childrenKey: 'sub',
      tagId: 'text',
      tagLabel: 'text',
      tagHint: 'tip',
      item: {
        text: 'node1',
        badges: [{ text: 'tag1', tip: 'tip1' }],
        sub: [
          {
            text: 'node1-1',
            badges: [{ text: 'tag1-1' }],
            sub: [{ text: 'node1-1-1' }],
          },
          {
            text: 'node1-2',
            badges: [{ text: 'tag1-2' }],
          },
        ],
      },
    };
    const wrapper = mount(G8TreeView, { propsData });
    expect(wrapper.props('item')).toEqual(propsData.item);
    expect(wrapper.find('.g8-tree__node__entry_label').text()).toBe('node1');
    expect(wrapper.find('#tag1').attributes('title')).toBe('tip1');
    wrapper.find('.g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper.find('#node1-1>.g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('#node1-1-1').text()).toBe('node1-1-1');
  });
});
