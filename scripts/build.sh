#!/usr/bin/env bash

# we have multiple deployment jobs
# we just need to build the package only once
[[ "${PACKAGE}" != '' ]] && exit 0

# setup bundle-analyzer
npm install --no-save @bundle-analyzer/webpack-plugin

npm run build || exit 1

# set's the environment variable to indicate the package has been built
# this variable is also used by github deployment
export PACKAGE=$(npm pack --silent)

