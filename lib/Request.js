"use strict";

var req          = require('request');
var FeedParser   = require('feedparser')
var iconv        = require('iconv-lite');
var $q           = require('q');
var Stream       = require('stream');

const HTTP_USER_AGENT = 'LilaRSS-scraper https://github.com/Webini/LilaRSS';
const HTTP_ACCEPT     = 'application/rss+xml, application/rdf+xml;q=0.8, application/atom+xml;q=0.6, application/xml;q=0.4, text/xml;q=0.4, text/html;q=0.2, application/xhtml+xml;q=0.2';
const REQUEST_TIMEOUT = 10000;

class Request {
    constructor(options) {
        this.options = Object.assign(
            {
                followRedirect: true,
                gzip: true,
                encoding: null,
                timeout: REQUEST_TIMEOUT,
                headers: {
                    'user-agent': HTTP_USER_AGENT,
                    'accept'    : HTTP_ACCEPT
                }
            },
            options    
        );
    }
    
    /**
     * Execute the request
     * @return {promise}
     */
    send(){
        var defer = $q.defer();
        
        req(this.options, function (error, response, body) {
            if (error) {
                defer.reject(error);
                return;
            }
            
            let charset   = Request.getParams(response.headers['content-type'] || '').charset;
            response.body = iconv.decode(new Buffer(body), charset);
            
            defer.resolve(response);
        });
        
        return defer.promise;
    }
    
    /**
     * "Stream" the request (in reality no, cause we need to use gzip & encoding)
     * @return {stream.Readable} 
     */
    stream(){    
        var cs = new Stream.Readable();
        cs._read = function noop() {};

        this.send().then(
            function (response) {
                cs.push(response.body);
                cs.push(null);
            },
            function (error) {
                cs.emit('error', error);
            }
        );
        
        return cs;
    }
    
    static getParams(str){
        var params = str.split(';').reduce(function (params, param) {
            var parts = param.split('=').map(function (part) { 
                return part.trim();
            });
            
            if (parts.length === 2) {
                params[parts[0]] = parts[1];
            }
            
            return params;
        }, {});
        return params;
    }
}


module.exports = Request;