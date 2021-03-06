const App         = require(__dirname + '/../app.js');
const router      = App.router;
const Controllers = App.controllers;
const Middlewares = App.middlewares;

module.exports = function(){
    router.post('/user/create', Controllers.User.create);
};