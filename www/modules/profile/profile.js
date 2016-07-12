angular.module('thermostat.profile', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/profile/profile.html',
                        controller: 'profileCtrl'
                    }
                }
            })

    }])
    .controller('profileCtrl', ['$scope','$state', function($scope,$state ) {

        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };

    }])
