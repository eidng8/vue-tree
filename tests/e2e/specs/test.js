/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const root = '.g8-tree-view>.g8-tree__node';
const rootLabel = `${root}>.g8-tree__node_label`;
const branch2 = `${root}>.g8-tree__branch`;
const label2 = `${branch2}>.g8-tree__node:nth-child(2)>.g8-tree__node_label`;
const leaf = '.g8-tree__branch .g8-tree__branch';

module.exports = {
  'basic tests': browser => {
    browser
      .init()
      .waitForElementVisible('#app')
      .assert // the tree view is rendered
      .elementPresent('.g8-tree-view')
      .assert // the root node's text is correct
      .containsText(
        '.g8-tree__node_label_text',
        'Click the button above to populate me.',
      )

      .click('button')
      .assert // root node's text has changed
      .containsText(
        '.g8-tree__node_label_text',
        'root name',
      )
      .click(rootLabel)
      .assert // clicking the toggle expands the root
      .cssClassPresent(root, 'g8-tree__node_expended')
      .assert // click event is fired
      .value('#itemClicked', 'root')

      .click(label2)
      .assert // clicking the toggle expands the first branch
      .elementPresent('.g8-tree__branch .g8-tree__node_expended')
      .assert // click event is fired
      .value('#itemClicked', 'key-2')
      .moveToElement(rootLabel, 1, 1)
      .doubleClick()
      .assert // double clicking won't collapse the node
      .cssClassPresent(root, 'g8-tree__node_expended')
      .assert // double click event is fired
      .value('#itemDblClicked', 'root')

      .click(`${leaf} .g8-tree__node_label`)
      .assert // click event is fired
      .value('#itemClicked', 'key-2.1')
      .moveToElement(`${leaf} .g8-tree__node_label`, 1, 1)
      .doubleClick()
      .assert // click event is fired
      .value('#itemDblClicked', 'key-2.1')
      .click(`${leaf} .g8-tree__node_tag:last-child`)
      .assert // click event is fired
      .value('#tagClicked', 'key-2.1,tag-2.1,0')
      .moveToElement(`${leaf} .g8-tree__node_tag`, 1, 1)
      .doubleClick()
      .assert // click event is fired
      .value('#tagDblClicked', 'key-2.1,tag-2.1,0')

      .click(rootLabel)
      .assert.not // clicking the toggle collapses the node
      .cssClassPresent(root, 'g8-tree__node_expended')
      .click(`${rootLabel} .g8-tree__node_tag`)
      .assert // tag-click event is fired
      .value('#tagClicked', 'root,root tag,0')
      .moveToElement(`${rootLabel} .g8-tree__node_tag`, 1, 1)
      .doubleClick()
      .assert // tag-dbl-click event is fired
      .value('#tagDblClicked', 'root,root tag,0')
      .end();
  },
};
