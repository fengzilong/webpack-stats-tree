const analyzer = require( 'webpack-bundle-analyzer/lib/analyzer' )
const path = require( 'path' )
const getPackageName = require( 'get-package-name' )
const prettyBytes = require( 'pretty-bytes' )
const { normalizePath } = require( './shared' )

function traverseStats( stats ) {
  const chunks = analyzer.getViewerData( stats )

  debugger

  const results = []

  chunks.forEach( chunk => {
    const result = {
      name: chunk.label,
      children: [],
      size: chunk.statSize,
      humanSize: prettyBytes( chunk.statSize ),
      files: [],
    }

    const nodeModulesGroup = chunk.groups.find( group => group.label === 'node_modules' )

    if ( nodeModulesGroup ) {
      const traversed = traverse( nodeModulesGroup )
      result.children = traversed.children
      result.files = traversed.files
    }

    results.push( result )
  } )

  results.sort( ( a, b ) => b.size - a.size )

  return results
}

function traverse( group ) {
  const root = createNode( group )

  root.children = sort( merge( traverseDown( group, root ) ) )
  root.files = sort( getFiles( group ) )

  return root
}

function sort( nodes ) {
  nodes.sort( ( a, b ) => b.size - a.size )

  nodes.forEach( node => {
    if ( node.children ) {
      sort( node.children )
    }
  } )

  return nodes
}

function merge( nodes ) {
  return Object.values( nodes.reduce( ( memo, node ) => {
    if ( memo[ node.name ] ) {
      memo[ node.name ].size = memo[ node.name ].size + node.size
      memo[ node.name ].humanSize = prettyBytes( memo[ node.name ].size )
      memo[ node.name ].children.push( node )
    } else {
      memo[ node.name ] = memo[ node.name ] || {
        ...node,
        relativePath: void 0,
        children: [ node ],
      }
    }

    return memo
  }, {} ) )
}

function traverseDown( group, root, check = true ) {
  let leafNodes = []
  if ( group.groups && group.groups.length > 0 ) {
    if ( check && group.path.endsWith( '(concatenated)' ) ) {
      // 特殊情况，需要再建立新的根节点
      const rootNode = createNode( group )
      rootNode.children = traverseDown( group, rootNode, false )
      leafNodes.push( rootNode )
    } else {
      group.groups.forEach( grp => {
        leafNodes.push( ...traverseDown( grp, root ) )
      } )
    }
  } else {
    const leafNode = createNode( group, { root } )
    leafNodes.push( leafNode )
  }

  return leafNodes
}

function getFiles( group ) {
  let files = []

  if ( group.groups && group.groups.length > 0 ) {
    group.groups.forEach( grp => {
      files.push( ...getFiles( grp ) )
    } )
  } else {
    const file = createNode( group )
    files.push( file )
  }

  return files
}

function createNode( node, { root = null } = {} ) {
  const normalizedPath = normalizePath( node.path )
  const normalizedPathWithoutNodeModules = relativeToNodeModules( normalizedPath )
  const pkgName = getPackageName( node.path )

  const out = {
    name: pkgName,
    size: node.statSize,
    humanSize: prettyBytes( node.statSize || 0 ),
    path: normalizedPathWithoutNodeModules,
    relativePath: (
      root && ~root.path.indexOf( '(concatenated)' ) &&
      ( ( pkgName !== root.name ) || !~normalizedPath.indexOf( 'node_modules' ) )
    ) ?
      ( ~normalizedPath.indexOf( 'node_modules' ) ? normalizedPath : `<project>/${ normalizedPathWithoutNodeModules }` ) :
      pkgName ? path.relative( pkgName, normalizedPathWithoutNodeModules ) : normalizedPathWithoutNodeModules,
  }

  if ( root ) {
    out.root = root
  }

  return out
}

function relativeToNodeModules( filepath = '' ) {
  if ( ~filepath.indexOf( 'node_modules' ) ) {
    return path.relative( './node_modules', filepath )
  }

  return filepath
}

module.exports = traverseStats
