'use strict';

var io = require("socket.io"),
    twitter = require('ntwitter'),
    Instagram = require('instagram-node-lib');;

  // Set-up Twitter API
var twit = new twitter({
    consumer_key: 'Gxeq7uwK24Wwge8dWP1AeUsMP',
    consumer_secret: 'IcnCGchu3xT6RQPxpz2WJdIqeSiFVA98WOQIsVQzcGm9GAgbYM',
    access_token_key: '393816224-SsseqHVG8Q21NNxqvScxQMo2OzboI5KrEWxVtZwX',
    access_token_secret: 'Hrkhk4kyE8m8gySyRXbLHXzI3jVrepV0LfCxfv8gx0DFm'
});

var clientID = '60aab4799550415a9d28233fbfa5e74a',
    clientSecret = '4336c4b5ce5a48bb92e605fcc1c66c99';


Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);
Instagram.set('callback_url', 'http://localhost:9000/');
Instagram.set('redirect_uri', 'http://localhost:9000/');
Instagram.set('maxSockets', 10);

Instagram.subscriptions.subscribe({
  object: 'tag',
  object_id: 'nyc',
  aspect: 'media',
  callback_url: 'http://localhost:9000/',
  type: 'subscription',
  id: '102020202'
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
      userSocket.hashtags = {};
      Instagram.tags.recent({
        name: 'NYC',
        complete: function(data) {
          console.log(data)
        }
      })


      twit.stream('user', {track: phrase}, function(stream) {
        stream.on('data', function (data) {
        var hashTagArray = [];
        var sortedArray = [];


        if (data.entities){
          hashTagArray = data.entities.hashtags;
        }

        for(var i=0; i<hashTagArray.length; i++){
          if(userSocket.hashtags.hasOwnProperty(hashTagArray[i].text)){
            userSocket.hashtags[hashTagArray[i].text] +=1;
          } else if(Object.keys(userSocket.hashtags).length < 10) {
            userSocket.hashtags[hashTagArray[i].text] =1;
          }
        }

        for (var keyword in userSocket.hashtags){
          sortedArray.push({name:keyword, val: userSocket.hashtags[keyword]});
        }

        sortedArray = sortedArray.sort(function(a,b) {
          return b.val - a.val;
        });



      console.log(userSocket.counter)


        userSocket.tweets.push(data);
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
  });
}

exports.startStream = StartStream;
exports.twit = twit;
