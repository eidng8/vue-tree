#!/usr/bin/env bash

# setup code climate
setup_cc() {
  # use only linux for analysis
  [[ "${TRAVIS_OS_NAME}" != 'linux' ]] && return 0
  curl -L https://codeclimate.com/downloads/test-reporter/test-reporter-latest-linux-amd64 > ./cc-test-reporter
  chmod +x ./cc-test-reporter
  ./cc-test-reporter before-build
}

# submit to code climate
submit_cc() {
  # use only linux for analysis
  [[ "${TRAVIS_OS_NAME}" != 'linux' ]] && return 0
  ./cc-test-reporter after-build --exit-code "${RES}"
  # cc-test-reporter may report error, just ignore it
  return 0
}

# setup coveralls
setup_ca() {
  # use only linux for analysis
  [[ "${TRAVIS_OS_NAME}" != 'linux' ]] && return 0
  npm install --no-save coveralls
}

# submit to coveralls
submit_ca() {
  # use only linux for analysis
  [[ "${TRAVIS_OS_NAME}" != 'linux' ]] && return 0
  cat ./coverage/lcov.info | coveralls
}

RES=0
# unit test
setup_ca
setup_cc
npm run test:unit -- --coverage
RES=$?
submit_cc
submit_ca
[[ ${RES} != '0' ]] && exit 1

# e2e test
npm run test:e2e
