/*
 * GPLv3 https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * Author: eidng8
 */

const enabled = !process.env.CI;

module.exports = {
  test_settings: {
    default: {
      screenshots: {
        enabled,
        on_failure: true,
        on_error: true,
        path: 'tests/e2e/reports/screenshots',
      },
    },
  },
};
