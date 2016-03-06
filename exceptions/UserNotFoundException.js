"use strict";
const LoginException = require('./LoginException');
module.exports = class UserNotFoundException extends LoginException {}