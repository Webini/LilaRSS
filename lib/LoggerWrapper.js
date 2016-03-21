"use strict";

var bunyan = require('bunyan');
var path   = require('path');

class LoggerWrapper {
    
    constructor(config, parent) {
        this.config = config;
        if (!parent) {
            this.logger = bunyan.createLogger({
                name: 'lila',
                src: true,
                streams: [
                    {
                        level: 'info',
                        path:  path.resolve(__dirname, config.info)  // log ERROR and above to a file
                    },
                    {
                        level: 'error',
                        path:  path.resolve(__dirname, config.error)  // log ERROR and above to a file
                    },
                    {
                        level: 'warn',
                        path:  path.resolve(__dirname, config.warn)  // log ERROR and above to a file
                    },
                    {
                        level:  'debug',
                        stream: process.stdout
                    },
                    {
                        level:  'trace',
                        stream: process.stdout
                    }
                ]
            });  
        } else {
            this.logger = parent.child(config);
        }
        
        this.error   = this.logger.error.bind(this.logger);
        this.warning = this.logger.warn.bind(this.logger);
        this.info    = this.logger.info.bind(this.logger);
        this.debug   = this.logger.debug.bind(this.logger);
        this.trace   = this.logger.trace.bind(this.logger);
    }
    
    /**
     * Create a child logger
     * @return {bunyan.Logger}
     */
    createChild(name, opts) {
        return new LoggerWrapper(
            Object.assign({}, opts, { component: name }),
            this.logger
        );
    }
    
    close(){}
}

module.exports = LoggerWrapper;