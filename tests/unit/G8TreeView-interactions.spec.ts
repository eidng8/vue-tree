/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import { G8TreeItem, G8VueTree } from '../../src';

const tree = {
  checker: true,
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
        tags: [{ label: 'tag2.1' }],
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
  } as G8TreeItem,
};

let wrapper: Wrapper<G8VueTree>;

describe('Tree View interactions', () => {
  beforeEach(
    () =>
      (wrapper = mount(G8VueTree, {
        propsData: JSON.parse(JSON.stringify(tree)),
      })),
  );

  it('expends and renders branches on click', async () => {
    expect.assertions(10);
    // initially no branch were expanded nor rendered
    expect(wrapper.find('.g8-tree__node--expended').exists()).toBeFalsy();
    expect(wrapper.findAll('.g8-tree__branch').length).toBe(0);
    expect(wrapper.findAll('.g8-tree__node__entry__label').length).toBe(1);
    // click the first branch to expand it and render the sub-tree
    wrapper.find('.g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll('.g8-tree__node--expended').length).toBe(1);
      const labels = wrapper.findAll('.g8-tree__node__entry__label');
      expect(labels.length).toBe(3);
      expect(labels.at(0).text()).toBe('root name');
      expect(labels.at(1).text()).toBe('item 1');
      expect(labels.at(2).text()).toBe('item 2');
    });
    // click the second branch to expand it and render the sub-tree
    wrapper.findAll('.g8-tree__branch .g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick(() => {
      expect(wrapper.findAll('.g8-tree__node--expended').length).toBe(2);
      expect(wrapper.findAll('.g8-tree__node__entry__label').length).toBe(5);
    });
  });

  it('collapses branch on click', async () => {
    expect.assertions(1);
    wrapper.find('.g8-tree__node__entry').trigger('click');
    // click the top branch to collapse
    wrapper.find('.g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-tree__node--expended').exists()).toBeFalsy();
  });

  it('toggles check state', async () => {
    expect.assertions(1);
    // check root node = checks all
    wrapper.find('.g8-tree__checker').trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__checker--checked').length).toBe(1);
  });

  it('propagates checked state', async () => {
    const checked = () =>
      wrapper.findAll('.g8-tree__checker.g8-tree__checker--checked');
    expect.assertions(2);
    wrapper.find('.g8-tree__checker').trigger('click');
    await wrapper.vm.$nextTick();
    expect(checked().length).toBe(1);
    wrapper.find('.g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick();
    expect(checked().length).toBe(3);
  });

  it('sets parent intermediate state if any child is checked', async () => {
    expect.assertions(1);
    wrapper.find('.g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick();
    // check 2nd branch = set root to intermediate state
    const checkers = wrapper.findAll('.g8-tree__checker');
    checkers.at(1).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-tree__checker').classes()).toContain(
      'g8-tree__checker--checked--intermediate',
    );
  });

  it('sets parent intermediate state if any child is unchecked', async () => {
    expect.assertions(2);
    wrapper.find('.g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick();
    // check root = check all descendant nodes
    wrapper.find('.g8-tree__checker').trigger('click');
    // uncheck 2nd branch = set root to intermediate state
    const checkers = wrapper.findAll('.g8-tree__checker');
    checkers.at(1).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.find('.g8-tree__checker').classes()).toContain(
      'g8-tree__checker--checked--intermediate',
    );
    expect(wrapper.findAll('.g8-tree__checker--checked').length).toBe(2);
  });

  it('toggles intermediate check state', async () => {
    expect.assertions(6);
    wrapper.find('.g8-tree__node__entry').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper
      .find(
        '.g8-tree__branch .g8-tree__node:nth-child(2) .g8-tree__node__entry',
      )
      .trigger('click');
    await wrapper.vm.$nextTick();
    const checkers = wrapper.findAll('.g8-tree__checker');
    // check last node = set root & 2nd branch to intermediate
    checkers.at(checkers.length - 1).trigger('click');
    await wrapper.vm.$nextTick();
    expect(
      wrapper.findAll('.g8-tree__checker--checked--intermediate').length,
    ).toBe(2);
    // check root node = check all
    checkers.at(0).trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.findAll('.g8-tree__checker--checked').length).toBe(5);
    // uncheck last node = set root & 2nd branch to intermediate
    checkers.at(checkers.length - 1).trigger('click');
    await wrapper.vm.$nextTick();
    expect(
      wrapper.findAll('.g8-tree__checker--checked--intermediate').length,
    ).toBe(2);
    expect(wrapper.findAll('.g8-tree__checker--checked').length).toBe(4);
    // uncheck 2nd last node = set root & 2nd branch to intermediate
    checkers.at(checkers.length - 2).trigger('click');
    await wrapper.vm.$nextTick();
    expect(
      wrapper.findAll('.g8-tree__checker--checked--intermediate').length,
    ).toBe(1);
    expect(wrapper.findAll('.g8-tree__checker--checked').length).toBe(2);
  });
});
