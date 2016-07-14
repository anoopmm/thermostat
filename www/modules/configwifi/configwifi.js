angular.module('thermostat.configwifi', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.configwifi', {
                url: '/configwifi',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/configwifi/configwifi.html',
                        controller: 'configWifiCtrl'
                    }
                }
            })

    }])
    .controller('configWifiCtrl', ['$scope', '$state', 'thermostatFactory', '$ionicPopup', function($scope, $state, thermostatFactory, $ionicPopup) {

        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };
        $scope.configData = {
            uname: '',
            pwd: ''
        };
        $scope.config = function() {
            console.log('get request');
            console.log($scope.configData);
            thermostatFactory.connectWifi($scope.configData1).then(function(responce) {
                console.log('responce', responce);
                var alertPopup = $ionicPopup.alert({
                    title: 'Wifi Credentials sent to device!!',
                    template: 'Please connect your phone to internet!'
                });
            });

        };

    }])
