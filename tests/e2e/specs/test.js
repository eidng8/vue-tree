/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

module.exports = {
  'default e2e tests': browser => {
    browser
      .init()
      .waitForElementVisible('#app')
      .assert.elementPresent('.g8-tree-view')
      .assert.containsText('.g8-tree__node_label_text', 'item 1')
      .assert.elementCount('.g8-tree__branch', 0)
      .end();
  },

  'example e2e test using a custom command': browser => {
    browser
      .openHomepage()
      .assert.elementPresent('.g8-tree__node')
      .end();
  },
};
