"use strict";

const jwt           = require("jsonwebtoken");
const $q            = require('q');
const crypto        = require('crypto');
const _             = require('underscore');
var   App           = null;

class Authenticator {
    /**
     * Once app is ready, we can retreive it
     */
    ready(){
        App = require(__dirname + '/../app.js');
        this.config = App.config.jsonwebtoken;
    }
    
    /**
     * Create a new token with custom data
     * @param object data
     * @param string renewKey specific renew key, generated with #generateRenewKey()
     * @return string token
     */
    createToken(data, renewKey){
        if(!renewKey){
            renewKey = this.generateRenewKey();
        }
        
        return jwt.sign(
            _.extend({ __renew_key: renewKey }, data), 
            this.config.secret, 
            { expiresIn: this.config.expiresIn }
        );
    }
    
    /**
     * Generate a renew key 
     * @return string
     */
    generateRenewKey(){
        var seed = this.config.renewSecret + (Math.random() * (new Date()).getTime()).toString() + (new Date()).getTime().toString();
        var hash = crypto.createHash('sha512');
        
        hash.update(seed);
        
        for(var i = 0; i < 10; i++){
            var nhash = crypto.createHash('sha512');
            nhash.update(hash.digest('hex'));
            hash = nhash;
        }
        
        return hash.digest('hex').toString();
    }
    
    /**
     * Check if we can renew the token and if it's ok return the old token decoded
     * @return promise
     */
    canRenewToken(oldToken, renewKey){
        var defer = $q.defer();
        
        jwt.verify(oldToken, this.config.secret, {}, function(err, decoded){
            if(err){
                decoded = jwt.decode(oldToken)
                
                if(err.name !== 'TokenExpiredError'){
                    defer.reject(err);
                }
            }
            
            if(decoded.__renew_key === renewKey){
                defer.resolve(decoded)
            }
            else{
                defer.reject({
                    name: 'InvalidRenewKey',
                    message: 'The renew key is invalid'
                });
            }
        });  
        
        return defer.promise;
    }
    
    /**
     * Verify token validity
     * @return promise
     */
    verifyToken(token){
        var defer = $q.defer();
        
        jwt.verify(token, this.config.secret, {}, function(err, decoded){
            if(err){
                defer.reject(err);
                return;
            }
            
            defer.resolve(decoded);
        });  
        
        return defer.promise;
    }
}


module.exports = [ 'Authenticator', new Authenticator() ];