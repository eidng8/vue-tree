/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { shallowMount } from '@vue/test-utils';
import { G8TreeView } from '../../src';

describe('Tree View props', () => {
  it('renders props', () => {
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
    expect(wrapper.find('.g8-tree__node_label_text').text()).toBe('name');
    expect(wrapper.find('.g8-tree__node_tag').text()).toBe('tag1');
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
    expect(wrapper.findAll('.g8-tree__node_tag').length).toBe(1);
    expect(wrapper.find('.g8-tree__branch').exists()).toBeFalsy();
  });
});
