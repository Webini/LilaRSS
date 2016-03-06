"use strict";
const App = require('./app.js');

App.server.listen(App.config.http.port, App.config.http.host, function(){
    console.log("Listening on " + App.config.http.host + ":" + App.config.http.port);
});