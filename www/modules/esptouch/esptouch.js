angular.module('thermostat.esptouch', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.esptouch', {
                url: '/esptouch',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/esptouch/esptouch.html',
                        controller: 'esptouchCtrl'
                    }
                }
            })

    }])
    .controller('esptouchCtrl', ['$scope', '$state', 'thermostatFactory', '$ionicPopup', 'userProductFactory', '$ionicLoading', function($scope, $state, thermostatFactory, $ionicPopup, userProductFactory, $ionicLoading) {
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
        }
        $scope.data = {};
        $scope.data.response = 'responcerrrrrrrrrrr';
        $ionicLoading.show({
            template: 'Trying to connect...'
        });
        esptouchPlugin.smartConfig('SensomateSystems', 0, 'S3sypt1dTCy;', false, 1, function(res, res2, res3) {
            $ionicLoading.hide();
            console.log(res);
            alert(res);
            console.log(res2);
            alert(res2);
            console.log(res3);
            alert(res3);

        }, function(error) {

            console.log(error);

        });

    }]);
