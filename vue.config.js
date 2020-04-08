/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

module.exports = {
  configureWebpack: config => {
    if ('production' == process.env.NODE_ENV) {
      config.devtool = undefined;
    }
  },
};
