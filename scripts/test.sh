#!/usr/bin/env bash

# setup code climate
curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
chmod +x ./cc-test-reporter
./cc-test-reporter before-build

# setup coveralls
npm install --no-save coveralls

# test
npm run test:unit -- --coverage || exit 1
cat ./coverage/lcov.info | coveralls
npm run test:e2e || exit 1
./cc-test-reporter after-build --exit-code "${TRAVIS_TEST_RESULT}"
# cc-test-reporter may report error, just ignore it
exit 0
