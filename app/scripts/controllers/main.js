'use strict';

angular.module('socketIoTwitterApp')
  .controller('MainCtrl', function ($scope, $http) {
    var socket = io();
    $scope.tweets = [];
    socket.on('tweet', function(data){
      if(data && data.user.name && data.user.location){
        $scope.tweets.push(data);
        $scope.$apply();
      }
    })
  });
