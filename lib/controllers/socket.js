'use strict';

var io = require("socket.io"),
    twitter = require('ntwitter')



  // Set-up Twitter API
var twit = new twitter({
    consumer_key: 'Gxeq7uwK24Wwge8dWP1AeUsMP',
    consumer_secret: 'IcnCGchu3xT6RQPxpz2WJdIqeSiFVA98WOQIsVQzcGm9GAgbYM',
    access_token_key: '393816224-SsseqHVG8Q21NNxqvScxQMo2OzboI5KrEWxVtZwX',
    access_token_secret: 'Hrkhk4kyE8m8gySyRXbLHXzI3jVrepV0LfCxfv8gx0DFm'
});

var clientID = '60aab4799550415a9d28233fbfa5e74a',
    clientSecret = '4336c4b5ce5a48bb92e605fcc1c66c99';

twit.verifyCredentials(function (err, data) {
      if (err) {
        console.log("Error verifying credentials: " + err);
      } else {
        console.log('Verified Credentials:' + data)
      }
});

module.exports.respond = function(socket) {


  var hashtagProcessor = function (data, hash){
    var hashtags = hash;
    var hashTagArray = data.entities.hashtags;

    for(var i=0; i<hashTagArray.length; i++){
      if(hashtags.hasOwnProperty(hashTagArray[i].text)){
        hashtags[hashTagArray[i].text] +=1;
      } else if(Object.keys(hashtags).length < 40) {
        hashtags[hashTagArray[i].text] =1;
      }
    }


    return hashtags
  }

  var sorter = function(hash){
    var hashtags = hash;
    var sortedArray = [];

    for (var keyword in hashtags){
      sortedArray.push({name:keyword, val: hashtags[keyword]});
    }

    sortedArray = sortedArray.sort(function(a,b) {
      return b.val - a.val;
    });
    return sortedArray;
  }

  //on the click of the tweet start button, initiate the variables and begin processing the data
  //validate the data through the above functions and emit the processed information to the front end
  socket.on('tweet-start', function(phrase){
    var tweets = [];
    var hashtags = {};

    twit.stream('user', {track: phrase}, function(stream) {
      stream.on('data', function (data) {
        //push tweet data into an array
        tweets.push(data);

        //if the tweet has hashtags, process them using the functions below
        if (data.entities){
          var countedTags = hashtagProcessor(data, hashtags);
          var sortedArray = sorter(countedTags);
        }

        //if the tweet has a geolocation, emit a geolocation to the D3 visualization
        if(data.geo != undefined && data.geo.coordinates != undefined){
          console.log(data.geo.coordinates)
          socket.emit('geolocation', data.geo.coordinates)
        }

        //set an interval to emit the first index of the tweet array to the front end (slows down tweets)
        var emitInterval = setInterval(function() {
          socket.emit('tweet', {tweeter: tweets[0]});
          tweets = [];
        }, 1000);

        //emit the sorted hashtags to the front end
        socket.emit('hashtags', {hashtags: sortedArray})

        //when the user turns the stream off, clear the interval and destroy the current stream.
        //set the hash tag tracker back to zero
        socket.on('tweet-end', function(){
            hashtags = {};
            clearInterval(emitInterval);
            stream.destroy();
        });
      });
    });
  });

}
