angular.module('thermostat.checkpassword', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.checkpassword', {
                url: '/checkpassword',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/checkpassword/checkpassword.html',
                        controller: 'checkpasswordCtrl'
                    }
                }
            })

    }])
    .controller('checkpasswordCtrl', ['$scope', '$state', 'thermostatFactory', '$ionicPopup', 'userProductFactory', '$ionicLoading', function($scope, $state, thermostatFactory, $ionicPopup, userProductFactory, $ionicLoading) {
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
        }
        $scope.setpassword = {};
        $scope.toggle = {};
        $scope.toggle.formStatus = false;
        $ionicLoading.show({
            template: 'Trying to connect...'
        });
        thermostatFactory.checkWifi().then(function(res) {
            console.log('thermostat data', res.data);
            $scope.setpassword.product_id = res.data.ThermostatID;
            $scope.setpassword.groupId = res.data.Groupname;
            localStorage.setItem('deviceDetails', JSON.stringify(res.data));
            $ionicLoading.hide();
        }).catch(function(error) {
            $ionicLoading.hide();

            var alertPopup = $ionicPopup.alert({
                title: 'Please connect to device wi-fi',
                buttons: [{
                    text: 'OK',
                    type: 'button-assertive'
                }]
            });
            alertPopup.then(function() {

                $state.go('app.selectroom');
            });

        });
        $scope.test = function() {
            // alert($scope.formStatus)
        }
        $scope.submit = function() {
            if ($scope.toggle.formStatus == true) {
                var data = {
                    old: $scope.setpassword.password_deafult,
                    new: $scope.setpassword.Password
                }
                $ionicLoading.show({
                    template: 'Loading...'
                });
                thermostatFactory.changePassword(data).then(function(res) {
                    $ionicLoading.hide();
                    $state.go('app.configwifi');
                }).catch(function(error) {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Please connect to device wi-fi',
                        buttons: [{
                            text: 'OK',
                            type: 'button-assertive'
                        }]
                    });
                    alertPopup.then(function() {
                        $state.go('app.selectroom');
                    });

                });

            } else {
                thermostatFactory.checkPassword($scope.setpassword.password_deafult).then(function(res) {

                    $state.go('app.configwifi');

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
            }



            //alert();
            // alert($scope.toggle.formStatus)
            // $state.go('app.configwifi');
        }

    }]);
