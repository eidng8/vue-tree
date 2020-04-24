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

      // this button generates test data
      .click('button')
      .assert // root node's text has changed
      .containsText('.g8-tree__node_label_text', 'root name')

      // root node's check state propagates to descendants
      .click('.g8-tree__checker')
      .assert.cssClassPresent('.g8-tree__checker', 'g8-tree__checked')

      // clicking the toggle expands the root
      .click(rootLabel)
      .assert.cssClassPresent(root, 'g8-tree__node_expended')
      .assert // click event is fired
      .containsText('#itemClicked', '[click] root name')
      .assert // check state is propagated from root node
      .cssClassPresent(`${label2}>.g8-tree__checker`, 'g8-tree__checked')

      // clicking the toggle expands the first branch
      .click(label2)
      .assert.elementPresent('.g8-tree__branch .g8-tree__node_expended')
      .assert // click event is fired
      .containsText('#itemClicked', '[click] name 2')

      // double clicking won't collapse the node
      .moveToElement(rootLabel, 1, 1)
      .doubleClick()
      .assert.cssClassPresent(root, 'g8-tree__node_expended')
      .assert // double click event is fired
      .containsText('#itemDblClicked', '[dblclick] root name')

      // root node's intermediate state changes to true, if child is unchecked
      .click(`${label2}>.g8-tree__checker`)
      .assert.cssClassPresent(
        `${rootLabel}>.g8-tree__checker`,
        'g8-tree__checked_some',
      )

      // click event is fired on leaf node
      .click(`${leaf} .g8-tree__node_label`)
      .assert.containsText('#itemClicked', '[click] name 2.1')

      // double click event is fired on leaf node
      .moveToElement(`${leaf} .g8-tree__node_label`, 1, 1)
      .doubleClick()
      .assert // click event is fired
      .containsText('#itemDblClicked', '[dblclick] name 2.1')

      // click event is fired on leaf tag
      .click(`${leaf} .g8-tree__node_tag:last-child`)
      .assert // click event is fired
      .containsText('#tagClicked', '[tag-click] name 2.1,tag 2.1,0')

      // double click event is fired on leaf tag
      .moveToElement(`${leaf} .g8-tree__node_tag`, 1, 1)
      .doubleClick()
      .assert // click event is fired
      .containsText('#tagDblClicked', '[tag-dblclick] name 2.1,tag 2.1,0')

      // clicking the toggle collapses the node
      .click(rootLabel)
      .assert.not.cssClassPresent(root, 'g8-tree__node_expended')

      // click event is fired on root tag
      .click(`${rootLabel} .g8-tree__node_tag`)
      .assert // tag-click event is fired
      .containsText('#tagClicked', '[tag-click] root name,root label,0')

      // double click event is fired on root tag
      .moveToElement(`${rootLabel} .g8-tree__node_tag`, 1, 1)
      .doubleClick()
      .assert // tag-dblclick event is fired
      .containsText('#tagDblClicked', '[tag-dblclick] root name,root label,0')

      .end();
  },
};
