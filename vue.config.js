/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

module.exports = {
  configWebpack: config => {
    config.sourceMap = 'production' !== process.env.NODE_ENV;
  },
};
