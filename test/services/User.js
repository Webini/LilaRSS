var UserService               = App.services.User;
var $q                        = require('q');

const UserNotFoundException   = require(__dirname + '/../../exceptions/UserNotFoundException.js');
const CredentialsException    = require(__dirname + '/../../exceptions/LoginException.js');

describe('services.User', function(){
    
    describe('#create()', function(){
        it('should not throw errors', function(){
            return UserService.create({
                email: 'test@test.fr',
                username: 'test',
                passwordText: 'abcdefgh'
            }).then(function(user){
                return user.destroy();  
            });
        });
        
        it('should not create user', function(){
            return UserService.create({
                email: 'ThisIsNotAnEmail',
                username: 'test',
                passwordText: 'too' //short
            }).then(
                function(user){
                    user.destroy();
                    assert(false, 'User should not be created');
                },
                function(err){
                    var it = 0;
                    for(var i = 0; err.errors &&  i < err.errors.length; i++){
                        if(err.errors[i].path == 'email' || err.errors[i].path == 'passwordText'){
                            it++;
                        }
                    }
                    
                    if(it === 2){
                        return $q.resolve();       
                    }
                    
                    assert(false, 'Missing validation errors');
                }
            );
        });
    });
    
    describe('#removeOne()', function(){
        it('should remove user with his ID', function(){
            return UserService.create({
                email: 'test@test.fr',
                username: 'test',
                passwordText: 'abcdefgh'
            }).then(function(user){
                return UserService.removeOne(user.id); 
            });
        });
        
        it('should remove user with his instance', function(){
            return UserService.create({
                email: 'test@test.fr',
                username: 'test',
                passwordText: 'abcdefgh'
            }).then(function(user){
                return UserService.removeOne(user); 
            });
        }) 
    });
    
    describe('#login()', function(){

        it('should not found user', function(){
            return UserService.login('notfound@test.fr', 'yolo').then(
                function success(user){
                    assert(false, 'User should not be logged');   
                },
                function(err){
                    if(err instanceof UserNotFoundException){
                        return $q.resolve();
                    }
                    else{ 
                        throw err;
                    }
                }
            );
        });   
        
        it('should not log user', function(){
            return UserService.create({
                email: 'test_login@test.fr',
                username: 'test',
                passwordText: 'abcdefgh'
            }).then(function(user){ 
                return UserService.login('test_login@test.fr', 'yolo').then(
                    function success(user){
                        user.destroy();
                        assert(false, 'User should not be logged');   
                    },
                    function(err){
                        user.destroy();
                        if(err instanceof CredentialsException){
                            return $q.resolve();
                        }
                        else{ 
                            throw err;
                        }
                    }
                );
            });
        }); 
        
        it('should log user', function(){
            return UserService.create({
                email: 'test_login@test.fr',
                username: 'test',
                passwordText: 'abcdefgh'
            }).then(function(user){ 
                return UserService.login('test_login@test.fr', 'abcdefgh').then(
                    function(){
                        return user.destroy();   
                    },
                    function(e){
                        user.destroy();
                        throw e;
                    }
                );
            });
        });   
    });
    
});