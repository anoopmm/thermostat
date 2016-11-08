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
        $scope.configData = {};
        if (window.cordova) {
            $ionicLoading.show({
                template: 'Trying to get WIFI info...'
            });
            WifiWizard.getCurrentSSID(function(res) {
                res = res.substring(0, res.length - 1);
                res = res.substring(1);
                $scope.configData.wifi_name = res;
                console.log('succees got wifi name', res);
                $ionicLoading.hide();



            }, function(res) {
                console.log('error', res);
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Failed to retrive WIFI data please ensure connected to WIFI or enter manually ',
                    template: 'Please connect to internet',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {});
            });

        }
        $scope.configData.wifi_password = 'S3sypt1dTCy;';
        $scope.submit = function() {
            // console.log($scope.configData.wifi_name);
            //console.log($scope.configData.wifi_password);
            $ionicLoading.show({
                template: 'Trying to connect with device...'
            });
            //get current device ip
            esptouchPlugin.smartConfig($scope.configData.wifi_name, 0, $scope.configData.wifi_password, false, 1, function(res) {
                    window.localStorage.setItem('currentip', res);
                    esptouchPlugin.cancelConfig(function(res) {});
                    $ionicLoading.hide();
                    $ionicLoading.show({
                        template: 'Getting device id...'
                    });
                    //communicate with device and get device id
                    thermostatFactory.getDeviceId(res).then(function(res1) {
                        window.localStorage.setItem('currentdeviceId', res1.data.Deviceid);
                        $ionicLoading.hide();
                        console.log('respoc from thermo', res1);
                        if (res1.data.Devicepasswordstatus == 'Yes') {
                            $state.go('app.createpassword', {
                                id: 1
                            });
                        } else {
                            $state.go('app.createpassword', {
                                id: 0
                            });

                        }
                    }).catch(function(res) {
                        $ionicLoading.hide();
                        esptouchPlugin.cancelConfig(function(res) {});
                        var alertPopup = $ionicPopup.alert({
                            title: 'No responce from device ',
                            template: 'Try to reconfigure device...',
                            buttons: [{
                                text: 'OK',
                                type: 'button-assertive'
                            }]
                        });
                        alertPopup.then(function() {});
                    });

                    console.log(res);

                },
                function(error) {
                    $ionicLoading.hide();
                    esptouchPlugin.cancelConfig(function(res) {});
                    var alertPopup = $ionicPopup.alert({
                        title: 'No responce from device ',
                        template: 'Please connect to internet',
                        buttons: [{
                            text: 'OK',
                            type: 'button-assertive'
                        }]
                    });
                    alertPopup.then(function() {});

                });
        }

    }]);
