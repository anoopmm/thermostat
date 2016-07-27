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
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
        }

        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };
        $scope.configData = {};
        $scope.config = function() {
            console.log('get request');
            console.log($scope.configData);
            configureProduct();

        };
        thermostatFactory.checkWifi().then(function(res) {
            console.log('thermostat data', res.data);
          $scope.configData.product_id = res.data.ThermostatID;
          $scope.configData.groupId = res.data.Groupname;
          }).catch(function(error) {
              var alertPopup = $ionicPopup.alert({
                  title: 'Please connect to device wi-fi',
                  buttons: [{
                      text: 'OK',
                      type: 'button-assertive'
                  }]
              });
              alertPopup.then(function() {});

          });






        function assignProduct() {

            userProductFactory.assignProduct(data).then(function(res) {



            }).catch(function(error) {
                console.log('error', error);


            });
        }







        function configureProduct() {
            var data = {
                userId: userdetails.userId,
                productId: $scope.configData.product_id
            };

            thermostatFactory.connectWifi($scope.configData).then(function(res) {
                console.log('thermostat data', res.data);
                //$scope.configData.product_id = res.data.ThermostatID;

               var  alertPopup = $ionicPopup.alert({
                    title: 'Your device successfully configured',
                    template: 'Please connect to internet',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {

                    assignProduct();


                });


            });

        };

    }])
