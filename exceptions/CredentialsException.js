"use strict";
const LoginException = require('./LoginException');

module.exports = class CredentialsException extends LoginException {
    get translationKey(){
        return 'CREDENTIALS_ERROR';
    }
}