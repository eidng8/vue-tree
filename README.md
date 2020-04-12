# vue-tree

[![Master Build](https://travis-ci.com/eidng8/vue-tree.svg?branch=master)](https://travis-ci.com/eidng8/vue-tree)
[![Master Coverage](https://coveralls.io/repos/github/eidng8/vue-tree/badge.svg?branch=master)](https://coveralls.io/github/eidng8/vue-tree?branch=master)

A Vue.js tree view component with stable DOM tree. By stable, it means the
DOM structure will not change once it is rendered.


## Performance Consideration

The DOM structure of this component doesn't change once rendered.
Comparing to others using `v-if`, which generate sub-nodes while expanded.
While working on long list of items, lags will be obvious.

* This component will have a lag when once it is being rendered. After it is
rendered, sub-trees are controlled by CSS, no DOM structure happens.
* `v-if` components will lag whenever sub-trees are expanded, every time they
are expanded.
