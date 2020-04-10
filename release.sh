#!/bin/bash
set -ev
if [[ "${TRAVIS_BRANCH}" == "master" && "${TRAVIS_EVENT_TYPE}" == "push" ]]; then
 npm run build
 git tag $(node -p "require('./package.json').version")
 export PACKAGE=$(npm pack --silent)
fi
