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
    .controller('configWifiCtrl', ['$scope', '$state', 'thermostatFactory', '$ionicPopup', 'userProductFactory', function($scope, $state, thermostatFactory, $ionicPopup, userProductFactory) {
        if(window.localStorage.getItem('userdetails')){
            var userdetails=JSON.parse(window.localStorage.getItem('userdetails'));
        }

        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };
        $scope.configData = {};
        $scope.config = function() {
            console.log('get request');
            console.log($scope.configData);
            allocateProduct();
            // thermostatFactory.connectWifi($scope.configData1).then(function(responce) {
            //     console.log('responce', responce);
            //     var alertPopup = $ionicPopup.alert({
            //         title: 'Wifi Credentials sent to device!!',
            //         template: 'Please connect your phone to internet!'
            //     });
            // });

        };

        function allocateProduct() { 
            var data={
                userId:userdetails.userId,
                productId:$scope.configData.product_id
            };
            userProductFactory.assignProduct(data).then(function(res) {



            }).catch(function(error) {
                console.log('error', error);


            });
        };

    }])
