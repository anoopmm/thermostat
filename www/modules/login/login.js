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

.controller('LoginCtrl', ['$scope', '$state', function($scope, $state) {
    'use strict';
    $scope.loginData = {};
    $scope.loginData.userName = 'admin';
    $scope.loginData.password = 'admin';

    console.log('userDetails', $scope.loginData);
    $scope.doLogin = function(loginForm) {
        // if (loginForm.$valid) {
        //     $state.go('app.selectroom');
        // }
        //$state.go('app.selectroom');
        $state.go('app.selectroom');
    };
    $scope.doRegister = function() {
        $state.go('registration');

    };
}]);
