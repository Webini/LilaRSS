var db       = require(__dirname + '/models/index.js');
var services = require(__dirname + '/services/index.js');
var config   = require(__dirname + '/config/config' + (process.env.PLATFORM ? '.' + process.env.PLATFORM : '') + '.json'); 

var app = {
    orm:        db,
    config:     config,
    services:   services
};

module.exports = app;

services.ready();