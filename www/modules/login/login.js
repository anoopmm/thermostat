angular.module('thermostat.login', ['ionic', 'ngMessages'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/login/login.html',
                controller: 'LoginCtrl'

            })
    }])

.controller('LoginCtrl', ['$scope', '$state', 'userFactory', '$ionicPopup','$ionicLoading', function($scope, $state, userFactory, $ionicPopup,$ionicLoading) {
    'use strict';
    $scope.loginData = {};
    // $scope.loginData.userName = 'admin';
    // $scope.loginData.password = 'admin';

    console.log('userDetails', $scope.loginData);
    $scope.doLogin = function(loginForm) {
        $ionicLoading.show({
            template: 'Loading...'
        });
        userFactory.doLogin($scope.loginData).then(function(res) {

            $ionicLoading.hide();
            if (res.data.status == 200) {
                console.log(res);
                $state.go('app.selectroom');

                if (res.data.userId) {
                    localStorage.setItem('userdetails', JSON.stringify(res.data));
                }
            } else if (res.data.status == 401) {
                alertPopup = $ionicPopup.alert({
                    title: 'Please check your details',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {});

            } else if (res.data.status == 422) {
                alertPopup = $ionicPopup.alert({
                    title: 'Please check your details',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {});

            } else {
                alertPopup = $ionicPopup.alert({
                    title: 'Please check your details',
                    buttons: [{
                        text: 'OK',
                        type: 'button-assertive'
                    }]
                });
                alertPopup.then(function() {});

            }


        }).catch(function(error) {
            $ionicLoading.hide();
            console.log('error', error);
            alertPopup = $ionicPopup.alert({
                title: 'Some network error occured..',
                buttons: [{
                    text: 'OK',
                    type: 'button-assertive'
                }]
            });
            alertPopup.then(function() {});

        });
        //  $state.go('app.selectroom');
    };
    $scope.doRegister = function() {
        $state.go('registration');

    };
}]);
