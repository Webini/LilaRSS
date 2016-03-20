var scraper     = require(__dirname + '/../../scraper/ArticleScraper.js');
var $q          = require('q');
var fs          = require('fs');
var Cheerio     = require('cheerio');

describe('scraper.ArticleScrapper', function(){
    describe('#getHtml()', function(){
        function readFile(file){
            return fs.readFileSync(__dirname + '/../files/' + file, { 'encoding': 'UTF-8' });
        }
        
        function getCheerioDoc(file) {
            return Cheerio.load(readFile(file));
        }
        
        it('should be similar than test_iframe_result.html', function(){
            var $   = getCheerioDoc('test_iframe.html');
            var $el = $('body');
            var url = 'http://test.com';
            
            assert.strictEqual(
                scraper($el, $, url), 
                readFile('test_iframe_result.html')
            );
        });
        
        it('should not found results', function(){
            var $   = getCheerioDoc('test_not_found.html');
            var $el = $('body');
            var url = 'http://test.com';
            
            assert.strictEqual(
                scraper($el, $, url), 
                undefined
            );
        });
        
    });
});