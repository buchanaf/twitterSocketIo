'use strict';

angular.module('socketIoTwitterApp')
  .controller('MainCtrl', function ($scope, $http, Session, $rootScope, Socket) {


    //set up scope variables for hide/show
    $scope.tweets = [];
    $scope.hashtags = [];
    $scope.pictures = [];
    $scope.streaming = true;
    $scope.success = false;
    $scope.retweetResult = "Tweet Success";
    $scope.phrase;
    var gramPics;

    //end any open socket connections
    Socket.emit('tweet-end');


    //get current session
    Session.get({}, function(data){
      $rootScope.currentUser = data;
     });

    Socket.on('tweet', function(data){
      //check to see if the tweet has user, name, and location AND there are not 4 tweets already being displayed on the scope


      if(data.tweeter && data.tweeter.user && data.tweeter.user.name && data.tweeter.user.location && $scope.tweets.length<4){

        //add tweet to scope
        $scope.tweets.unshift(data.tweeter);

        //set time out to remove tweet from scope so new ones can be included
        setTimeout(function(){
            $scope.tweets.pop();
        }, 10000);
      }
    })

    Socket.on('hashtags', function(data){
      $scope.hashtags = data.hashtags
      if($scope.hashtags){
        $scope.hashtags = $scope.hashtags.slice(0,20)
      }
    })

    $scope.getTweets = function (phrase) {
      Socket.emit('tweet-start', phrase);
      gramPics = setInterval(function(){
        $scope.pictures =[];
        $http({
          method: 'GET',
          url:'/api/instagram',
          params: {phrase:phrase}}
        ).success(function(data){
          $scope.pictures = data.image
        })},
      10000);

      $scope.streaming = false;
      $scope.phrase = "";
      $scope.currentTerm = phrase;
    };

    $scope.endTweets = function () {
      Socket.emit('tweet-end')
      $scope.streaming = true;
      $scope.searchterm.searchphrase.$setPristine();
      clearInterval(gramPics);
    };

    $scope.retweet = function (id) {
      $http.post('/api/followers', {id: id})
        .success(function(data) {
          $scope.success = true;
          $scope.$apply();
      });
    }

  });
