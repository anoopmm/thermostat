angular.module('thermostat.createpassword', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.createpassword', {
                url: '/createpassword/:id',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/createpassword/createpassword.html',
                        controller: 'createpasswordCtrl'
                    }
                }
            })

    }])
    .controller('createpasswordCtrl', ['$scope', '$state', 'thermostatFactory', '$ionicPopup', 'userProductFactory', '$ionicLoading', '$stateParams', function($scope, $state, thermostatFactory, $ionicPopup, userProductFactory, $ionicLoading, $stateParams) {
        $scope.showCreatePswd = true;
        $scope.configData = {};
        var ip = window.localStorage.getItem('currentip');
        $scope.configData.device_id = window.localStorage.getItem('currentdeviceId');
        if ($stateParams.id == 1) {
            $scope.showCreatePswd = false;
        } else {
            $scope.showCreatePswd = true;
        }
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
        }
        $scope.submit = function() {
            console.log($scope.configData)
            $ionicLoading.show({
                template: 'Configuring your device...'
            });
            if ($scope.showCreatePswd == true) {
                thermostatFactory.createNewPswd(ip, $scope.configData.device_id, $scope.configData.default_password, $scope.configData.new_password).then(function(res) {
                    $ionicLoading.hide();

                    if (res.data.Status == "Success") {
                        var data = {
                            product_id: res.data.Deviceid
                        }

                        localStorage.setItem('deviceDetails', JSON.stringify(data));
                        var data1 = {
                            status: true
                        };

                        localStorage.setItem('configure', JSON.stringify(data1));
                        var newDeviceDetails = {
                            "product_product_id": res.data.Deviceid,
                            "product": {
                                "product_id": res.data.Deviceid,
                                "password_changed": $scope.configData.new_password,
                                "values": {
                                    "mode": 0,
                                    "onoff": 1,
                                    "settemp": 0,
                                    "roomtemp": 0,
                                    "weeklyfri": "",
                                    "weeklymon": "",
                                    "weeklysat": "",
                                    "weeklytue": "",
                                    "weeklywed": "",
                                    "weeklythurs": ""
                                }
                            }
                        }
                        assignProduct();


                        if (window.localStorage.getItem('deviceConfiguredForUser')) {
                            var listfromlocal = JSON.parse(window.localStorage.getItem('deviceConfiguredForUser'));
                            listfromlocal.push(newDeviceDetails);
                            window.localStorage.setItem('deviceConfiguredForUser', JSON.stringify(listfromlocal));
                        }
                        $state.go('app.selectroom');
                    } else {
                        $state.go('app.selectroom');
                    }
                }).catch(function() {
                    $ionicLoading.hide();
                });
            } else {
                thermostatFactory.connectOldDevice(ip, $scope.configData.device_id, $scope.configData.old_password).then(function(res) {
                    $ionicLoading.hide();

                    if (res.data.Status == "Success") {
                        var data = {
                            product_id: res.data.Deviceid
                        }

                        localStorage.setItem('deviceDetails', JSON.stringify(data));

                        var data1 = {
                            status: true
                        };

                        localStorage.setItem('configure', JSON.stringify(data1));
                        var newDeviceDetails = {
                            "product_product_id": res.data.Deviceid,
                            "product": {
                                "product_id": res.data.Deviceid,
                                "password_changed": $scope.configData.old_password,
                                "values": {
                                    "mode": 0,
                                    "onoff": 1,
                                    "settemp": 0,
                                    "roomtemp": 0,
                                    "weeklyfri": "",
                                    "weeklymon": "",
                                    "weeklysat": "",
                                    "weeklytue": "",
                                    "weeklywed": "",
                                    "weeklythurs": ""
                                }
                            }
                        }
                        assignProduct();
                        if (window.localStorage.getItem('deviceConfiguredForUser')) {
                            var listfromlocal = JSON.parse(window.localStorage.getItem('deviceConfiguredForUser'));
                            listfromlocal.push(newDeviceDetails);
                            window.localStorage.setItem('deviceConfiguredForUser', JSON.stringify(listfromlocal));
                        }
                        $state.go('app.selectroom');
                    } else {
                        $state.go('app.selectroom');
                    }
                }).catch(function() {
                    $ionicLoading.hide();
                });
            }
        }

        function assignProduct() {
            var data = {
                userId: userdetails.userId,
                productId: $scope.configData.device_id
            };


            userProductFactory.assignProduct(data).then(function(res) {
                window.localStorage.removeItem('configure');

                if (window.localStorage.getItem('userdetails')) {
                    var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
                    userProductFactory.getAssignedProducts(userdetails.userId).then(function(responce) {
                        console.log('responce', responce);

                        $scope.items = responce.data;

                    });
                }
                if ($scope.showCreatePswd == true) {
                    thermostatFactory.updatePwd($scope.configData.device_id, $scope.configData.new_password).then(function() {

                    }).catch(function() {

                    });
                } else {
                    thermostatFactory.updatePwd($scope.configData.device_id, $scope.configData.old_password).then(function() {

                    }).catch(function() {

                    });
                }

            }).catch(function(error) {

            });
        }
    }]);
