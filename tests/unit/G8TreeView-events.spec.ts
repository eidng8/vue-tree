/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount } from '@vue/test-utils';
import { G8TreeItem, G8TreeView } from '../../src';
import { ComponentOptions } from 'vue';

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
  } as G8TreeItem,
};

let propsData: { checker?: boolean; clicked?: Function; item: G8TreeItem };

describe('Tree View events', () => {
  beforeEach(() => {
    propsData = JSON.parse(JSON.stringify(tree));
  });

  it('emits click events', async () => {
    const changed = jest.fn();
    const wrapper = mount(G8TreeView, {
      propsData,
      listeners: { click: changed },
    });
    expect.assertions(7);
    expect(wrapper.find('.g8-tree__node .g8-tree__node').exists()).toBeFalsy();
    wrapper.find('.g8-tree__node_entry').trigger('click');
    await wrapper.vm.$nextTick();
    expect(changed).toHaveBeenCalledTimes(1);
    const emitted = wrapper.emitted('click');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0]).toBeInstanceOf(MouseEvent);
    expect(emitted[0][0].data).toStrictEqual(propsData.item);
    expect(wrapper.find('.g8-tree__node .g8-tree__node').exists()).toBeTruthy();
  });

  it('can not be preventDefault()', async () => {
    const clicked = jest.fn();
    propsData.clicked = clicked;
    const wrapper = mount(
      {
        template: `
          <ul>
            <g8-tree-view :item="item" @click.prevent="clicked($event)"></g8-tree-view>
          </ul>`,
        inject: ['item', 'clicked'],
        components: { G8TreeView },
      } as ComponentOptions<any>,
      { provide: propsData },
    );
    expect.assertions(5);
    expect(wrapper.find('.g8-tree__node .g8-tree__node').exists()).toBeFalsy();
    wrapper.find('.g8-tree__node_entry').trigger('click');
    await wrapper.vm.$nextTick();
    expect(clicked).toHaveBeenCalledTimes(1);
    expect(clicked).toHaveBeenLastCalledWith(
      expect.objectContaining({ data: propsData.item }),
    );
    expect(wrapper.emitted('click')).toBeUndefined();
    expect(wrapper.find('.g8-tree__node .g8-tree__node').exists()).toBeTruthy();
  });

  it('emits state-change event', async () => {
    const changed = jest.fn();
    propsData.checker = true;
    const wrapper = mount(G8TreeView, {
      propsData,
      listeners: { 'state-changed': changed },
    });
    expect.assertions(5);
    const checker = wrapper.find('.g8-tree__node_entry_checker');
    checker.trigger('click');
    await wrapper.vm.$nextTick();
    expect(changed).toHaveBeenCalled();
    const emitted = wrapper.emitted('state-changed');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0]).toStrictEqual(propsData.item);
    expect(checker.is('.g8-tree__node_entry_checker_checked')).toBeTruthy();
  });

  it('emits state-change of intermediate state', async () => {
    const changed = jest.fn();
    propsData.checker = true;
    const wrapper = mount(G8TreeView, {
      propsData,
      listeners: { 'state-changed': changed },
    });
    expect.assertions(9);
    expect(propsData.item.intermediate).toBeFalsy();
    expect(propsData.item.children![1].intermediate).toBeFalsy();
    wrapper.find('.g8-tree__node_entry').trigger('click');
    await wrapper.vm.$nextTick();
    wrapper
      .findAll('.g8-tree__node '.repeat(2) + '.g8-tree__node_entry')
      .trigger('click');
    await wrapper.vm.$nextTick();
    wrapper
      .find('.g8-tree__node '.repeat(3) + '.g8-tree__node_entry')
      .trigger('click');
    await wrapper.vm.$nextTick();
    const checker = wrapper.find(
      '.g8-tree__node '.repeat(3) + '.g8-tree__node_entry_checker',
    );
    checker.trigger('click');
    await wrapper.vm.$nextTick();
    expect(changed).toHaveBeenCalled();
    const emitted = wrapper.emitted('state-changed');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0]).toStrictEqual(
      propsData.item.children![1].children![0],
    );
    expect(checker.is('.g8-tree__node_entry_checker_checked')).toBeTruthy();
    expect(propsData.item.intermediate).toBeTruthy();
    expect(propsData.item.children![1].intermediate).toBeTruthy();
  });
});
