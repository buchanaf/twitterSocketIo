'use strict';

angular.module('socketIoTwitterApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
