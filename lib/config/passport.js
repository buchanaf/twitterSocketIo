'use strict';

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;

/**
 * Passport configuration
 */
passport.serializeUser(function(user, done) {
  console.log("Serializing user:" + user.id)
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    done(err, user);
  });
});

// add other strategies for more authentication flexibility
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password' // this is the virtual field on the model
  },
  function(email, password, done) {
    User.findOne({
      email: email.toLowerCase()
    }, function(err, user) {
      if (err) return done(err);

      if (!user) {
        return done(null, false, {
          message: 'This email is not registered.'
        });
      }
      if (!user.authenticate(password)) {
        return done(null, false, {
          message: 'This password is not correct.'
        });
      }
      return done(null, user);
    });
  }
));

 passport.use(new TwitterStrategy({
      consumerKey: 'Gxeq7uwK24Wwge8dWP1AeUsMP',
      consumerSecret: 'IcnCGchu3xT6RQPxpz2WJdIqeSiFVA98WOQIsVQzcGm9GAgbYM',
      callbackURL: 'http://localhost:9000/auth/twitter/callback'
  },
  function(token, tokenSecret, profile, done) {
     process.nextTick(function() {
        // find the user in the database based on their facebook id
        User.findOne({ 'twitter.id' : profile.id }, function(err, user) {

            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);
            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                // if there is no user found with that facebook id, create them
                var newUser = new User();
                console.log(token)
                // set all of the facebook information in our user model
                newUser.twitter.id = profile.id; // set the users facebook id
                newUser.twitter.tokensecret = tokenSecret;
                newUser.twitter.token = token; // we will save the token that facebook provides to the user
                newUser.twitter.name  = profile.displayName; // look at the passport user profile to see how names are returned
                newUser.twitter.username = profile.username;
                // newUser.twitter.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                newUser.provider =  profile.provider;

                // save our user to the database
                newUser.save(function(err) {
                    if (err)
                        throw err;

                    // if successful, return the new user
                    return done(null, newUser);
                });
            }

        });
    });
  }
));

module.exports = passport;

