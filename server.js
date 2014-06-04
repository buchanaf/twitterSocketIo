'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    io = require("socket.io"),
    twitter = require('ntwitter');

/**
 * Main application file
 */

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./lib/config/config');
var db = mongoose.connect(config.mongo.uri, config.mongo.options);

// Bootstrap models
var modelsPath = path.join(__dirname, 'lib/models');
fs.readdirSync(modelsPath).forEach(function (file) {
  if (/(.*)\.(js$|coffee$)/.test(file)) {
    require(modelsPath + '/' + file);
  }
});

// Populate empty DB with sample data
require('./lib/config/dummydata');

// Passport Configuration
var passport = require('./lib/config/passport');

// Setup Express
var app = express();
require('./lib/config/express')(app);
require('./lib/routes')(app);

// Start server
var server =  app.listen(config.port, config.ip, function () {
  console.log('Express server listening on %s:%d, in %s mode', config.ip, config.port, app.get('env'));
});


// Connect Socket
var socket = io(server);

socket.on("connection", function(socket){
  console.log("User connected!");
});

// Set-up Twitter API
var twit = new twitter({
  consumer_key: 'Gxeq7uwK24Wwge8dWP1AeUsMP',
  consumer_secret: 'IcnCGchu3xT6RQPxpz2WJdIqeSiFVA98WOQIsVQzcGm9GAgbYM',
  access_token_key: '393816224-YbTb4Tmcd0FhpksnQeEIbhJA2AA7RWmluXxwxjRo',
  access_token_secret: 'tfTobxrznYlS6SRffj7y0QLiY2d1gIbDiM6lM7zKGNKzh'
});

twit
  .verifyCredentials(function (err, data) {
    if (err) {
      console.log("Error verifying credentials: " + err);
      process.exit(1);
    } else {
      console.log('Verified Credentials:' + data)
    }
  });

twit.stream('user', {track:'dog'}, function(stream) {
  stream.on('data', function (data) {
    console.log(data.text);
  });
  stream.on('end', function (response) {
    // Handle a disconnection
  });
  stream.on('destroy', function (response) {
    // Handle a 'silent' disconnection from Twitter, no end/error event fired
  });
  // Disconnect stream after five seconds
  setTimeout(stream.destroy, 20000);
});




// Expose app
exports = module.exports = app;
