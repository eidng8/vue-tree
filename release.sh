#!/bin/bash
set -e

if [[ "${TRAVIS_BRANCH}" == "master" && "${TRAVIS_EVENT_TYPE}" == "push" ]]; then
  export TRAVIS_TAG=${TRAVIS_TAG:-$(node -p "require('./package.json').version")-$(date +'%Y.%m.%d')-$(git log --format=%h -1)}
  git tag ${TRAVIS_TAG}
  npm run build
  export PACKAGE=$(npm pack --silent)
else
  echo Skipping packaging because this is not master, or it is a pull request.
fi
