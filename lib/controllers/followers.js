'use strict';

var twit = require('./socket.js').twit;

exports.findfollowers = function(req, res){
  twit.get("https://api.twitter.com/1.1/followers/list.json", {screen_name: req.user.twitter.username }, function(error, data) {
    if (error){
      console.log(error)
    } else {
      res.json(data.users)
    }
  })
}

exports.retweet = function(req, res){
  twit.post('https://api.twitter.com/1.1/statuses/retweet/241259202004267009.json', {id: 12345445423 }, function (error, data){
    console.log(data)
  });
}