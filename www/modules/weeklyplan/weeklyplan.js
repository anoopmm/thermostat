angular.module('thermostat.weeklyplan', ['ionic', 'ionic-timepicker'])
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
    .controller('weeklyplanCtrl', ['$scope', '$state', '$rootScope', '$translate', 'ionicTimePicker', function($scope, $state, $rootScope, $translate, ionicTimePicker) {

        $scope.selectedSlot = [];




        var ipObj1 = {
            callback: function(val, val2, val3) { //Mandatory
                if (typeof(val) === 'undefined') {
                    console.log('Time not selected');
                } else {
                    var selectedStartTime = new Date(val * 1000);
                    var selectedEndTime = new Date(val2 * 1000);

                    //console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), 'H :', selectedTime.getUTCMinutes(), 'M');
                    var currentDay = $scope.timeSheetItems[$scope.selectedWeekIndex];
                    for (var i = 0; i < currentDay.length; i++) {
                        console.log('i', i);
                        var currentSlotData = {
                            elementId: currentDay[i].elementId,
                        }
                        if (selectedStartTime.getUTCHours() == currentDay[i].hrs && selectedStartTime.getUTCMinutes() == currentDay[i].mts) {

                            $scope.selectedSlot.push(currentSlotData);
                            $scope.timeSheetItems[$scope.selectedWeekIndex][i].value = val3;
                            $scope.timeSheetItems[$scope.selectedWeekIndex][i].showSlider = true;
                            localStorage.setItem('weeklyPlan', JSON.stringify($scope.timeSheetItems));
                            $scope.data[i] = val3;
                            var slider = $('#' + currentDay[i].elementId).data("ionRangeSlider");

                            // Call sliders update method with any params
                            slider.update({
                                min: 14,
                                max: 30,
                                from: val3,
                                from_min: 14,
                                // etc.
                            });
                            for (var j = i; j < currentDay.length; j++) {
                                $scope.timeSheetItems[$scope.selectedWeekIndex][j].value = val3;
                                $scope.timeSheetItems[$scope.selectedWeekIndex][j].starttime = selectedStartTime;
                                $scope.data[j] = val3;
                                if (selectedEndTime.getUTCHours() == currentDay[j].hrs && selectedEndTime.getUTCMinutes() == currentDay[j].mts) {
                                    console.log('6666666666666666');
                                    localStorage.setItem('weeklyPlan', JSON.stringify($scope.timeSheetItems));
                                    localStorage.setItem($scope.weeks[$scope.selectedWeekIndex], JSON.stringify($scope.data));

                                    break;
                                }

                            }
                        }
                    }
                    $scope.timeSheetItems[$scope.selectedWeekIndex] = currentDay;
                    // $scope.$apply();

                    console.log($scope.timeSheetItems);
                }
            },
            inputTime: 50400, //Optional
            format: 24, //Optional
            step: 30, //Optional
            setLabel: 'Set' //Optional
        };






        $scope.openTime = function() {
            ionicTimePicker.openTimePicker(ipObj1);

        }















        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A'];
        $scope.data = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];

        var mqttTopic = 'thermostat3' + "/#"; // your MQTT topic /<username>/topic
        var temp = 15;
        var client;
        var message;

        //Using the HiveMQ public Broker, with a random client Id
        var client = new Messaging.Client("hospifi.spotsense.co", 9001, "myclientid_" + parseInt(Math.random() * 100, 10));

        // var mqttTopic = "thermostat2/#";
        var options = {

            //connection attempt timeout in seconds
            timeout: 10,

            //Gets Called if the connection has successfully been established
            onSuccess: function() {
                client.subscribe(mqttTopic);
            },

            //Gets Called if the connection could not be established
            onFailure: function(message) {}

        };

        //Attempt to connect
        client.connect(options)



        $scope.onClick = function(points, evt) {};
        $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
        $scope.options = {
            scales: {
                yAxes: [{
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }],
                xAxes: [{
                    id: 'x-axis-1',
                    display: true,
                    categoryPercentage: 1,
                    barPercentage: 1
                }]
            },

        };
        // if (window.cordova) {
        //     WifiWizard.listNetworks(function(res) {
        //         console.log('wifires', res)
        //     }, function(res) {
        //         console.log('wifireserror', res)
        //     })
        // }
        $scope.colors = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff'];

        $scope.timeSheetItems = [];
        $scope.weeks = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        $scope.selectedWeekIndex = 0;

        $scope.weeks2 = [{
            name: 'SUN',
            tabSelected: true
        }, {
            name: 'MON',
            tabSelected: false
        }, {
            name: 'TUE',
            tabSelected: false
        }, {
            name: 'WED',
            tabSelected: false
        }, {
            name: 'THU',
            tabSelected: false
        }, {
            name: 'FRI',
            tabSelected: false
        }, {
            name: 'SAT',
            tabSelected: false
        }];

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
                    timedata.hrs = hrs;
                    timedata.mts = mts;
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
                    timedata.hrs = hrs;
                    timedata.mts = mts;
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
            console.log('6666666', $scope.timeSheetItems);
        }
        $scope.daydataInit = $scope.timeSheetItems[0];
        $scope.populatePlan = $scope.timeSheetItems[1]
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
                            console.log('-------');
                            if (data.from >= 15) {
                                var res = data.input[0].id.split("_");
                                $scope.data[res[2]] = data.from;
                                localStorage.setItem($scope.weeks[$scope.selectedWeekIndex], JSON.stringify($scope.data));
                                $scope.timeSheetItems[res[1]][res[2]].on = true;
                                $scope.timeSheetItems[res[1]][res[2]].value = data.from;
                                var startTimeForSelectedIndex = $scope.timeSheetItems[res[1]][res[2]].starttime;
                                var daydataforselected = $scope.timeSheetItems[res[1]];
                                for (var count = res[2]; count < daydataforselected.length; count++) {
                                    if (startTimeForSelectedIndex == $scope.timeSheetItems[res[1]][count].starttime) {
                                        $scope.timeSheetItems[res[1]][count].value = data.from;
                                        $scope.data[count] = data.from;
                                    } else {
                                        localStorage.setItem($scope.weeks[$scope.selectedWeekIndex], JSON.stringify($scope.data));
                                    }
                                }
                                $scope.$apply();
                            } else {
                                var res = data.input[0].id.split("_");
                                $scope.timeSheetItems[res[1]][res[2]].on = false;
                                $scope.$apply();
                            }
                        }
                    });
                }
            }
        });
        $scope.submit = function() {
            var dayDataTosend = $scope.timeSheetItems[0];
            var msg_str = '';
            for (var m = 0; m < 48; m++) {
                if (dayDataTosend[m].value >= 15) {
                    msg_str = msg_str + dayDataTosend[m].value;
                } else {
                    msg_str = msg_str + '31';
                }
            }
            var message = new Messaging.Message(msg_str);
            message.destinationName = 'thermostat3' + '/weeklysun';
            message.qos = 0;
            client.send(message);
        };
        $scope.changeWeek = function(index) {
            $scope.selectedWeekIndex = index;
            ///$scope.data = [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];
            for (var l = 0; l < 7; l++) {
                $scope.weeks2[l].tabSelected = false;
            }
            var graphdata = $scope.timeSheetItems[index];
            for (var i = 0; i < graphdata.length; i++) {
                if (graphdata[i].value) {
                    $scope.data[i] = graphdata[i].value;
                } else {
                    $scope.data[i] = 14;
                }
            }
            $scope.weeks2[index].tabSelected = true;
            $scope.populatePlan = $scope.daydataInit;
            $(document).ready(function() {
                for (var i = 0; i < 48; i++) {

                    var slider = $("#" + $scope.daydataInit[i].elementId).data("ionRangeSlider");
                    slider.reset();
                }

            });
        }
    }]);
