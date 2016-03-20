"use strict";

const UserNotFoundException     = require(__dirname + '/../exceptions/UserNotFoundException.js');
const CredentialsException      = require(__dirname + '/../exceptions/CredentialsException.js');

const $q                        = require('q');

var   App                       = null;
var   CryptoService             = null;
var   UserModel                 = null;

class User {
    ready(){
        App           = require(__dirname + '/../app.js');
        CryptoService = App.services.Crypto;
        UserModel     = App.orm.User;
    }
    
    /**
     * Try to log user 
     * @param string email
     * @param string password
     * @return promise if error return string 'InvalidUserPassword', or 'UserNotFound'
     */
    login(email, password){
         return UserModel.findOne({ where: { email: email }}).then(
            function(user){
                if(user === null){
                    throw new UserNotFoundException();
                }
                
                var passHash = CryptoService.hashPassword(password, user.salt);
                if(passHash !== user.password){
                    throw new CredentialsException();
                }
                
                return user;
            }
        );
    }
    
    /**
     * Try to get an user with hist id
     * @param {integer} id
     * @çeturn {promise}
     */
    getOneById(id){
        return UserModel.findOne({ where: { id: id }}).then(
            function(user){
                if(user === null){
                    throw new UserNotFoundException();
                }
                return user;
            }
        )
    }
    
    /**
     * Create a new user
     * @param object data { email: userEmail, username: string, password: userPassword }
     */
    create(data){
        var salt = CryptoService.random(64);
        var password = CryptoService.hashPassword(data.passwordText, salt);
        
        return UserModel.create({
            email: data.email,
            passwordText: data.passwordText,
            username: data.username,
            password: password,
            salt: salt,
            roles: this.ROLES.USER
        });
    }
    
    /**
     * Delete an user
     * @param mixed user Can be either int or sequelize instance
     * @return promise
     */
    removeOne(user){
        if(typeof user === 'object'){
            return user.destroy();
        }
        
        return UserModel.destroy({ where: { id: user } });
    }
    
    /**
     * Retreive user roles
     */
    get ROLES(){
        return {
            USER: 1  
        };
    }
};

module.exports = new User();