const analyze = require( './analyze' )
const format = require( './format' )

const ID = `WebpackStatsTreePlugin`

module.exports = class WebpackStatsTreePlugin {
  apply( compiler ) {
    compiler.hooks.done.tap( ID, ( stats, callback ) => {
      console.log()
      console.log( format( analyze( stats.toJson() ) ) )
      console.log()
    } )
  }
}