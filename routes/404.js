const App         = require(__dirname + '/../app.js');
const router      = App.router;
const Controllers = App.controllers;
const Middlewares = App.middlewares;

module.exports = function(){
    router.get('*', function(req, res){
        res.sendFile('index.html', { root: App.config.http.static });
    });
};