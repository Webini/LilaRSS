"use strict";

var fs        = require("fs");
var path      = require("path");
var basename  = path.basename(module.filename);
var ctrls     = {};

ctrls['ready'] = function(){
    fs.readdirSync(__dirname)
      .filter(function(file) {
          return (file.indexOf(".") !== 0) && (file !== basename);
      })
      .forEach(function(file) {
          var name = path.basename(file, '.js');
          var ctrl = require(path.join(__dirname, file));
          ctrls[name] = ctrl;
      });
};

module.exports = ctrls;