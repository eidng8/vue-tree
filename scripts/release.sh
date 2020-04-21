#!/usr/bin/env bash

if [[ $(git rev-parse --abbrev-ref HEAD) != 'master' ]]; then
  echo You are not on master branch.
  exit 1
fi
