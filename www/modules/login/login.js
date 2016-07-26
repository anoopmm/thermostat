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

.controller('LoginCtrl', ['$scope', '$state', 'userFactory', '$ionicPopup', function($scope, $state, userFactory, $ionicPopup) {
    'use strict';
    $scope.loginData = {};
    // $scope.loginData.userName = 'admin';
    // $scope.loginData.password = 'admin';

    console.log('userDetails', $scope.loginData);
    $scope.doLogin = function(loginForm) {
        userFactory.doLogin($scope.loginData).then(function(res) {
            //   $ionicLoading.hide();
            console.log(res);
            $state.go('app.selectroom');

            if(res.data.userId){
                localStorage.setItem('userdetails', JSON.stringify(res.data));
            }


        }).catch(function(error) {
            //  $ionicLoading.hide();
            console.log('error', error);


        });
        //  $state.go('app.selectroom');
    };
    $scope.doRegister = function() {
        $state.go('registration');

    };
}]);
