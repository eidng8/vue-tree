/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

module.exports = {
  parallel: 'production' !== process.env.NODE_ENV,
  chainWebpack: config => {
    config.module.sourceMap = 'production' !== process.env.NODE_ENV;
    if ('production' === process.env.NODE_ENV) {
      // disable cache (not sure if this is actually useful...)
      config.module.rule('ts').uses.delete('cache-loader');

      config
        .module
        .rule('ts')
        .use('ts-loader')
        .loader('ts-loader')
        .tap(opts => {
          opts.transpileOnly = false;
          opts.happyPackMode = false;
          return opts;
        });
    }
  },
};
