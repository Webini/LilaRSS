var DataScraper = require(__dirname + '/../../services/DataScraper.js');
var $q              = require('q');
var util            = require('util');
var fs              = require('fs');
var Cheerio         = require('cheerio');

describe('services.DataScraper', function(){
    var rules = {
        'site.name' : {
            'meta[name="application-name"]' : { method: DataScraper.extractors.attr, args: [ 'content' ] },
        },
        'site.logo[]' : {
            'link[rel="icon"]'             : { method: DataScraper.extractors.attr, args: [ 'href' ] },
            'link[rel="apple-touch-icon"]' : { method: DataScraper.extractors.attr, args: [ 'href' ] }
        },
        'page.title' : {
            'title' : { method: DataScraper.extractors.text },
        },
        'page.description' : {
            'meta[name="description"]' : { method: DataScraper.extractors.attr, args: [ 'content' ] }, 
        }
    };
    
    var correctResults = { 
        site: { 
            logo: [ 
                'http://www.numerama.com/content/uploads/2015/12/w-logo-blue.png',
                'http://www.numerama.com/content/uploads/2015/12/w-logo-blue.png' 
            ] 
        },
        page: { 
            title: 'Bastien Lachaud, l\'homme des campagnes numériques de Jean-Luc Mélenchon - Politique - Numerama',
            description: 'Pour comprendre comment fonctionne une stratégie numérique et mesurer son impact sur une campagne politique, Numerama vous embarque dans les coulisses des partis politiques français. Notre série politique continue avec Bastien Lachaud, responsable des actions au sein de la campagne de Jean-Luc Mélenchon.' 
        } 
    };
    
    
    describe('#extractors', function(){
        var $doc = Cheerio.load(
            '<link rel="alternate" type="application/rss+xml" href="http://test.com" />' +
            '<link rel="alternate" type="application/rss+xml" href="/local/rss" title="test" />' +
            '<a href="/local">test</a>' +
            '<img src="http://test.com" width="20" height="20" />' +
            '<p>Test <b>rich</b> text</p>'
        );
        
        
        describe('.attr', function(){
            it('should return src', function(){
                assert.strictEqual(
                    DataScraper.extractors.attr($doc('img'), $doc, 'http://test.com', 'src'),
                    'http://test.com'
                );
            });
            
            it('should return absolute path', function(){
                assert.strictEqual(
                    DataScraper.extractors.attr($doc('a'), $doc, 'http://test.com', 'href', true),
                    'http://test.com/local'
                );
            });
            
            it('should return local path', function(){
                assert.strictEqual(
                    DataScraper.extractors.attr($doc('a'), $doc, 'http://test.com', 'href', false),
                    '/local'
                );
            });
            
            it('should be undefined', function(){
                assert.strictEqual(
                    DataScraper.extractors.attr($doc('invalid'), $doc, null, 'src'),
                    undefined
                );
            });
        });
        
        describe('.text', function(){
            it('should return valid text', function(){
                assert.strictEqual(
                    DataScraper.extractors.text($doc('p'), $doc),
                    'Test rich text'
                );
            });
            it('should be empty string', function(){
                assert.strictEqual(
                    DataScraper.extractors.text($doc('invalid'), $doc),
                    ''
                );
            });
        });
        
        describe('.rss', function(){
            it('should return valid object', function(){
                assert.deepStrictEqual(
                    DataScraper.extractors.rss($doc('link'), $doc, 'http://test.com/'),
                    {
                        title: undefined,
                        url:   'http://test.com/',
                        type:  'application/rss+xml'  
                    }
                );
            });
            
            it('should return valid object with absolute path', function(){
                assert.deepStrictEqual(
                    DataScraper.extractors.rss($doc('link[title="test"]'), $doc, 'http://test.com/'),
                    {
                        title: 'test',
                        url:   'http://test.com/local/rss',
                        type:  'application/rss+xml'  
                    }
                );
            });
            
            it('should be empty object', function(){
                assert.strictEqual(
                    DataScraper.extractors.rss($doc('invalid'), $doc),
                    undefined
                );
            });
        });
    
    });
    
    describe('#scrapeBuffer()', function(){
        it('should match corrected results', function(done){
            fs.readFile(__dirname + '/../files/numerama.html', function(err, content){
                if(err){
                    return done(err);
                }
                
                var results = DataScraper.scrapeBuffer(
                    content, 
                    'http://www.numerama.com/politique/150762-bastien-lachaud-lhomme-des-campagnes-numeriques-de-jean-luc-melenchon.html', 
                    rules
                );
                
                assert.deepStrictEqual(results, correctResults);
                
                done();
            });
        });
        /*
        it('should not fail', function(){
            return DataScraper._makeRequest('http://google.com');
        });
        
        it('should failed', function(){
            return DataScraper._makeRequest('http://google.uko').then(
                function(body){
                    return $q.reject('Response received');
                },
                function(err){
                    return 'ok';
                }
            );
        })*/
    });
});