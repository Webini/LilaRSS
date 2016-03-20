"use strict";

const TIMEOUT    = 10000;
const USER_AGENT = 'lilarss-scraper https://github.com/Webini/LilaRSS';

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
             * @return {Array}
             */
            text: function($el) {
                return $el.text();
            },
        
            /**
             * Extract attributes for $el
             * @param {CheerioElements} $el
             * @param {CheerioDocument} $
             * @param {string} Origin url used for reconstructing partial uris
             * @param {string} attr
             * @param {boolean} isUrl /!\TODO
             * @return {Array}
             */
            attr: function($el, $, originUrl, attr, isUrl) {
                let data = $el.attr(attr);
                
                if (isUrl && data) {
                    return url.resolve(originUrl, data);
                }
                
                return data;
            },
            
            /**
             * Extract attributes for $el
             * @param {CheerioElements} $el
             * @return {Array<Object>}
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
            }
        };
        
        this.rules = {
            'site.name' : {
                'meta[name="application-name"]'                                      : { method: this.extractors.attr, args: [ 'content' ] },
                'meta[property="og:site_name"]'                                      : { method: this.extractors.attr, args: [ 'content' ] },
                '[itemtype="https://schema.org/Organization"] meta[itemprop="name"]' : { method: this.extractors.attr, args: [ 'content' ] },
                'title'                                                              : { method: this.extractors.text },
            },
            'site.logo[]' : {
                'link[rel="icon"]'                                                 : { method: this.extractors.attr, args: [ 'href', true ] },//multiple
                'link[rel="apple-touch-icon"]'                                     : { method: this.extractors.attr, args: [ 'href', true ] },
                'link[rel="apple-touch-icon-precomposed"]'                         : { method: this.extractors.attr, args: [ 'href', true ] },
                'meta[name="msapplication-TileImage"]'                             : { method: this.extractors.attr, args: [ 'content', true ] },
                '[itemprop="logo"][itemtype="https://schema.org/ImageObject"] img' : { method: this.extractors.attr, args: [ 'src', true ] },
                'link[rel="shortcut icon"]'                                        : { method: this.extractors.attr, args: [ 'href', true ] },
            },
            'site.rss[]' : {
                'link[type="application/rss+xml"]'  : { method: this.extractors.rss },
                'link[type="application/atom+xml"]' : { method: this.extractors.rss }  
            },
            'page.title' : {
                'meta[property="og:title"]'         : { method: this.extractors.attr, args: [ 'content' ] },
                'title'                             : { method: this.extractors.text },
                'meta[name="twitter:title"]'        : { method: this.extractors.attr, args: [ 'content' ] },
                'h1'                                : { method: this.extractors.text }
            },
            'page.image' : {
                'meta[property="og:image"]'                                         : { method: this.extractors.attr, args: [ 'content', true ] },
                'meta[name^="twitter:image"]'                                       : { method: this.extractors.attr, args: [ 'content', true ] },
                'link[rel="image_src"]'                                             : { method: this.extractors.attr, args: [ 'href', true ] },
                'meta[itemprop="image"]'                                            : { method: this.extractors.attr, args: [ 'content', true ] },
                '[itemprop="image"][itemtype="https://schema.org/ImageObject"] img' : { method: this.extractors.attr, args: [ 'src', true ] },
            },
            'page.description' : {
                'meta[property="og:description"]'                                         : { method: this.extractors.attr, args: [ 'content' ] },
                'meta[name="twitter:description"]'                                        : { method: this.extractors.attr, args: [ 'content' ] },
                'meta[name="description"]'                                                : { method: this.extractors.attr, args: [ 'content' ] }, 
                'meta[itemprop="description"]'                                            : { method: this.extractors.attr, args: [ 'content' ] }, 
            },
            'page.article' : {
                'article' : { method: DataScraper.extractArticle }
            }
        };
    }
        
    static extractArticle($el, $) {
        var $p = $el.find('p');
        var $cont = null;
        console.log('ARTICLE FOUND');
        for (let i = 0, sz = $p.length; i < sz; i++) {
            let $parent = $p.eq(i).parent();
            
            //rajouter un check isDone et pas se repayer la recherche avec le meme parent
            let psz = $parent.find('>p').length;
            console.log('SZ FOUND => ', psz);
            if (psz >= 4) {
                $cont = $parent;
                break;
            }
        }
        
        if ($cont) {
            let $els = $('<div></div>').append($cont.find('>p,>blockquote,>h2,>h3,>h4,>h5,>h6,>div img,>div iframe,>iframe,>video,>div video'));
            console.log('finding', $els);
            return $els.html();
        }
        return null;
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