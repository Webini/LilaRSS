"use strict";
const LoginException = require('./LoginException');
module.exports = class UserNotFoundException extends LoginException {
    get translationKey(){
       return 'USER_NOT_FOUND_ERROR';
    }
}