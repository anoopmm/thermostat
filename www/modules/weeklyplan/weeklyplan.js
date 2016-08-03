angular.module('thermostat.weeklyplan', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.weeklyplan', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/settings/settings.html',
                        controller: 'settingsCtrl'
                    }
                }
            })

    }])
    .controller('settingsCtrl', ['$scope', '$state', '$rootScope','$translate', function($scope, $state, $rootScope,$translate) {

        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };
        $scope.changed = function() {
            $translate.use($rootScope.appSettings.language);
           /// alert($rootScope.appSettings.temperatureUnits);
        }
    }])
