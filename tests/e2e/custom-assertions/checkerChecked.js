/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const { checkerSelector } = require('../helpers');

/**
 *
 * @param {string} selector
 * @param {string} msg
 */
exports.assertion = function (selector, msg) {
  // If the custom commands operates with DOM elements, this options should be set
  this.options = {
    elementSelector: true,
  };

  /**
   * Returns the message format which will be used to output the message in the
   * console and also the arguments which will be used for replace the place
   * holders, used in the order of appearance
   *
   * The message format also takes into account whether the `.not` negate has
   * been used
   *
   * @return {{args: [], message: string}}
   */
  this.formatMessage = function () {
    if (!msg) {
      msg = `Testing if %s ${this.negate ? "isn't" : 'is'} checked`;
    }

    return {
      message: msg,
      args: [this.elementSelector],
    };
  };

  /**
   * Returns the expected value of the assertion which is displayed in the case
   * of a failure
   *
   * @return {string}
   */
  this.expected = function () {
    return `${this.negate ? "isn't" : 'is'} checked`;
  };

  /**
   * Given the value, the condition used to evaluate if the assertion is passed
   * @param {*} value
   * @return {Boolean}
   */
  this.evaluate = function (value) {
    return /.*\bg8-tree__node_entry_checker_checked\b.*/.test(value);
  };

  /**
   * When defined, this method is called by the assertion runner with the
   * command result to determine the actual state of the assertion in the event
   * of a failure
   *
   * @param {Boolean} passed
   * @return {string}
   */
  this.actual = function (passed) {
    return `${passed ? 'is' : "isn't"} checked`;
  };

  /**
   * The command which is to be executed by the assertion runner; Nightwatch
   * api is available as `this.api`
   * @param {function} cb
   */
  this.command = function (cb) {
    this.api.getAttribute(checkerSelector(selector), 'class', r => cb(r));
  };
};
