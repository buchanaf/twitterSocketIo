'use strict';

var io = require("socket.io"),
    twitter = require('ntwitter');

function StartStream(server){
  var socket = io(server);


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

  socket.on("connection", function(userSocket){
    userSocket.on('tweet-start', function(phrase){
      console.log("User connected!");
      twit.stream('user', {track: phrase}, function(stream) {
        stream.on('data', function (data) {
          userSocket.emit('tweet', data);
          console.log(data);
        });
      setTimeout(stream.destroy, 20000);
      });
    });
    userSocket.on('tweet-end', function(){
          stream.stop();
    })
  });






  this.destroy = function(){
    stream.destroy
  }

}

exports.startStream = StartStream