"use strict";

const TIMEOUT    = 10000;
const USER_AGENT = 'LilaRSS-scraper https://github.com/Webini/LilaRSS';

var $q          = require('q');
var request     = require('request');
var Cheerio     = require('cheerio');
var MagicAccess = require(__dirname + '/MagicAccess.js');
var url         = require('url');

class DataScraper {
    constructor(){
        this.extractors = {
            /**
             * Extract text value for each nodes
             * @param {CheerioElements} $el
             * @return {string|undefined}
             */
            text: function($el) {
                return $el.text().trim();
            },
        
            /**
             * Extract attributes for $el
             * @param {CheerioElements} $el
             * @param {CheerioDocument} $
             * @param {string} Origin url used for reconstructing partial uris
             * @param {string} attr
             * @param {boolean} isUrl /!\TODO
             * @return {string|undefined}
             */
            attr: function($el, $, originUrl, attr, isUrl) {
                let data = $el.attr(attr);
                data = (data ? data.trim() : data);
                
                if (isUrl && data) {
                    return url.resolve(originUrl, data);
                }
                
                return data;
            },
            
            /**
             * Extract attributes for $el
             * @param {CheerioElements} $el
             * @return {Object}
             */
            rss: function($el, $, originUrl) {
                if ($el.length <= 0) {
                    return;
                }
                
                let href = $el.attr('href');
                if (!href) {
                    return;
                }
                
                return {
                    title: $el.attr('title'),
                    url:   url.resolve(originUrl, href),
                    type:  $el.attr('type')    
                };
            },
            
            /**
             * Extract lang attribute for $el
             * @return {string|undefined}
             */
            lang: function($el) {
                var lang = $el.attr('lang') || $el.attr('xml:lang');
                return (lang ? lang.trim() : lang);
            }
        };
    }
    
    /**
     * Make request to url
     * @param string url
     * @return {promise}
     */
    _makeRequest(url) {
        var defer = $q.defer();
        
        request({
            url: url,
            followRedirect: true,
            timeout: TIMEOUT,
            'user-agent': USER_AGENT
        }, function(error, response, body) {
            if (error || response.statusCode !== 200) {
                defer.reject(error, response);
            } else {
                defer.resolve(body);
            }
        })  
        
        return defer.promise;
    }
    
    /**
     * 
     */
    scrape(url) {
        var self = this;
        return this._makeRequest(url).then(
            function(data){
                return self.scrapeBuffer(data);
            }
        )
    }
    
    /**
     * @param {object} fn Should be an object like { method: function, args: [ argument1, ... ] }
     * @param {CheerioElements} $el
     * @param {CheerioDocument} $
     * @param {string} Origin url used for reconstructing partial uris
     * @return {Array|null}
     */
    _executeMethod(fn, $el, $, originUrl) {
        var method = fn.method;
        var params = [ $el , $, originUrl ];
        
        if (fn.args) {
            params = params.concat(fn.args)
        }
        
        return method.apply(null, params);
    }
    
    /**
     * Scrape data from buffer with rules
     * @param {string} buffer
     * @param {string} Origin url used for reconstructing partial uris
     * @param {object} rules Object like { 
     *      'out.mySubObject': { 
     *          'selector': { method: function, params: [ 'param1', 'param2' ] }, 
     *          ...
     *      },
     *      ...
     *  }
     * @return {object}
     */
    scrapeBuffer(buffer, originUrl, rules) {
        var $   = Cheerio.load(buffer);
        var out = {};
        
        for (let key in rules) {
            let rule = rules[key];
            let path = key;
            let isPushable = MagicAccess.isPushable(path);
            
            for (let selector in rule) {
                let $elements = $(selector);
                let results = []; 
                
                for (let i = 0, sz = $elements.length; i < sz; i++) {
                    var cr = this._executeMethod(rule[selector], $elements.eq(i), $, originUrl);
                    
                    if (cr) {
                        results.push(cr);
                        /**
                         * If we cannot add more than one entry, we will kill processing of the 
                         * rest of the results once we've found one
                         */
                        if (!isPushable) {
                            break;
                        }
                    }
                }
                
                if (results.length > 0) {
                    MagicAccess.set(out, key, (results.length == 1 ? results[0] : results), true);
                    
                    //goto next selector
                    if (!isPushable) {
                        break;
                    }
                }
            }
        }
        
        return out;
    }
}

module.exports = new DataScraper();