/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

import { mount, Wrapper } from '@vue/test-utils';
import { G8TreeItem, G8TreeView } from '../../src';

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

let wrapper: Wrapper<G8TreeView>;
let propsData: { item: G8TreeItem };

describe('Tree View events', () => {
  beforeEach(() => {
    propsData = JSON.parse(JSON.stringify(tree));
    wrapper = mount(G8TreeView, { propsData });
  });

  it('emits click events', async () => {
    expect.assertions(3);
    wrapper.find('.g8-tree__node_label').trigger('click');
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('click');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0]).toStrictEqual(propsData.item);
  });

  it('emits double click events', async () => {
    expect.assertions(3);
    wrapper.find('.g8-tree__node_label').trigger('dblclick');
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('dblclick');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0]).toStrictEqual(propsData.item);
  });

  it('emits tag click events', async () => {
    expect.assertions(5);
    const tags = wrapper.findAll('.g8-tree__node_tag');
    tags.trigger('click');
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('tag-clicked');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0].node).toStrictEqual(propsData.item);
    expect(emitted[0][0].tag).toStrictEqual(propsData.item.tags![0]);
    expect(emitted[0][0].index).toStrictEqual(0);
  });

  it('emits tag double click events', async () => {
    expect.assertions(5);
    wrapper.findAll('.g8-tree__node_tag').trigger('dblclick');
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted('tag-dbl-clicked');
    expect(emitted).toBeInstanceOf(Array);
    expect(emitted.length).toBe(1);
    expect(emitted[0][0].node).toStrictEqual(propsData.item);
    expect(emitted[0][0].tag).toStrictEqual(propsData.item.tags![0]);
    expect(emitted[0][0].index).toStrictEqual(0);
  });
});
