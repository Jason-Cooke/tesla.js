// MODULE DEPENDENCIES
var express = require('express'),
    fs = require('fs'),
    env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
    mongoose = require('mongoose'),
    app = module.exports = express();

// REQUIRE CONFIG FILES
require('./config/config')(app);
require('./config/env-config')(app);

// BOOTSTRAP DB CONNECTION
var db = mongoose.connect(app.config.db.url);

// BOOTSTRAP MODELS
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);

// REQUIRE ADDITIONAL CONFIG FILES
require('./config/express')(app, db); //express settings
require('./config/routes')(app); // routes

// STAR THE APP BY LISTEN ON <PORT>
var port = process.env.PORT || config.port;
app.listen(port);
console.log('Express app started on port ' + port);

// EXPOSE APP
exports = module.exports = app;
