'use strict';

angular.module('socketIoTwitterApp')
  .controller('MainCtrl', function ($scope, $http, Session, $rootScope) {
    var socket = io();
    $scope.tweets = [];
    $scope.hashtags = [];
    $scope.streaming = true;
    $scope.success = false;
    $scope.retweetResult = "Tweet Success";

    socket.emit('tweet-end');

    Session.get({}, function(data){
      $rootScope.currentUser = data;
      $http({
        method: 'GET',
        url: '/api/followers',
        params: {user_name: $rootScope.currentUser.name}
      })
      .success(function(data){
        $scope.followers = data;
      });
    })

    socket.on('tweet', function(data){
      if(data.tweeter && data.tweeter.user.name && data.tweeter.user.location){

        if($scope.tweets.length>=3){
          return
        }


        $scope.tweets.unshift(data.tweeter);
        $scope.$apply();

        setTimeout(function(){
            $scope.tweets.pop();
            $scope.$apply();
        }, 10000);
      }
    })

    socket.on('hashtags', function(data){
      $scope.hashtags = data.hashtags
      $scope.hashtags = $scope.hashtags.slice(0,5)
      $scope.$apply()
    })

    $scope.getTweets = function (phrase) {
      socket.emit('tweet-start', phrase);
      $scope.streaming = false;
      $scope.phrase = "";
      $scope.$apply();
    };

    $scope.endTweets = function () {
      socket.emit('tweet-end')
      $scope.streaming = true;
      $scope.$apply();
    };

    $scope.retweet = function(id){
      $http({
          method: 'post',
          url: '/api/followers',
          params: {id: id}
        })
        .success(function(data){
          $scope.success = true;
          $scope.$apply();
      });
    }

  });
