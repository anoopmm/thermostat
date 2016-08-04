angular.module('thermostat.weeklyplan', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.weeklyplan', {
                url: '/weeklyplan',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/weeklyplan/weeklyplan.html',
                        controller: 'weeklyplanCtrl'
                    }
                }
            })

    }])
    .controller('weeklyplanCtrl', ['$scope', '$state', '$rootScope', '$translate', function($scope, $state, $rootScope, $translate) {
        $scope.timeSheet = [{
            time: '12:00',
            value: 10,
            id: 1
        }, {
            time: '12:30',
            value: 15,
            id: 2
        }, {
            time: '01:00',
            value: 30,
            id: 3
        }, {
            time: '01:30',
            value: 10,
            id: 4
        }, {
            time: '12:00',
            value: 20,
            id: 5
        }]
        $(document).ready(function() {
            $("#example_id").ionRangeSlider();
        });
    }]);
