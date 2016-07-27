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
    .controller('selectRoomCtrl', ['$scope', '$state', 'thermostatFactory', '$ionicPopup', '$ionicPopover', 'userProductFactory', function($scope, $state, thermostatFactory, $ionicPopup, $ionicPopover, userProductFactory) {
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
        if (window.localStorage.getItem('userdetails')) {
            var userdetails = JSON.parse(window.localStorage.getItem('userdetails'));
            userProductFactory.getAssignedProducts(userdetails.userId).then(function(responce) {
                console.log('responce', responce);



            });
        }


        // $localstorage.setObject('addedRooms', $scope.addedRooms);
        $scope.openRooomDetails = function(itemId) {
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
            $state.go(path);
            $scope.popover.hide();
        }
    }])
