'use strict';

// Yes, this file is custom.
module.exports = (plugin) => {
    plugin.bootstrap = require('./server/bootstrap');
    plugin.services['providers'] = require('./server/services/providers');
    plugin.services['providers-registry'] = require('./server/services/providers-registry');
    plugin.services['jwt'] = require('./server/services/jwt');
    return plugin;
}


