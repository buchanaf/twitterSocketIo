'use strict';

var twit = require('./socket.js').twit;

exports.findfollowers = function(req, res){
  twit.get("https://api.twitter.com/1.1/followers/list.json", {screen_name:req.query.user_name}, function(error, data) {
      // res.send(data.users);
  })
}