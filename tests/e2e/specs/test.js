/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const { labelSelector } = require('../helpers');

module.exports = {
  'basic tests': browser => {
    browser
      .init()
      .waitForElementVisible('#app')

      // the tree view is rendered
      .assert.elementPresent('.g8-tree__view')
      // the root node's text is correct
      .assert.containsOrMatches(
        labelSelector('#root'),
        /Click the button above to populate me\./i,
      );

    browser
      // generates test data
      .click('#populate')
      // root node's text has changed
      .assert.containsOrMatches(
        labelSelector('#root'),
        'root name',
        '%s label has changed to %s',
      );

    browser
      // check root node
      .clickChecker('#root')
      .assert.checkerChecked('#root')
      // state-changed event fired with correct parameters
      .assert.containsOrMatches('#stateChanged', 'root name,checked');

    browser
      // expands root node
      .clickLabel('#root')
      .assert.nodeExpanded('#root')
      // click event is fired with correct parameters
      .assert.containsOrMatches('#itemClicked', '+ root name')
      // checking root also checks all descendants
      .assert.checkerChecked('#key-1')
      .assert.checkerChecked('#key-5')
      .assert.checkerChecked('#key-9');

    browser
      // expands the the 2nd node
      .clickLabel('#key-2')
      .assert.nodeExpanded('#key-2')
      // click event is fired
      .assert.containsOrMatches('#itemClicked', 'name 2')
      // checking root also checks all descendants
      .assert.checkerChecked('#key-2-1')
      .assert.checkerChecked('#key-2-5')
      .assert.checkerChecked('#key-2-9');

    browser
      // root node's intermediate state changes to true, if a child is unchecked
      .clickChecker('#key-2')
      .assert.checkerIntermediate('#root')
      // unchecking a node unchecks all descendants
      .assert.not.checkerChecked('#key-2')
      .assert.not.checkerChecked('#key-2-3')
      .assert.not.checkerChecked('#key-2-8')
      // state-changed event fired with correct parameters
      .assert.containsOrMatches('#stateChanged', 'name 2,unchecked');

    browser
      // click event is fired on leaf node
      .clickLabel('#key-2-1')
      .assert.containsOrMatches('#itemClicked', 'name 2.1');

    browser
      // click event is fired on leaf tag
      .clickTag('#tag-2-1')
      .assert.containsOrMatches('#tagClicked', 'name 2.1, tag 2.1');

    browser
      // unchecking root node unchecks all descendants
      .clickChecker('#root')
      .assert.not.checkerChecked('#root')
      .assert.not.checkerChecked('#key-3')
      .assert.not.checkerChecked('#key-9')
      .assert.not.checkerChecked('#key-2-3')
      .assert.not.checkerChecked('#key-2-9')
      // state-changed event fired with correct parameters
      .assert.containsOrMatches('#stateChanged', 'root name,unchecked');

    browser
      // checking a node checks all its descendants,
      // and set's parent's intermediate state
      .clickChecker('#key-1')
      .clickLabel('#key-1')
      .assert.checkerIntermediate('#root')
      .assert.checkerChecked('#key-1-1')
      .assert.checkerChecked('#key-1-3')
      .assert.checkerChecked('#key-1-5')
      .assert.checkerChecked('#key-1-9')
      // state-changed event fired with correct parameters
      .assert.containsOrMatches('#stateChanged', 'name 1,checked');

    browser
      // clicking the toggle collapses the node
      .clickLabel('#key-2')
      .assert.not.nodeExpanded('#key-2')
      // click event is fired with correct parameters
      .assert.containsOrMatches('#itemClicked', '- name 2');

    // check if slot css class is applied
    ['#root', '#key-1-5', '#key-5']
      .map(i => labelSelector(i) + '>span')
      .forEach(n => browser.assert.cssClassPresent(n, 'tint'));
    ['#tag-2-5', '#tag-5']
      .map(i => `${i}>span`)
      .forEach(n => browser.assert.cssClassPresent(n, 'tint'));

    browser.end();
  },
};
