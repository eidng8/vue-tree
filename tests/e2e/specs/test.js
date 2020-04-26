/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const { labelSelector, makeSelectors } = require('../helpers');

module.exports = {
  'basic tests': browser => {
    browser
      .init()
      .waitForElementVisible('#app')

      // the tree view is rendered
      .assert.elementPresent('.g8-tree-view')
      // the root node's text is correct
      .assertEntryContains('#root', /Click the button above to populate me\./i)

      // generates test data
      .click('#populate')
      // root node's text has changed
      .assertEntryContains('#root', 'root name', '%s label has changed to %s')

      // check root node
      .clickChecker('#root')
      .assertChecked('#root')

      // expands root node
      .clickLabel('#root')
      .assertExpanded('#root')
      .assertClickRespondantContains('root name') // click event is fired

      // checking root also checks all descendants
      .assertChecked('#key-1,#key-5,#key-9')

      // expands the the 2nd node
      .clickLabel('#key-2')
      .assertExpanded('#key-2')
      .assertClickRespondantContains('name 2') // click event is fired

      // checking root also checks all descendants
      .assertChecked('#key-2-1,#key-2-5,#key-2-9')

      // root node's intermediate state changes to true, if a child is unchecked
      .clickChecker('#key-2')
      .assertIntermediate('#root')

      // unchecking a node unchecks all descendants
      .assertUnchecked('#key-2,#key-2-3,#key-2-8')

      // click event is fired on leaf node
      .clickLabel('#key-2-1')
      .assertClickRespondantContains('name 2.1')

      // click event is fired on leaf tag
      .clickTag('#tag-2-1')
      .assertTagRespondantContains('name 2.1, tag 2.1')

      // unchecking root node unchecks all descendants
      .clickChecker('#root')
      .assertUnchecked('#root,#key-3,#key-3-3,#key-9,#key-9-9')

      // checking a node checks all its descendants,
      // and set's parent's intermediate state
      .clickChecker('#key-1')
      .clickLabel('#key-1')
      .assertChecked('#key-1-1,#key-1-3,#key-1-5,#key-1-9')
      .assertIntermediate('#root')

      // clicking the toggle collapses the node
      .clickLabel('#key-2')
      .assertCollapsed('#key-2')

      // check if slot css class is applied
      .assert.cssClassPresent(
        makeSelectors(
          labelSelector('#root,#key-1-5,#key-5').split(','),
          '>span',
        ),
        'tint',
      )
      .assert.cssClassPresent(
        makeSelectors(['#tag-3-5', '#tag-5'], '>span'),
        'tint',
      )

      .end();
  },
};
