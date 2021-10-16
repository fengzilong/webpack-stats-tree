const analyze = require( './analyze' )
const format = require( './format' )

const ID = `WebpackStatsTreePlugin`

module.exports = class WebpackStatsTreePlugin {
  apply( compiler ) {
    compiler.hooks.done.tap( ID, stats => {
      let out = ''

      try {
        out = format( analyze( stats.toJson() ) )
      } catch ( e ) {}

      if ( out ) {
        console.log()
        console.log( out )
        console.log()
      }
    } )
  }
}
