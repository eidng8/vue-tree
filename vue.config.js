/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const BundleAnalyzerPlugin = require('@bundle-analyzer/webpack-plugin');

module.exports = {
  configureWebpack: config => {
    if ('production' == process.env.NODE_ENV) {
      config.devtool = undefined;
    }
    if (process.env.BUNDLE_ANALYZER_TOKEN) {
      config.plugins.push(new BundleAnalyzerPlugin(
        {token: process.env.BUNDLE_ANALYZER_TOKEN}));
    }
  },
};
