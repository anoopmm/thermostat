angular.module('thermostat.registration', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('registration', {
                url: '/registration',
                templateUrl: 'modules/registration/registration.html',
                controller: 'registerCtrl'
            })
    }])
    .controller('registerCtrl', ['$scope', '$state', 'userFactory', '$ionicLoading', '$ionicPopup', function($scope, $state, userFactory, $ionicLoading, $ionicPopup) {
        $scope.openLogin = function() {
            $state.go('login');
        };
        $scope.regData = {};

        $scope.signUp = function() {
            $ionicLoading.show({
                template: 'Loading...'
            });
            userFactory.signUp($scope.regData).then(function(res) {
                $ionicLoading.hide();

                if (res.data.id) {
                    alertPopup = $ionicPopup.alert({
                        title: 'User registerd successfully',
                        buttons: [{
                            text: 'OK',
                            type: 'button-assertive'
                        }]
                    });
                    alertPopup.then(function() {
                        $state.go('login');
                        // $localStorage.setObject('registrationDetails', $scope.registrationDetails);
                    });
                } else {
                    alertPopup = $ionicPopup.alert({
                        title: res.data.message,
                        buttons: [{
                            text: 'OK',
                            type: 'button-assertive'
                        }]
                    });
                    alertPopup.then(function() {
                    });
                }
            }).catch(function(error) {
                $ionicLoading.hide();
                console.log('error', error);
                if (error.status === 409) {
                    alertPopup = $ionicPopup.alert({
                        title: 'Email or phone number already exists',
                        buttons: [{
                            text: 'OK',
                            type: 'button-assertive'
                        }]
                    });
                    alertPopup.then(function() {});
                } else {
                    alertPopup = $ionicPopup.alert({
                        title: 'No internet access',
                        buttons: [{
                            text: 'OK',
                            type: 'button-assertive'
                        }]
                    });
                    alertPopup.then(function() {});
                }
            });
        }

    }]);
