"use strict";

var App            = require('../app.js');
var ErrorFormatter = App.services.ErrorFormatter; 
var UserService    = App.services.User;
var AuthService    = App.services.Authenticator;

module.exports = {
    create: function(req, res){
        if(!req.body || !req.body.username || !req.body.email || !req.body.passwordText){
            return res.status(500)
                      .json(ErrorFormatter.format({ translationKey: 'INVALID_PARAMETERS' }));
        }
        
        UserService.create(req.body).then(
            function(user){
                res.json(user.public);
            },
            function(error){
                res.status(500)
                   .json(ErrorFormatter.format(error));
            }
        );
    }
};