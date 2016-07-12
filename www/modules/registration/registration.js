angular.module('thermostat.registration', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'modules/registration/registration.html',
                controller: 'registerCtrl'
            })
    }])
    .controller('registerCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.openLogin = function() {
            $state.go('login');
        };

    }]);
