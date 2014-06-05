'use strict';

angular.module('socketIoTwitterApp')
  .controller('MainCtrl', function ($scope, $http) {
    var socket = io();
    $scope.tweets = [];
    socket.on('tweet', function(data){
      $scope.tweets.push(data.text);
      $scope.$apply()
    })

    console.log($scope.tweets);
    console.log($scope.tweets.length);


    $scope.test2 = [undefined, {},{},{},4,5]
    $scope.test = "Hello";


  });
