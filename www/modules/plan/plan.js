angular.module('thermostat.plan', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.setplan', {
                url: '/setplan',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/plan/plan.html',
                        controller: 'setplanCtrl'
                    }
                }
            })

    }])
    .controller('setplanCtrl', ['$scope', '$ionicModal', function($scope, $ionicModal) {
        $scope.tabs = [];
        $scope.events = [];
        $scope.eventByDate = [];
        $scope.weekDaysName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        $scope.dayIndex = 1;
        $scope.plans = [];


        var intialDate = new Date();
        intialDate.setHours(0);
        intialDate.setMinutes(0);
        intialDate.setSeconds(0);
        intialDate.setMilliseconds(0);
        var endDate = new Date();
        endDate.setHours(0);
        endDate.setMinutes(intialDate.getMinutes() + 30);
        endDate.setSeconds(0);
        endDate.setMilliseconds(0);
        for (var i = 0; i < 47; i++) {
            // console.log(intialDate, endDate);
            var temObj = {
                start: intialDate,
                end: endDate,
                id: 0,
                planId: 1,
                dayIndex: 0,
                title: '',
                temperature: ''
            };
            $scope.plans[i] = temObj;
            $scope.plans.push(temObj);
            intialDate = endDate;
            var endDateTest = new Date();
            endDateTest.setHours(intialDate.getHours());
            endDateTest.setMinutes(intialDate.getMinutes() + 30);
            endDateTest.setSeconds(intialDate.getSeconds());
            endDateTest.setMilliseconds(intialDate.getMilliseconds());
            endDate = endDateTest;
        }
        console.log('plans', $scope.plans);
        $scope.timePickerObject = {
            inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
            step: 30, //Optional
            format: 24, //Optional
            titleLabel: '24-hour Format44', //Optional
            setLabel: 'Set', //Optional
            closeLabel: 'Close', //Optional
            setButtonType: 'button-assertive', //Optional
            closeButtonType: 'button-stable', //Optional
            callback: function(val1, val12) { //Mandatory
                timePickerCallback(val1, val12);
            }
        };

        $ionicModal.fromTemplateUrl('modules/plan/settime.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        function timePickerCallback(val1, val12) {
            if (typeof(val1) === 'undefined') {
                console.log('Time not selected');
            } else {
                // console.log('val12,val1', val12, val1);
                var startTime = new Date();
                startTime.setHours(val1.hours);
                startTime.setMinutes(val1.minutes);
                startTime.setSeconds(0);
                startTime.setMilliseconds(0);
                var endTime = new Date();
                endTime.setHours(val12.hours);
                endTime.setMinutes(val12.minutes);
                endTime.setSeconds(0);
                endTime.setMilliseconds(0);
                // console.log('startTime', startTime);
                // console.log('endTime', endTime);
                var eventObj = {
                    start: startTime,
                    end: endTime,
                    id: 1,
                    planId: ($scope.events.length + 1),
                    dayIndex: $scope.dayIndex,
                    title: val1.temp
                }
                if (alreadyAdded(startTime, endTime)) {
                    return;
                }
                var curIndex = checkIndex(startTime);
                var diff = getDiff(startTime, endTime);
                for (var i = 0; i < diff; i++) {
                    $scope.plans[i + curIndex].temperature = val1.temp;
                }
                console.log(curIndex);
                console.log('events', $scope.events)
                console.log('event to be added', eventObj);
                $scope.events.push(eventObj);
                console.log('eventssssssssssssssss', $scope.events);
                $scope.addEventOnSelectedDay($scope.dayIndex);
                $scope.createTimeSlotSelector(0, 24);
                console.log($scope.plans);
            }
        }

        function getDiff(d1, d2) {
            var a = moment(d1);
            var b = moment(d2);
            var diffDays = b.diff(a, 'minutes');
            return diffDays / 60;
        }

        function alreadyAdded(start, end) {
            for (var i = 0; i < $scope.events.length; i++) {
                if ($scope.events[i].dayIndex = $scope.dayIndex) {
                    // console.log(start, end);
                    // console.log($scope.events[i].start, $scope.events[i].end);
                    // console.log($scope.events[i].start.getMilliseconds(), $scope.events[i].end.getMilliseconds());
                    // console.log($scope.events[i].start.getTime(), start.getTime());
                    // console.log($scope.events[i].start < start && start < $scope.events[i].end)
                    // console.log($scope.events[i].start < end && end < $scope.events[i].end)

                    if (start.getTime() == $scope.events[i].start.getTime() || end.getTime() == $scope.events[i].end.getTime()) {
                        return true;
                    } else if ($scope.events[i].start < start && start < $scope.events[i].end) {
                        return true;
                    } else if ($scope.events[i].start < end && end < $scope.events[i].end) {
                        return true;
                    }
                }
            }
            return false;
        }

        function checkIndex(time) {
            for (var i = 0; i < $scope.plans.length; i++) {
                if ($scope.plans[i].start.getTime() == time.getTime()) {
                    return i;
                }
            }
        }
        $scope.weekName = function(day) {
            return $scope.weekDaysName[day];
        }
        $scope.deletePlan = function() {
            console.log($scope.events)
            $scope.events.splice(($scope.eventForDelete.planId - 1), 1);
            console.log($scope.events)
            $scope.addEventOnSelectedDay($scope.eventForDelete.dayIndex);
            $scope.createTimeSlotSelector(0, 24);
            $scope.modal.hide();
        }
        $scope.closeLogin = function() {
            $scope.modal.hide();
        }
        $scope.initSelected = function() {
            $scope.selected = [];
            $scope.selected.push(true);
            $scope.selected.push(true);
            // $scope.selected = [];
            for (var i = 7; i > 0; i--) {
                $scope.selected.push(false);
            };
        }
        $scope.setSelected = function() {
            $scope.selected = [];
            for (var i = 7; i >= 0; i--) {
                $scope.selected.push(false);
            };
        }
        $scope.initDate = function() {
            var curday = new Date();
            for (var i = 0; i < 7; i++) {
                $scope.tabs.push({
                    "id": (i + 1),
                    "day": $scope.weekName(new Date(curday).getDay()),
                    "date": new Date(curday).getDate() + '/' + (new Date(curday).getMonth() + 1),
                    "index": (new Date(curday).getDay() + 1),
                    "appointment": []
                });
                var curday = new Date(curday.getTime() + (1000 * 60 * 60 * 24));
            }
        }

        $scope.clickedOn = function(tab) {
            console.log('plans', $scope.plans);
            console.log('tab', tab);
            // $ionicScrollDelegate.scrollTo(1,0 , true);
            $scope.setSelected();
            // $scope.events = [];
            // $ionicScrollDelegate.scrollTop();
            $scope.selected[tab.id] = true;
            $scope.dayIndex = tab.id;
            $scope.addEventOnSelectedDay(tab.id);
            // console.log($scope.selected);
            $scope.createTimeSlotSelector(0, 24);

        };
        $scope.addEventOnSelectedDay = function(dayIndex) {
            $scope.eventByDate = [];
            for (var i = 0; i < $scope.events.length; i++) {
                console.log($scope.events[i].dayIndex, dayIndex);
                if (dayIndex == $scope.events[i].dayIndex) {
                    $scope.eventByDate.push($scope.events[i]);
                }
            }
        }

        $scope.createTimeSlotSelector = function(startHour, endHour) {
            $scope.eventDatainTimeSlot = [];
            if (startHour === undefined || endHour === undefined) {
                $i('#calendar').remove();
                return;
            }
            $i('#calendar').remove();
            $i('#schedule').append('<div id="calendar"></div>');
            var eventData2 = {
                options: {
                    timeslotsPerHour: 2,
                    defaultEventLength: 40,
                    timeslotHeight: 30,
                    businessHours: {
                        start: startHour,
                        end: endHour,
                        limitDisplay: true
                    },
                    scrollToHourMillis: 0
                },
                events: $scope.eventByDate
            };


            $i('#calendar').weekCalendar({
                timeslotsPerHour: 4,
                allowCalEventOverlap: true,
                overlapEventsSeparate: true,
                totalEventsWidthPercentInOneColumn: 95,
                height: function($calendar) {
                    console.log($calendar);
                    return $i(window).height();
                },
                eventRender: function(calEvent, $event) {
                    // $i($event).addTouch();
                    // console.log(calEvent, $event);
                    $i('.wc-new-cal-event').remove();
                    if (calEvent.end.getTime() < new Date().getTime()) {
                        $event.css('backgroundColor', '#aaa');
                        $event.find('.time').css({
                            'backgroundColor': '#999',
                            'border': '1px solid #888'
                        });
                    }
                },
                eventNew: function(calEvent, $event) {
                    console.log(calEvent, $event);
                },
                data: function(start, end, callback) {
                    console.log(eventData2);
                    // var dataSource = $i('#data_source').val1();
                    callback(eventData2);

                },
                eventClick: function(event) {
                    console.log(event);
                    $scope.eventForDelete = event;
                    $scope.modal.show();
                },
                // displayOddEven: true,
                daysToShow: 1,
                headerSeparator: ' ',
                useShortDayNames: true
            });
        };
        $scope.createTimeSlotSelector(0, 24);
        $scope.initDate();
        $scope.initSelected();
    }])
