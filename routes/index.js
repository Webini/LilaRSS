"use strict";

var fs        = require("fs");
var path      = require("path");
var basename  = path.basename(module.filename);
var routes    = {};

var errRoutes = [];
var errReg    = /^[0-9]{3}$/;

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== basename);
  })
  .forEach(function(file) {
    var name = path.basename(file, '.js');
    var route = require(path.join(__dirname, file));
    if(errReg.test(name)){
        errRoutes[name] = route;
    }    
    else{
        routes[name] = new route();
    }
  });
  
for(var name in errRoutes){
    routes[name] = new errRoutes[name]();   
}

module.exports = routes;