# webpack-stats-tree

[![npm](https://img.shields.io/npm/v/webpack-stats-tree.svg)](https://www.npmjs.org/package/webpack-stats-tree)
[![Node.js CI status](https://github.com/fengzilong/webpack-stats-tree/workflows/Node.js%20CI/badge.svg)](https://github.com/fengzilong/webpack-stats-tree/actions)
[![npm](https://img.shields.io/npm/dm/webpack-stats-tree.svg)](https://www.npmjs.org/package/webpack-stats-tree)

Answer to "What's in the bundle"

<img src="media/screenshot.jpg" alt="screenshot" width="500" />

You can see which modules and files are in your chunk 🎉

## Installation

```bash
npm i webpack-stats-tree
```

## API

```js
const { analyze, format } = require( 'webpack-stats-tree' )

console.log( format( analyze( webpackStats ) ) )
```

## License

MIT
