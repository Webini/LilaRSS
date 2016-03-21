var Request         = require(__dirname + '/../../lib/Request.js');
var $q              = require('q');
var fs = require('fs');

describe('lib.Request', function(){ 
    describe('#send()', function(){
        it('should not fail', function(done){
            (new Request({ url: 'https://www.reddit.com/' })).send().then(
                function (response, body) {
                    done();
                },
                function (error) {
                    done(error);
                }
            )
        });
    });
    
    describe('#stream()', function(){
        it('should not fail', function(done){
            var req = new Request({ url: 'https://www.reddit.com/' });
            var stream = req.stream();
            stream.on('error', function(err) {
                done(err);  
            });
            
            stream.on('end', function(data) {
                done();
            });
            
            stream.pipe(fs.createWriteStream('/dev/null'));
        });
        
        it('should fail', function(done){
            var req = new Request({ url: 'https://domainnotfound.yu/' });
            var stream = req.stream();
            stream.on('error', function(err) {
                done();  
            });
            
            stream.on('end', function(data) {
                done('It should fail');
            });
            
            stream.pipe(fs.createWriteStream('/dev/null'));
        });
    });
});
        