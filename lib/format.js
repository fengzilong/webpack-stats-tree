const path = require( 'path' )
const treeify = require( 'treeify' )
const { black, gray, green, magenta, bgYellow, bold, dim, blue } = require( 'chalk' )
const stringWidth = require( 'string-width' )

function format( tree ) {
  let out = ''

  if ( !tree || tree.length === 0 ) {
    console.log( `Cann't find any package in chunks` )
    return
  }

  const emptyChunks = []
  tree.forEach( chunk => {
    if ( chunk.children.length > 0 ) {
      out = out + `${ bgYellow( black( ` Chunk ` ) ) } ${ chunk.name } ${ gray( `(${ chunk.humanSize })` ) }` + '\n'
      out = out + treeify.asTree( toTree( chunk ), false ) + '\n'
    } else {
      emptyChunks.push( chunk )
    }
  } )

  if ( emptyChunks.length > 0 ) {
    const messages = emptyChunks.map( chunk => {
      return `${ bgYellow( black( ` Chunk ` ) ) } ${ chunk.name } ${ gray( `(${ chunk.humanSize })` ) }`
    } )

    const maxLength = Math.max( ...messages.map( message => stringWidth( message ) ) )
    
    out = out + messages.map( message => {
      const length = stringWidth( message )
      const spaceLength = maxLength - length

      return `${ message } ${ ' '.repeat( spaceLength ) }` +
        ' No packages found'
    } ).join( '\n' )
  }

  return out
}

function toTree( tree, key = 'name' ) {
  const out = {}

  if ( tree.children && tree.children.length > 0 ) {
    tree.children.forEach( child => {
      if ( child.children && child.children.length > 0 ) {
        out[ `${ child[ key ] } ${ gray( `(${ child.humanSize })` ) }` ] = toTree( child, 'relativePath' )
      } else {
        out[ `${ child[ key ] } ${ gray( `(${ child.humanSize })` ) }` ] = ``
      }
    } )
  }

  return out
}

module.exports = format