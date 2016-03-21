"use strict";

var DataScraper = require(__dirname + '/../../lib/DataScraper.js');

module.exports = {
    'site.name' : {
        'meta[name="application-name"]'                                      : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        'meta[property="og:site_name"]'                                      : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        '[itemtype="https://schema.org/Organization"] meta[itemprop="name"]' : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        'title'                                                              : { method: DataScraper.extractors.text },
    },
    'site.logo[]' : {
        'link[rel="icon"]'                                                 : { method: DataScraper.extractors.attr, args: [ 'href', true ] },//multiple
        'link[rel="apple-touch-icon"]'                                     : { method: DataScraper.extractors.attr, args: [ 'href', true ] },
        'link[rel="apple-touch-icon-precomposed"]'                         : { method: DataScraper.extractors.attr, args: [ 'href', true ] },
        'meta[name="msapplication-TileImage"]'                             : { method: DataScraper.extractors.attr, args: [ 'content', true ] },
        '[itemprop="logo"][itemtype="https://schema.org/ImageObject"] img' : { method: DataScraper.extractors.attr, args: [ 'src', true ] },
        'link[rel="shortcut icon"]'                                        : { method: DataScraper.extractors.attr, args: [ 'href', true ] },
    },
    'site.rss[]' : {
        'link[type="application/rss+xml"]'  : { method: DataScraper.extractors.rss },
        'link[type="application/atom+xml"]' : { method: DataScraper.extractors.rss }  
    },
    'site.lang' : {
        'html'                                : { method: DataScraper.extractors.lang },
        'meta[http-equiv="content-language"]' : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        'meta[property="og:locale"]'          : { method: DataScraper.extractors.attr, args: [ 'content' ] }
    }
};