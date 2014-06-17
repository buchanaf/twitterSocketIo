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

var clientID = '60aab4799550415a9d28233fbfa5e74a',
    clientSecret = '4336c4b5ce5a48bb92e605fcc1c66c99';


var hashtagProcessor = function (data){
    var hashTagArray = [];
    var sortedArray = [];
    if (data.entities){
      hashTagArray = data.entities.hashtags;
    }

    for(var i=0; i<hashTagArray.length; i++){
      if(userSocket.hashtags.hasOwnProperty(hashTagArray[i].text)){
        userSocket.hashtags[hashTagArray[i].text] +=1;
      } else if(Object.keys(userSocket.hashtags).length < 40) {
        userSocket.hashtags[hashTagArray[i].text] =1;
      }
    }

    for (var keyword in userSocket.hashtags){
      sortedArray.push({name:keyword, val: userSocket.hashtags[keyword]});
    }

    sortedArray = sortedArray.sort(function(a,b) {
      return b.val - a.val;
    });
}


  twit.verifyCredentials(function (err, data) {
      if (err) {
        console.log("Error verifying credentials: " + err);
      } else {
        console.log('Verified Credentials:' + data)
      }
  });

  //on the socket connection to the server, wait for the input from the client
  socket.on('tweet-start', function(phrase){
    var tweets = [];
    var hashtags = {};

    twit.stream('user', {track: phrase}, function(stream) {
      stream.on('data', function (data) {

      tweets.push(data);
      if(data.geo != undefined && data.geo.coordinates != undefined){
        userSocket.emit('geolocation', data.geo.coordinates)
      }

      var emitInterval = setInterval(function() {
        userSocket.emit('tweet', {tweeter: userSocket.tweets[0]});
        userSocket.tweets = [];
      }, 1000);

      userSocket.emit('hashtags', {hashtags: sortedArray})
        userSocket.on('tweet-end', function(){
          userSocket.hashtags = {};
          clearInterval(emitInterval);
          stream.destroy();
        });
      });
    });
  });


exports.twit = twit;
