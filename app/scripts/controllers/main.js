'use strict';

angular.module('socketIoTwitterApp')
  .controller('MainCtrl', function ($scope, $http) {
    var socket = io();
    $scope.tweets = [];

    socket.on('tweet', function(data){
      if(data && data.user.name && data.user.location){
        if($scope.tweets.length>=4){
          return
        }
        $scope.tweets.unshift(data);
        $scope.$apply();
        setTimeout(function(){
          $scope.tweets.pop();
          console.log("POPPING")
        }, 10000);
      }
    })

    $scope.getTweets = function (phrase) {
      $scope.phrase = phrase;
      socket.emit('tweet-start', $scope.phrase);
    };

    $scope.endTweets = function () {
      socket.emit('tweet-end')
    };

  });
