#!/bin/bash
set -ev
if [[ "${TRAVIS_BRANCH}" == "master" && "${TRAVIS_EVENT_TYPE}" == "push" ]]; then
  npm run build
  git tag $(node -p "require('./package.json').version")-$(date +'%Y.%m.%d')
  export PACKAGE=$(npm pack --silent)
else
  echo Skipping packaging because this is not master, or it is a pull request.
fi
