const path = require( 'path' )
const getPkgName = require( 'get-package-name' )

function isLeaf( node ) {
  return !node.group || ( node.group.length === 0 )
}

function normalizePath( filepath = '' ) {
  const SEP = '(concatenated)/'

  if ( filepath.includes( SEP ) ) {
    [ , filepath ] = filepath.split( SEP )
  }
  
  if ( filepath.startsWith( '/' ) ) {
    filepath = filepath.substr( 1 )
  }
  
  if ( filepath.startsWith( './' ) ) {
    filepath = filepath.substr( 2 )
  }
  
  return filepath
}

function getPackageName( filepath ) {
  return getPkgName( normalizePath( filepath ) ) || ''
}

exports.isLeaf = isLeaf
exports.normalizePath = normalizePath
exports.getPackageName = getPackageName
