var AuthService = App.services.Authenticator;
var $q          = require('q');

describe('services.Authenticator', function(){
    var data = {
        id: 42
    };
    
    describe('#generateRenewKey()', function(){
        it('should not be empty', function(){
            var key = AuthService.generateRenewKey();
            assert.ok(typeof key === 'string' && key.length > 0);
        });
    });
    
    describe('#createToken()', function(){
        it('should not be empty', function(){
            var token = AuthService.createToken(data);
            assert.ok(typeof token === 'string' && token.length > 0);  
        });
    });
    
    describe('#verifyToken()', function(){
        it('should be valid', function(){
            var renewKey = AuthService.generateRenewKey();
            var token    = AuthService.createToken(data, renewKey);
            
            return AuthService.verifyToken(token).then(
                function success(decoded){
                    assert.ok(typeof decoded === 'object');
                    assert.equal(decoded.id, data.id, 'Check decoded token');
                    assert.equal(decoded.__renew_key, renewKey, 'Check decoded renew key');
                }
            );
        });
        
        it('should be invalid', function(done){
            var token = AuthService.createToken(data);
             
            setTimeout(function(){
                AuthService.verifyToken(token).then(
                    function success(decoded){
                        assert(false, 'Token should be invalid');
                    },
                    function(err){
                        assert.equal(err.name, 'TokenExpiredError');
                    }
                )
                .then(function(){ done(); }, done);
            }, App.config.jsonwebtoken.expiresIn * 1000);
        });
    });
    
    describe('#canRenewToken', function(){
        it('should be valid', function(){
            var renewKey = AuthService.generateRenewKey();
            var token    = AuthService.createToken(data, renewKey);
            
            return AuthService.canRenewToken(token, renewKey);
        });
        
        it('should be valid after token expiration', function(done){
            var renewKey = AuthService.generateRenewKey();
            var token    = AuthService.createToken(data, renewKey);
            
            setTimeout(function(){
                AuthService.canRenewToken(token, renewKey).then(
                    function(){ done(); },
                    function(err){ done(err); }
                );
            }, App.config.jsonwebtoken.expiresIn * 1000);
        });
        
        it('should be invalid', function(){
            var randomKey = AuthService.generateRenewKey();
            var token     = AuthService.createToken(data);
            
            return AuthService.canRenewToken(token, randomKey).then(
                function(){
                    assert(false, 'Renew key should throw an error');   
                },
                function(){
                    return $q.resolve();
                }
            );
        });
        
    });
    
});