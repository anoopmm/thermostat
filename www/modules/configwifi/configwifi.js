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

        $scope.configData = {};
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
        }
        if (window.localStorage.getItem('deviceDetails')) {
            var devicedetails = JSON.parse(window.localStorage.getItem('deviceDetails'));
            console.log('++++++++++++++++++++++++++++++++',devicedetails);
            $scope.configData.product_id = devicedetails.product_id;
            $scope.configData.groupId = devicedetails.groupId;
        }

        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };

        $scope.config = function() {
            console.log('get request');
            console.log($scope.configData);
            configureProduct();

        };

        function assignProduct() {
            var data = {
                userId: userdetails.userId,
                productId: $scope.configData.product_id
            };


            userProductFactory.assignProduct(data).then(function(res) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Your device successfully configured',
                    template: 'Please connect to internet',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {
                    $state.go('app.selectroom');

                });

            }).catch(function(error) {
                console.log('error', error);
                var alertPopup = $ionicPopup.alert({
                    title: 'Some error occcured',
                    template: 'Please reconfigure your device',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {

                });

            });
        }







        function configureProduct() {


            thermostatFactory.connectWifi($scope.configData).then(function(res) {
                console.log('thermostat data', res.data);
                //$scope.configData.product_id = res.data.ThermostatID;

                var alertPopup = $ionicPopup.alert({
                    title: 'Your device successfully configured',
                    template: 'Please connect to internet',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {

                    // assignProduct();
                    var data1 = {
                        status: true
                    };

                    localStorage.setItem('configure', JSON.stringify(data1));
                    $state.go('app.selectroom');
                    
                });


            }).catch(function(error) {
                console.log('error', error);
                var alertPopup = $ionicPopup.alert({
                    title: 'Some error occcured',
                    template: 'Please reconfigure your device',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {
                    $state.go('app.selectroom');

                });

            });

        };

        $scope.config = function() {
            configureProduct();
        }

    }])
