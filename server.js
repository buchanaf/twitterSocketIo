'use strict';

var express = require('express'),
    path = require('path'),
    fs = require('fs'),
    mongoose = require('mongoose'),
    socket = require('./lib/controllers/socket').startStream,
    TwitterStrategy = require('passport-twitter').Strategy,
    passport = require('passport');



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

var socketConnect = new socket(server);
// // Connect Socket


//configure passport for twitter
// passport.use(new TwitterStrategy({
//       consumerKey: 'Gxeq7uwK24Wwge8dWP1AeUsMP',
//       consumerSecret: 'IcnCGchu3xT6RQPxpz2WJdIqeSiFVA98WOQIsVQzcGm9GAgbYM',
//       callbackURL: 'http://127.0.0.1:9000/auth/twitter/callback'
//   },
//   function(token, tokenSecret, profile, done) {
//      process.nextTick(function() {

//         // find the user in the database based on their facebook id
//         User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

//             // if there is an error, stop everything and return that
//             // ie an error connecting to the database
//             if (err)
//                 return done(err);
//             // if the user is found, then log them in
//             if (user) {
//                 return done(null, user); // user found, return that user
//             } else {
//                 // if there is no user found with that facebook id, create them
//                 var newUser = new User();

//                 // set all of the facebook information in our user model
//                 newUser.twitter.id    = profile.id; // set the users facebook id
//                 newUser.twitter.token = token; // we will save the token that facebook provides to the user
//                 newUser.twitter.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
//                 newUser.twitter.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

//                 // save our user to the database
//                 newUser.save(function(err) {
//                     if (err)
//                         throw err;

//                     // if successful, return the new user
//                     return done(null, newUser);
//                 });
//             }

//         });
//     });
//   }
// ));
// twitterlogin();



// Expose app
exports = module.exports = app;
