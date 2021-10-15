# webpack-stats-tree

[![Node.js CI status](https://github.com/fengzilong/webpack-stats-tree/workflows/Node.js%20CI/badge.svg)](https://github.com/fengzilong/webpack-stats-tree/actions)

Parse webpack stats to `chunk → modules → file` tree

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
