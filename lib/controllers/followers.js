'use strict';

var twitter = require('ntwitter');

exports.retweet = function(req, res){
  var twit = new twitter({
      consumer_key: 'Gxeq7uwK24Wwge8dWP1AeUsMP',
      consumer_secret: 'IcnCGchu3xT6RQPxpz2WJdIqeSiFVA98WOQIsVQzcGm9GAgbYM',
      access_token_key: req.user.twitter.token,
      access_token_secret: req.user.twitter.tokensecret
  });

  twit.post('https://api.twitter.com/1.1/statuses/retweet/'+req.query.id+'.json',  function (error, data){
    res.json(data)
  });
}