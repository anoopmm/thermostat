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


        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A'];
        $scope.data = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];
        $scope.onClick = function(points, evt) {
            console.log(points, evt);
        };
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.options = {
            scales: {
                yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }]
            }
        };

        $scope.colors = ['#80FFFFFF', '#00ADF9', '#ffffff', '#46BFBD', '#FDB45C', '#ffffff', '#4D5360'];

        $scope.timeSheetItems = [];
        $scope.weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

        for (var i = 0; i < 7; i++) {
            var daydata = [];
            var hrs = 0;
            var mts = 0;
            var timedata = {};
            for (var k = 0; k < 48; k++) {
                timedata.elementId = $scope.weeks[i] + '_' + i + '_' + k;
                timedata.value = undefined;
                timedata.on = false;
                if (mts < 60) {
                    if (mts < 10) {
                        if (hrs < 10) {
                            timedata.time = '0' + hrs + ':' + '0' + mts;
                        } else {
                            timedata.time = hrs + ':' + '0' + mts;
                        }
                    } else {
                        if (hrs < 10) {
                            timedata.time = '0' + hrs + ':' + mts;
                        } else {
                            timedata.time = hrs + ':' + mts;
                        }
                    }
                } else {
                    mts = 0;
                    hrs = hrs + 1;
                    if (mts < 10) {
                        if (hrs < 10) {
                            timedata.time = '0' + hrs + ':' + '0' + mts;
                        } else {
                            timedata.time = hrs + ':' + '0' + mts;
                        }
                    } else {
                        if (hrs < 10) {
                            timedata.time = '0' + hrs + ':' + mts;
                        } else {
                            timedata.time = hrs + ':' + mts;
                        }
                    }
                }
                mts = mts + 30;
                daydata[k] = timedata;
                $scope.labels[k] = timedata.time;

                timedata = {};

            }
            $scope.timeSheetItems[i] = daydata;
            console.log('---------------', $scope.timeSheetItems);
        }


        $(document).ready(function() {
            for (var k = 0; k < 7; k++) {

                for (var i = 0; i < 48; i++) {
                    $("#" + $scope.weeks[k] + '_' + k + '_' + (i)).ionRangeSlider({
                        min: 14,
                        max: 30,
                        from: 14,
                        from_min: 14,
                        index: i,
                        onChange: function(data) {
                            console.log(data);
                            if (data.from >= 15) {
                                console.log('-------------', i);
                                var res = data.input[0].id.split("_");
                                console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrr', res);
                                $scope.data[res[2]] = data.from;
                                console.log($scope.data);
                                $scope.timeSheetItems[res[1]][res[2]].on = true;
                                $scope.$apply();
                            } else {
                                $scope.timeSheetItems[res[1]][res[2]].on = false;
                                $scope.$apply();
                            }
                        }
                    });
                }
            }




            // $("#range1").ionRangeSlider({
            //     min: 14,
            //     max: 30,
            //     from: 14,
            //     from_min: 14,
            //     onChange: function(data) {
            //         console.log(data.from);
            //         if (data.from >= 15) {
            //             console.log('-------------');
            //             $scope.timeSheetItems[0].on = true;
            //             $scope.$apply();
            //         } else {
            //             $scope.timeSheetItems[0].on = false;
            //             $scope.$apply();
            //         }
            //     }
            // });
            // $("#range2").ionRangeSlider({
            //     min: 0,
            //     max: 30,
            //     from: 15,
            //     onChange: function(data) {
            //         console.log(data.from);
            //         if (data.from >= 15) {
            //             console.log('-------------');
            //             $scope.timeSheetItems[1].on = true;
            //             $scope.$apply();
            //         } else {
            //             $scope.timeSheetItems[1].on = false;
            //             $scope.$apply();
            //         }
            //     }
            // });
            // $("#range3").ionRangeSlider({
            //     min: 0,
            //     max: 30,
            //     from: 15,
            //     onChange: function(data) {
            //         console.log(data.from);
            //         if (data.from >= 15) {
            //             console.log('-------------');
            //             $scope.timeSheetItems[2].on = true;
            //             $scope.$apply();
            //         } else {
            //             $scope.timeSheetItems[2].on = false;
            //             $scope.$apply();
            //         }
            //     }
            // });
            // $("#range").ionRangeSlider({
            //     min: 0,
            //     max: 30,
            //     from: 15
            // });
            // $("#range4").ionRangeSlider({
            //     min: 0,
            //     max: 30,
            //     from: 15,
            //     onChange: function(data) {
            //         console.log(data.from);
            //         if (data.from >= 15) {
            //             console.log('-------------');
            //             $scope.timeSheetItems[3].on = true;
            //             $scope.$apply();
            //         } else {
            //             $scope.timeSheetItems[3].on = false;
            //             $scope.$apply();
            //         }
            //     }
            // });
            // $("#range5").ionRangeSlider({
            //     min: 0,
            //     max: 30,
            //     from: 15,
            //     onChange: function(data) {
            //         console.log(data.from);
            //         if (data.from >= 15) {
            //             console.log('-------------');
            //             $scope.timeSheetItems[4].on = true;
            //             $scope.$apply();
            //         } else {
            //             $scope.timeSheetItems[4].on = false;
            //             $scope.$apply();
            //         }
            //     }
            // });
            // $("#range6").ionRangeSlider({
            //     min: 0,
            //     max: 30,
            //     from: 15,
            //     onChange: function(data) {
            //         console.log(data.from);
            //         if (data.from >= 15) {
            //             console.log('-------------');
            //             $scope.timeSheetItems[5].on = true;
            //             $scope.$apply();
            //         } else {
            //             $scope.timeSheetItems[5].on = false;
            //             $scope.$apply();
            //         }
            //     }
            // });
        });
    }]);
