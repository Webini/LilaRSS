"use strict";

var App            = require('../app.js');
var ErrorFormatter = App.services.ErrorFormatter; 
var UserService    = App.services.User;
var AuthService    = App.services.Authenticator;

function generateToken(data, renew){
    data.expires  = new Date((new Date()).getTime() + AuthService.validityTime * 1000);
        
    if(renew){
        data.renewKey = AuthService.generateRenewKey();
        data.token    = AuthService.createRenewableToken(data, data.renewKey);
    }
    else{
        data.token = AuthService.createToken(data);
    }
    
    return data;
};

module.exports = {
    renew: function(req, res){
        if(!req.body || !req.body.token || !req.body.renewKey){
            return res.status(500)
                      .json(ErrorFormatter.format({ translationKey: 'INVALID_PARAMETERS' }));
        }
        
        AuthService.canRenewToken(req.body.token, req.body.renewKey).then(
            function(decoded){
                return UserService.getOneById(decoded.id);
            }
        ).then(
            function(user){
                res.json(generateToken(user.public, true));      
            },
            function(){
                res.status(500).end();
            }
        );
    },
    
    login: function(req, res){
        if(!req.body || !req.body.email || !req.body.password){
            return res.status(500)
                      .json(ErrorFormatter.format({ translationKey: 'INVALID_PARAMETERS' }));
        }
        
        var renewable = (req.body.remember === true);
        UserService.login(req.body.email, req.body.password).then(
            function(user){
                return generateToken(user.public, renewable);
            }
        ).then(
            function(data){
                res.json(data);
            },
            function(err){
                res.status(500)
                   .json(ErrorFormatter.format(err));
            }
        )
    }
};