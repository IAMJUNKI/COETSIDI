const moduleAlias = require('module-alias')
const path = require('path')
moduleAlias.addAliases({
    '@auth': path.join(__dirname, 'modules','auth'),
    '@db': path.join(__dirname, 'database'),
    
})