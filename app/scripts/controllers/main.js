'use strict';

angular.module('socketIoTwitterApp')
  .controller('MainCtrl', function ($scope, $http, Session, $rootScope) {
    var socket = io();
    $scope.tweets = [];
    $scope.streaming = true;
    socket.emit('tweet-end')

    Session.get({}, function(data){
      $rootScope.currentUser = data;
      $http({
        method: 'GET',
        url: '/api/followers',
        params: {user_name: $rootScope.currentUser.name}
      })
      .success(function(data){
        console.log(data);
        $scope.followers = data;
      });
    })

    socket.on('tweet', function(data){
      if(data && data.user.name && data.user.location){
        if($scope.tweets.length>=3){
          return
        }
        console.log(data)
        $scope.tweets.unshift(data);
        $scope.$apply();

        setTimeout(function(){
            $scope.tweets.pop();
            $scope.$apply();
        }, 10000);
      }
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

    $http({
        method: 'post',
        url: '/api/followers'
      })
      .success(function(data){
        console.log(data);
    });

  });
