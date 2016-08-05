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
        }];
        $scope.timeSheetItems = [{
            elementId: 'range1',
            time: '12:00',
            value: undefined,
            on:false
        }, {
            elementId: 'range2',
            time: '12:30',
            value: undefined
        }, {
            elementId: 'range3',
            time: '01:00',
            value: undefined
        }, {
            elementId: 'range4',
            time: '01:30',
            value: undefined
        }, {
            elementId: 'range5',
            time: '02:00',
            value: undefined
        }, {
            elementId: 'range6',
            time: '02:30',
            value: undefined
        }, {
            elementId: 'range7',
            time: '03:00',
            value: undefined
        }]
        $(document).ready(function() {

            $("#range1").ionRangeSlider({
                min: 14,
                max: 30,
                from: 14,
                from_min: 14,
                onChange: function(data) {
                    console.log(data.from);
                    if (data.from >= 15) {
                        console.log('-------------');
                        $scope.timeSheetItems[0].on = true;
                        $scope.$apply();
                    } else {
                        $scope.timeSheetItems[0].on = false;
                        $scope.$apply();
                    }
                }
            });
            $("#range2").ionRangeSlider({
                min: 0,
                max: 30,
                from: 15
            });
            $("#range3").ionRangeSlider({
                min: 0,
                max: 30,
                from: 15
            });
            $("#range").ionRangeSlider({
                min: 0,
                max: 30,
                from: 15
            });
            $("#range4").ionRangeSlider({
                min: 0,
                max: 30,
                from: 15
            });
            $("#range5").ionRangeSlider({
                min: 0,
                max: 30,
                from: 15
            });
            $("#range6").ionRangeSlider({
                min: 0,
                max: 30,
                from: 15
            });
        });
    }]);
