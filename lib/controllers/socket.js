'use strict';

var io = require("socket.io"),
    twitter = require('ntwitter');

  // Set-up Twitter API
var twit = new twitter({
    consumer_key: 'Gxeq7uwK24Wwge8dWP1AeUsMP',
    consumer_secret: 'IcnCGchu3xT6RQPxpz2WJdIqeSiFVA98WOQIsVQzcGm9GAgbYM',
    access_token_key: '393816224-SsseqHVG8Q21NNxqvScxQMo2OzboI5KrEWxVtZwX',
    access_token_secret: 'Hrkhk4kyE8m8gySyRXbLHXzI3jVrepV0LfCxfv8gx0DFm'
});

function StartStream(server){
  var socket = io(server);


  twit
    .verifyCredentials(function (err, data) {
      if (err) {
        console.log("Error verifying credentials: " + err);
        // process.exit(1);
      } else {
        console.log('Verified Credentials:' + data)
      }
    });
  //on the socket connection to the server, wait for the input from the client



  socket.on("connection", function(userSocket){
    //when the client clicks start stream, pass the input string to the tracker
    userSocket.on('tweet-start', function(phrase){
      console.log("User connected!");
      userSocket.tweets = [];

      twit.stream('user', {track: phrase}, function(stream) {
        stream.on('data', function (data) {
          // console.log(data);
          userSocket.tweets.push(data);
          if(data.geo != undefined && data.geo.coordinates != undefined){
            userSocket.emit('geolocation', data.geo.coordinates)
          }
        });
        var emitInterval = setInterval(function() {
          console.log("Sending down tweets");
          userSocket.emit('tweet', userSocket.tweets[0]);
          userSocket.tweets = [];
        }, 1000);


        userSocket.on('tweet-end', function(){

          clearInterval(emitInterval);
          stream.destroy();
        });
      // setTimeout(stream.destroy, 20000);
      });
    });
  });
}

exports.startStream = StartStream;
exports.twit = twit;
