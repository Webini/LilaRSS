"use strict";

const controllers   = require(__dirname + '/controllers/index.js');
const middlewares   = require(__dirname + '/middlewares/index.js');
const db            = require(__dirname + '/models/index.js');
const services      = require(__dirname + '/services/index.js');
const config        = require(__dirname + '/config/config' + (process.env.PLATFORM ? '.' + process.env.PLATFORM : '') + '.json'); 
const Express       = require('express');
const bodyParser    = require('body-parser')
const ElasticSearch = require('elasticsearch');

var   Logger      = require(__dirname + '/lib/LoggerWrapper');
var   httpApp     = Express();
var   router      = Express.Router();
var   server      = require('http').Server(httpApp);

httpApp.use(Express.static(config.http.static));
httpApp.use(bodyParser.json());
httpApp.use('/', router);

var app = {
    http:          httpApp,
    server:        server,
    orm:           db,
    config:        config,
    services:      services,
    controllers:   controllers,
    router:        router,
    middlewares:   middlewares,
    logger:        new Logger(config.logger),
};

app.es = ElasticSearch.Client(Object.assign(config.elasticsearch, {
    log: function() { 
        return app.logger.createChild('ElasticSearch'); 
    }
}));

module.exports = app;

services.ready();
middlewares.ready();
controllers.ready();

//include & create routing
require(__dirname + '/routes/index.js');