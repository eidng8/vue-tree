/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

/**
 * @param {string} selector
 * @return {string[]}
 */
function makeLabelSelectors(selector) {
  selector = selector ? selector.trim() : '';
  return selector
    .split(',')
    .map(s => s.trim())
    .map(s => (s ? `${s}>` : '') + '.g8-tree__node__entry');
}

/**
 * @param {string[]} selectors
 * @param {string} sub
 * @return {string}
 */
function makeSelectors(selectors, sub) {
  return selectors.map(s => `${s}${sub}`).join(',');
}

/**
 * @param {string} selector
 * @return {string}
 */
function checkerSelector(selector) {
  return makeSelectors(makeLabelSelectors(selector), '>.g8-tree__checker');
}

/**
 * @param {string} selector
 * @return {string|string[]}
 */
function entrySelector(selector) {
  return makeLabelSelectors(selector).join(',');
}

/**
 * @param {string} selector
 * @return {string}
 */
function labelSelector(selector) {
  return makeSelectors(
    makeLabelSelectors(selector),
    '>.g8-tree__node__entry__label',
  );
}

module.exports = {
  checkerSelector,
  entrySelector: entrySelector,
  labelSelector,
  makeSelectors,
};
