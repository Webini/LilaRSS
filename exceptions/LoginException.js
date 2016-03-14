"use strict";
module.exports = class LoginException extends Error {
    get translationKey(){
       return 'LOGIN_ERROR';
    }
}