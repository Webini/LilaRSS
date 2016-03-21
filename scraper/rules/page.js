"use strict";

var DataScraper      = require(__dirname + '/../../lib/DataScraper.js');
var ArticleExtractor = require(__dirname + '/../extractor/ArticleExtractor.js');

module.exports = {
    'page.title' : {
        'meta[property="og:title"]'         : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        'title'                             : { method: DataScraper.extractors.text },
        'meta[name="twitter:title"]'        : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        'h1'                                : { method: DataScraper.extractors.text }
    },
    'page.image' : {
        'meta[property="og:image"]'                                         : { method: DataScraper.extractors.attr, args: [ 'content', true ] },
        'meta[name^="twitter:image"]'                                       : { method: DataScraper.extractors.attr, args: [ 'content', true ] },
        'link[rel="image_src"]'                                             : { method: DataScraper.extractors.attr, args: [ 'href', true ] },
        'meta[itemprop="image"]'                                            : { method: DataScraper.extractors.attr, args: [ 'content', true ] },
        '[itemprop="image"][itemtype="https://schema.org/ImageObject"] img' : { method: DataScraper.extractors.attr, args: [ 'src', true ] },
    },
    'page.description' : {
        'meta[property="og:description"]'                                         : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        'meta[name="twitter:description"]'                                        : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        'meta[name="description"]'                                                : { method: DataScraper.extractors.attr, args: [ 'content' ] }, 
        'meta[itemprop="description"]'                                            : { method: DataScraper.extractors.attr, args: [ 'content' ] }, 
    },
    'page.article' : {
        'article' : { method: ArticleExtractor }
    }
};