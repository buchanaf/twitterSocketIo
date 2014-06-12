'use strict';


var twitter = require('ntwitter'),
    access_token = require('../config/passport.js').token,
    access_secret = require('../config/passport.js').tokenSecret;

  // Set-up Twitter API
var twit = new twitter({
    consumer_key: 'Gxeq7uwK24Wwge8dWP1AeUsMP',
    consumer_secret: 'IcnCGchu3xT6RQPxpz2WJdIqeSiFVA98WOQIsVQzcGm9GAgbYM',
    access_token_key: access_token,
    access_token_secret: access_secret
});

exports.retweet = function(req, res){
  twit.post('https://api.twitter.com/1.1/statuses/retweet/'+req.query.id+'.json',  function (error, data){
    res.json(data)
  });
}

exports.newphoto = function(req, res){
  console.log(req)
}