angular.module('thermostat.selectroom', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.selectroom', {
                url: '/selectroom',
                cache: false,
                views: {
                    'menuContent': {
                        templateUrl: 'modules/selectroom/selectroom.html',
                        controller: 'selectRoomCtrl'
                    }
                }
            })

    }])
    .controller('selectRoomCtrl', ['$scope', '$state', 'thermostatFactory', '$ionicPopup', '$ionicPopover', 'userProductFactory', '$ionicPlatform', '$interval', '$ionicPopup', '$timeout', '$ionicPlatform', '$ionicLoading', function($scope, $state, thermostatFactory, $ionicPopup, $ionicPopover, userProductFactory, $ionicPlatform, $interval, $ionicPopup, $timeout, $ionicPlatform, $ionicLoading) {
        var interval;
        $scope.shouldShowDelete = false;
        $scope.shouldShowReorder = false;
        $scope.listCanSwipe = true
        $scope.onSwipeLeft = function() {
            console.log(1);
        }
        $scope.onSwipeRight = function() {
            console.log(2);
        }
        $scope.onSwipeRight = function() {
            console.log(3);
            $("ion-option-button").addClass("invisible")
        }
        $scope.onSwipeLeft = function() {
            console.log(3);
            $("ion-option-button").removeClass("invisible")
        }
        $scope.delete = function(index) {
            $scope.items.splice(index, 1);
        }
        $scope.zero = function() {
            $ionicPlatform.ready(function() {
                if (window.cordova) {
                    var zeroconf = cordova.plugins.zeroconf;
                    console.log('loged by anoop----------------------------');
                    zeroconf.getHostname(function success(hostname) {
                        console.log('++++++++++++++++++++++++++++++++++++++++', hostname); // ipad-of-becvert.local.
                    });
                    zeroconf.watch('_http._tcp.', 'local.', function(result) {
                        console.log('***************************', result);
                        var action = result.action;
                        var service = result.service;
                        /* service : {
                            'domain' : 'local.',
                            'type' : '_http._tcp.',
                            'name': 'Becvert\'s iPad',
                            'port' : 80,
                            'hostname' : 'ipad-of-becvert.local',
                            'ipv4Addresses' : [ '192.168.1.125' ], 
                            'ipv6Addresses' : [ '2001:0:5ef5:79fb:10cb:1dbf:3f57:feb0' ],
                            'txtRecord' : {
                                'foo' : 'bar'
                            }
                        } */
                        if (1) {
                            for (var i = 0; i < $scope.items.length; i++) {
                                if ($scope.items[i].product_product_id == result.service.name.toUpperCase()) {
                                    // alert(result.service.name.toUpperCase());
                                    $scope.locallyConnected = true;
                                    $scope.items[i].ip = result.service.ipv4Addresses[0];
                                    // $scope.$apply();
                                    console.log($scope.items);

                                } else {

                                }
                            }
                        }

                    });


                }
            });

        }
        $scope.zero();
        $scope.edit = function(i) {
            item = $scope.items[i];
            // Triggered on a button click, or some other target
            $scope.data = {};
            console.log(item);
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: 'Old password<input type="password" ng-model="data.wifi" placeholder="Old password " style="margin-bottom: 10px;">New password<input placeholder="New password "  type="password" ng-model="data.wifi2">',
                title: 'Change',
                subTitle: '',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' }, {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.wifi && !$scope.data.wifi2) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                //$scope.items[index].RoomName = $scope.data.wifi;
                                if (item.ip) {
                                    $ionicLoading.show({
                                        template: 'Loading...'
                                    });
                                    thermostatFactory.changePwd(item.ip, item.product_product_id, $scope.data.wifi, $scope.data.wifi2).then(function() {
                                        thermostatFactory.updatePwd(item.product_product_id, $scope.data.wifi2).then(function() {
                                            $ionicLoading.hide();
                                            $scope.items[i].product.password_changed = $scope.data.wifi2;
                                            userProductFactory.getAssignedProducts(userdetails.userId).then(function(responce) {
                                                console.log('responce', responce);
                                                $scope.items = responce.data;
                                                window.localStorage.setItem('deviceConfiguredForUser', JSON.stringify($scope.items));

                                            });
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Success',
                                                template: 'Successfully configured..',
                                                buttons: [{
                                                    text: 'OK',
                                                    type: 'button-assertive'
                                                }]
                                            });
                                            alertPopup.then(function() {});

                                        }).catch(function() {
                                            $ionicLoading.hide();
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Network error',
                                                template: 'Failed to configure device ',
                                                buttons: [{
                                                    text: 'OK',
                                                    type: 'button-assertive'
                                                }]
                                            });
                                            alertPopup.then(function() {});
                                        });
                                    }).catch(function() {
                                        $ionicLoading.hide();
                                        var alertPopup = $ionicPopup.alert({
                                            title: 'Network error',
                                            template: 'Failed to configure device ',
                                            buttons: [{
                                                text: 'OK',
                                                type: 'button-assertive'
                                            }]
                                        });
                                        alertPopup.then(function() {});
                                    });
                                }
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });

            // $timeout(function() {
            //     myPopup.close(); //close the popup after 3 seconds for some reason
            // }, 8000);
        };
        $scope.addedRooms = [{
            thermostatId: '1',
            imgURI: 'img/livingroom.png',
            userName: ''
        }];
        $scope.items = [];
        $scope.configData = {};
        if (window.localStorage.getItem('deviceConfiguredForUser')) {
            $scope.items = JSON.parse(window.localStorage.getItem('deviceConfiguredForUser'));
        }
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
            if (!window.localStorage.getItem('deviceConfiguredForUser')) {
                userProductFactory.getAssignedProducts(userdetails.userId).then(function(responce) {
                    console.log('responce', responce);
                    $scope.items = responce.data;
                    window.localStorage.setItem('deviceConfiguredForUser', JSON.stringify($scope.items));

                });
            }
        }
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
        }
        if (window.localStorage.getItem('deviceDetails')) {
            var devicedetails = JSON.parse(window.localStorage.getItem('deviceDetails'));
            $scope.configData.product_id = devicedetails.product_id;
            $scope.configData.groupId = devicedetails.groupId;
        }

        // $localstorage.setObject('addedRooms', $scope.addedRooms);
        $scope.openRooomDetails = function(item) {
            window.localStorage.setItem('currentItem', JSON.stringify(item));
            $interval.cancel(interval);
            if (item) {
                $state.go('app.roomdetails', {
                    itemId: item.product_product_id
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Alert',
                    template: 'Room is not available'
                });

                alertPopup.then(function(res) {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            }
        };


        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };

        $ionicPopover.fromTemplateUrl('templates/popover.html', {
            scope: $scope,
        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.openAddRoom1 = function($event) {
            $scope.popover.show($event);

        };
        $scope.goNext = function(path) {
            $interval.cancel(interval);
            $state.go(path);
            $scope.popover.hide();
        }


        function assignProduct() {
            var data = {
                userId: userdetails.userId,
                productId: $scope.configData.product_id
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

            }).catch(function(error) {

            });
        }


        $ionicPlatform.ready(function() {

            function checkConnection() {
                if (window.cordova) {
                    var networkState = navigator.connection.type;

                    var states = {};
                    states[Connection.UNKNOWN] = 'Unknown connection';
                    states[Connection.ETHERNET] = 'Ethernet connection';
                    states[Connection.WIFI] = 'WiFi connection';
                    states[Connection.CELL_2G] = 'Cell 2G connection';
                    states[Connection.CELL_3G] = 'Cell 3G connection';
                    states[Connection.CELL_4G] = 'Cell 4G connection';
                    states[Connection.CELL] = 'Cell generic connection';
                    states[Connection.NONE] = 'none';

                    console.log('Connection type: ' + states[networkState]);
                    if (states[networkState] != 'none') {
                        if (window.localStorage.getItem('configure')) {
                            // assignProduct();
                        }
                    }
                }

            }
            interval = $interval(function() {
                checkConnection();
            }, 5000)


            document.addEventListener("offline", onOffline, false);

            function onOffline() {
                // Handle the offline event
            }
        });

    }])
