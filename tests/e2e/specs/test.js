/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const firstNode = '.g8-tree-view>.g8-tree__node:first-child';
const firstLabel = `${firstNode}>.g8-tree__node_label:first-child`;

module.exports = {
  'basic tests': browser => {
    browser
      .init()
      .waitForElementVisible('#app')
      .assert // the tree view is rendered
      .elementPresent('.g8-tree-view')
      .assert // the root node's text is correct
      .containsText('.g8-tree__node_label_text', 'root name')
      .click(firstLabel)
      .assert // clicking the toggle expands the node
      .cssClassPresent(firstNode, 'g8-tree__node_expended')
      .assert // click event is fired
      .value('#itemClicked', 'root')
      .moveToElement(firstLabel, 1, 1)
      .doubleClick()
      .assert // double clicking won't collapse the node
      .cssClassPresent(firstNode, 'g8-tree__node_expended')
      .assert // double click event is fired
      .value('#itemDblClicked', 'root')
      .click(firstLabel)
      .assert.not // clicking the toggle collapses the node
      .cssClassPresent(firstNode, 'g8-tree__node_expended')
      .click(`${firstLabel} .g8-tree__node_tag`)
      .assert // tag-click event is fired
      .value('#tagClicked', 'root,root tag,0')
      .moveToElement(`${firstLabel} .g8-tree__node_tag`, 1, 1)
      .doubleClick()
      .assert // tag-dbl-click event is fired
      .value('#tagDblClicked', 'root,root tag,0')
      .end();
  },
};
