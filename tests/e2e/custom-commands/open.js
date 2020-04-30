/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * A class-based Nightwatch custom command which is a variation of the
 * openHomepage.js command. The command name is the filename and class needs to
 * contain a "command" method.
 *
 * Example usage:
 *   browser.openHomepageClass();
 *
 * For more information on writing custom commands see:
 *   https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
 *
 */

module.exports.command = function () {
  this.init()
    .waitForElementVisible('#app')

    // the tree view is rendered
    .assert.elementPresent('.g8-tree__view')
    // the root node's text is correct
    .assertEntryContains('#root', /Click the button above to populate me\./i)

    // generates test data
    .click('#populate')
    // root node's text has changed
    .assertEntryContains('#root', 'root name', '%s label has changed to %s');
};
