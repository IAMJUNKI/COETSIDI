const moduleAlias = require('module-alias')
const path = require('path')
moduleAlias.addAliases({
    '@auth': path.join(__dirname, 'modules','auth'),
    '@calendario': path.join(__dirname,  'modules','calendario'),
    '@db': path.join(__dirname, 'database'),
    '@gestorData': path.join(__dirname, 'modules','gestorData'),
    '@inicio': path.join(__dirname, 'modules','inicio'),
    '@mapa': path.join(__dirname, 'modules','mapa'),
    '@utils': path.join(__dirname, 'modules','utils'),
    '@googleCalendar': path.join(__dirname, 'modules','googleCalendar')
    
})