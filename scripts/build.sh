#!/usr/bin/env bash

# setup bundle-analyzer
npm install --no-save @bundle-analyzer/webpack-plugin

npm run build || exit 1
export PACKAGE=$(npm pack --silent)

