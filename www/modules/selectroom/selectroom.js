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
    .controller('selectRoomCtrl', ['$scope', '$state', 'thermostatFactory', '$ionicPopup', '$ionicPopover', 'userProductFactory', '$ionicPlatform', '$interval', function($scope, $state, thermostatFactory, $ionicPopup, $ionicPopover, userProductFactory, $ionicPlatform, $interval) {
        var interval;


        $scope.addedRooms = [{
            thermostatId: '1',
            imgURI: 'img/livingroom.png',
            userName: ''
        }];
        $scope.items = [];
        $scope.items.push({
            CurrentTemperature: "0",
            FanSpeed: "0",
            TemperatureSetPoint: "20",
            "RoomName": "O.T-1",
            "img": "ot1.jpg",
            "id": 1
        });
        $scope.items.push({
            CurrentTemperature: "0",
            FanSpeed: "0",
            TemperatureSetPoint: "20",
            "RoomName": "O.T-2",
            "img": "ot2.jpg",
            "id": 2
        });
        $scope.items.push({
            CurrentTemperature: "0",
            FanSpeed: "0",
            TemperatureSetPoint: "20",
            "RoomName": "O.T-3",
            "img": "ot3.jpg",
            "id": 3
        });
        $scope.items.push({
            CurrentTemperature: "0",
            FanSpeed: "0",
            TemperatureSetPoint: "20",
            "RoomName": "O.T-4",
            "img": "ot4.jpg",
            "id": 4
        });
        $scope.configData={};
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
            userProductFactory.getAssignedProducts(userdetails.userId).then(function(responce) {
                console.log('responce', responce);



            });
        }
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
        }
        if (window.localStorage.getItem('deviceDetails')) {
            var devicedetails = JSON.parse(window.localStorage.getItem('deviceDetails'));
            $scope.configData.product_id = devicedetails.ThermostatID;
            $scope.configData.groupId = devicedetails.Groupname;
        }

        // $localstorage.setObject('addedRooms', $scope.addedRooms);
        $scope.openRooomDetails = function(itemId) {
             $interval.cancel(interval);
            if (itemId) {
                $state.go('app.roomdetails', {
                    itemId: itemId
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

                // var alertPopup = $ionicPopup.alert({
                //     title: 'Your device successfully configured',
                //     template: 'Please connect to internet',
                //     buttons: [{
                //         text: 'OK',
                //         type: 'button-assertive'
                //     }]
                // });
                // alertPopup.then(function() {
                //     $state.go('app.selectroom');

                // });

            }).catch(function(error) {
                // console.log('error', error);
                // var alertPopup = $ionicPopup.alert({
                //     title: 'Some error occcured',
                //     template: 'Please reconfigure your device',
                //     buttons: [{
                //         text: 'OK',
                //         type: 'button-assertive'
                //     }]
                // });
                // alertPopup.then(function() {
                //     $state.go('app.selectroom');

                // });

            });
        }


        $ionicPlatform.ready(function() {

            function checkConnection() {
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
                        assignProduct();
                    }
                }
            }
            interval=$interval(function() {
                checkConnection();
            }, 5000)


            document.addEventListener("offline", onOffline, false);

            function onOffline() {
                // Handle the offline event
            }
        });

    }])
