'use strict';

angular.module('socketIoTwitterApp')
  .controller('MainCtrl', function ($scope, $http) {
    var socket = io();
    $scope.tweets = [];


    socket.on('tweet', function(data){
      if(data  && data.user.name && data.user.location){
        $scope.tweets.push(data);
        $scope.$apply();
      }
    })



    $scope.getTweets = function (phrase) {
      $scope.phrase = phrase;
      socket.emit('tweet-start', $scope.phrase);
    };

    $scope.endTweets = function (phrase) {
      socket.emit('tweet-end');
    };

  });
