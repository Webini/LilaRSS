const App         = require(__dirname + '/../app.js');
const router      = App.router;
const Controllers = App.controllers;
const Middlewares = App.middlewares;

module.exports = function(){
    router.post('/auth/renew', Controllers.Auth.renew);
    router.post('/auth/login', Controllers.Auth.login);
};