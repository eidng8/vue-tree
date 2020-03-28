/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

module.exports = {
  test_settings: {
    chrome: {
      desiredCapabilities: {
        chromeOptions: {
          args: [
            '--headless',
          ],
        },
      },
    },
  },
};
