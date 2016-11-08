/* global angular */
/* global console */
/* global $i */


angular.module('thermostat.roomdetails', ['ionic', 'angular.directives-round-progress', 'underscore'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.roomdetails', {
                url: '/roomdetails/:itemId',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/roomdetails/roomdetails.html',
                        controller: 'roomDetailsCtrl'
                    }
                }
            });

    }])
    .controller('roomDetailsCtrl', ['$scope', '$state', 'thermostatFactory', '_', '$interval', '$stateParams', '$rootScope', '$timeout', function($scope, $state, thermostatFactory, _, $interval, $stateParams, $rootScope, $timeout) {
        'use strict';
        console.log('unit', $rootScope.appSettings.temperatureUnits)
        $scope.settings = {
            mode: "00",
            fan: "00",
            autorun: "00"
        }
        $scope.deviceip = undefined;
        if (window.localStorage.getItem('currentItem')) {
            $scope.currentDevicePwd = JSON.parse(window.localStorage.getItem('currentItem')).product.password_changed;
            console.log('current password', $scope.currentDevicePwd);
            $scope.deviceip = JSON.parse(window.localStorage.getItem('currentItem')).ip;
            console.log('current ip', $scope.deviceip);
        }
        $scope.locallyConnected = false;
        var weekIndex = 0;
        $scope.sendWeeklyPlan = {};
        $scope.sendWeeklyPlan.status = false;
        $scope.deviceStatus = { on: true };
        $scope.filter = {
            cool: true,
            sleep: true,
            autorun: false,
            hot: true
        };
        $scope.localDataForSend = {};
        $scope.setTempData = {
            label: 5,
            percentage: 5
        };
        $scope.roomTempData = {
            label: 40,
            percentage: 40
        };
        $scope.setTempData.label = 16;
        $scope.roomTempData.label = 20;

        $scope.weeklyPlan = false;
        $scope.tempStatus = {
            low: false,
            medium: false,
            high: false,
            automode: false
        };
        $scope.title = $stateParams.itemId;
        var thermostatId = $stateParams.itemId;





        var timerCount = 0;
        var timerCount1 = 0;
        var timerRef = 3;
        var msgSend = false;
        var msgSendAndRply = false;
        var counter = $interval(function() {
            timerCount++;
            //console.log(timerCount);
        }, 1000)
        var counter1 = $interval(function() {
            timerCount1++;
            //console.log(timerCount1);
        }, 1000)






        // var mqttBrokerURI = "m10.cloudmqtt.com";
        // var mqttClientName = "browser-" + (new Date().getTime());
        // var mqttUsername = "sensomate"; // sxnrjvjw  your MQTT username
        // var mqttPassword = "senso123"; // 3Y2818zm5B1- your MQTT password
        var mqttTopic = thermostatId + "/#"; // your MQTT topic /<username>/topic
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
                console.log("Connected");
                client.subscribe(mqttTopic);
                console.log("subscribed to " + mqttTopic);
            },

            //Gets Called if the connection could not be established
            onFailure: function(message) {
                console.log("Connection failed: " + message.errorMessage);
            }

        };

        //Attempt to connect
        client.connect(options)

        function currentStatusFromLocal() {
            if ($scope.deviceip) {
                thermostatFactory.currentStatus($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd).then(function(res) {
                    if (res.data.Settemperature) {
                        $scope.locallyConnected = true;
                        $scope.setTempData.label = parseInt(res.data.Settemperature);
                        $scope.roomTempData.label = parseInt(res.data.Roomtemperature);
                        if (res.data.Mode == '0') {
                            $scope.filter.cool = true;
                            $scope.filter.sleep = false;
                            $scope.filter.hot = false;

                        } else if (res.data.Mode == '1') {
                            $scope.filter.sleep = true;
                            $scope.filter.cool = false;
                            $scope.filter.hot = true;
                        }

                        if (res.data.Fan === '0') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = false;
                            $scope.tempStatus.high = false;
                            $scope.tempStatus.automode = false;

                        } else if (res.data.Fan === '1') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = true;
                            $scope.tempStatus.high = false;
                            $scope.tempStatus.automode = false;

                        } else if (res.data.Fan === '2') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = true;
                            $scope.tempStatus.high = true;
                            $scope.tempStatus.automode = false;

                        } else if (res.data.Fan === '3') {
                            $scope.tempStatus.automode = true;
                            $scope.tempStatus.low = false;
                            $scope.tempStatus.medium = false;
                            $scope.tempStatus.high = false;

                        }
                    }
                }).catch(function() {

                });
            }
        }
        currentStatusFromLocal();
        client.onMessageArrived = function(message) {
            if (!$scope.locallyConnected) {
                console.log(message);
                var topic = message.destinationName;
                var data = message.payloadString;
                console.log('Message:' + topic + '--->' + data);
                var topic = topic.split('/');
                var topicLength = topic.length;
                var data1 = data;

                console.log('values', topic);
                //Published from Device
                var productId = topic[1];
                console.log('productId-->', productId);

                if (topicLength === 3) {
                    var method = topic[2];
                    if (method === "roomtemp") {
                        $scope.setTempData.label = parseInt(data.slice(0, 2));
                        $scope.roomTempData.label = parseInt(data1.slice(2, 4));
                        console.log('values', typeof($scope.setTempData), $scope.roomTempData);
                        $scope.$apply();
                    };
                    if (method === "settemp") {
                        $scope.setTempData.label = parseInt(data.slice(0, 2));
                        console.log('values', typeof($scope.setTempData), $scope.roomTempData);
                        $scope.$apply();
                    };
                    if (method === "mode") {
                        console.log('data', data);
                        var sleepOrCool = data.substr(0, 2);
                        var fanLevel = data.substr(2, 2);
                        var autorun = data.substr(4, 2);
                        console.log('sleepOrCool-->', sleepOrCool);
                        console.log('fanLevel-->', fanLevel);
                        console.log('autorun-->', autorun);
                        if (sleepOrCool === '00') {
                            $scope.filter.cool = true;
                            $scope.filter.sleep = false;
                            $scope.filter.hot = false;

                        } else if (sleepOrCool == '01') {
                            $scope.filter.sleep = true;
                            $scope.filter.cool = false;
                            $scope.filter.hot = true;
                        }
                        if (fanLevel === '00') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = false;
                            $scope.tempStatus.high = false;
                            $scope.tempStatus.automode = false;

                        } else if (fanLevel === '01') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = true;
                            $scope.tempStatus.high = false;
                            $scope.tempStatus.automode = false;

                        } else if (fanLevel === '02') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = true;
                            $scope.tempStatus.high = true;
                            $scope.tempStatus.automode = false;

                        } else if (fanLevel === '03') {
                            $scope.tempStatus.automode = true;
                            $scope.tempStatus.low = false;
                            $scope.tempStatus.medium = false;
                            $scope.tempStatus.high = false;

                        }
                        if (autorun == '00') {
                            $scope.filter.autorun = false;
                        } else if (autorun === '01') {
                            $scope.filter.autorun = true;
                        }
                        $scope.$apply();
                    };
                    if (method == 'onoff') {
                        console.log('-----------', data);
                        if (data == '00') {
                            console.log('-----------111', data);
                            $scope.deviceStatus.on = false;
                            $scope.$apply();

                        } else if (data == '01') {
                            console.log('-----------222', data);
                            $scope.deviceStatus.on = true;
                            $scope.$apply();

                        }

                    }
                    if (method == 'Ack') {
                        if (data.indexOf('Program Updated') !== -1) {

                            sendWeeklyplans();

                        }
                    }
                } else if (topicLength === 2) {
                    var method = topic[1];
                    if (method === "roomtemp") {

                        $scope.setTempData.label = parseInt(data.slice(0, 2));
                        $scope.roomTempData.label = parseInt(data1.slice(2, 4));
                        console.log('values', typeof($scope.setTempData), $scope.roomTempData);
                        $scope.$apply();
                    };
                    if (method === "settemp") {
                        $scope.setTempData.label = parseInt(data.slice(0, 2));
                        console.log('values', typeof($scope.setTempData), $scope.roomTempData);
                        $scope.$apply();
                    };
                    if (method === "mode") {
                        console.log('data', data);
                        var sleepOrCool = data.substr(0, 2);
                        var fanLevel = data.substr(2, 2);
                        var autorun = data.substr(4, 2);
                        console.log('sleepOrCool-->', sleepOrCool);
                        console.log('fanLevel-->', fanLevel);
                        console.log('autorun-->', autorun);
                        if (sleepOrCool === '00') {
                            $scope.filter.cool = true;
                            $scope.filter.sleep = false;
                            $scope.filter.hot = false;

                        } else if (sleepOrCool == '01') {
                            $scope.filter.sleep = true;
                            $scope.filter.cool = false;
                            $scope.filter.hot = true;
                        }
                        if (fanLevel === '00') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = false;
                            $scope.tempStatus.high = false;
                            $scope.tempStatus.automode = false;

                        } else if (fanLevel === '01') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = true;
                            $scope.tempStatus.high = false;
                            $scope.tempStatus.automode = false;

                        } else if (fanLevel === '02') {
                            $scope.tempStatus.low = true;
                            $scope.tempStatus.medium = true;
                            $scope.tempStatus.high = true;
                            $scope.tempStatus.automode = false;

                        } else if (fanLevel === '03') {
                            $scope.tempStatus.low = false;
                            $scope.tempStatus.medium = false;
                            $scope.tempStatus.high = false;
                            $scope.tempStatus.automode = true;

                        }
                        if (autorun == '00') {
                            $scope.filter.autorun = false;
                        } else if (autorun === '01') {
                            $scope.filter.autorun = true;
                        }
                        $scope.$apply();
                    };
                }
                //Published from device
                else if (topicLength === 4) {

                    var method = topic[3];
                    if (method === "onoff" || method === "mode" || method === "roomtemp" || method === "weeklymon" || method === "weeklytue" || method === "weeklywed" || method === "weeklythurs" || method === "weeklyfri" || method === "weeklysat") {

                        $scope.setTempData = parseInt(data.slice(0, 2));
                        $scope.roomTempData = parseInt(data1.slice(2, 4));
                        var setTempNew = data.slice(0, 2);
                        var roomTempNew = data1.slice(2, 4);
                        console.log('values', setTempNew, roomTempNew);

                    };
                }

            }
        };



















        function calculateTempSetPoint() {

        }

        function calculateAhuControl(selectedMode) {

        }
        $scope.changeStatus = function(status) {
            console.log('status', status);
            if (status == 'low') {

                $scope.tempStatus.medium = false;
                $scope.tempStatus.high = false;
                if ($scope.tempStatus.low === true) {
                    $scope.tempStatus.low = false;
                    $scope.settings.fan = "00";
                    $scope.localDataForSend.fan = 0;
                } else {
                    $scope.tempStatus.automode = false;
                    $scope.tempStatus.low = true;
                    $scope.settings.fan = "00";
                    $scope.localDataForSend.fan = 0;
                }
            }
            if (status == 'medium') {
                $scope.tempStatus.automode = false;
                $scope.tempStatus.high = false;
                if ($scope.tempStatus.medium === false) {
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = true;
                    $scope.settings.fan = "01";
                    $scope.localDataForSend.fan = 1;
                } else {
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = false;
                    $scope.settings.fan = "00";
                    $scope.localDataForSend.fan = 0;

                }
            }
            if (status == 'high') {

                $scope.tempStatus.automode = false;
                if ($scope.tempStatus.high === false) {
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = true;
                    $scope.tempStatus.high = true;
                    $scope.settings.fan = "02";
                    $scope.localDataForSend.fan = 2;
                } else {
                    $scope.tempStatus.high = false;
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = true;
                    $scope.settings.fan = "01";
                    $scope.localDataForSend.fan = 1;
                }
            }
            if (status === 'auto') {
                console.log('automode', $scope.tempStatus.automode);
                if ($scope.tempStatus.automode === true) {
                    $scope.tempStatus.low = false;
                    $scope.tempStatus.medium = false;
                    $scope.tempStatus.high = false;
                    $scope.settings.fan = "03";
                    $scope.localDataForSend.fan = 3;
                } else {
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = true;
                    $scope.tempStatus.high = true;
                    $scope.settings.fan = "02";
                    $scope.localDataForSend.fan = 2;
                }
            }
            var msg_str = $scope.settings.mode + $scope.settings.fan + $scope.settings.autorun;
            // message = new Paho.MQTT.Message(msg_str);
            // message.destinationName = "thermostat2/mode";
            // client.send(message);
            var message = new Messaging.Message(msg_str);
            message.destinationName = thermostatId + '/mode';
            message.qos = 0;
            if ($scope.locallyConnected == false) {
                client.send(message);
            } else {
                thermostatFactory.mode($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, $scope.localDataForSend.mode, $scope.localDataForSend.fan, $scope.localDataForSend.autorun).then(function() {
                    //  alert('Updated');
                }).catch(function() {
                    $scope.locallyConnected = false;
                    $scope.zero();
                    //  alert('error');
                });
            }
        };

        $scope.incrTemp = function() {
            if ($scope.setTempData.label >= 15 && $scope.setTempData.label < 30) {
                $scope.setTempData.label += 1;
                if (timerCount > timerRef) {
                    temp = $scope.setTempData.label;
                    var msg_str = temp.toString();
                    console.log('msg-------------', msg_str);

                    var message = new Messaging.Message(msg_str);
                    message.destinationName = thermostatId + '/settemp';
                    message.qos = 0;
                    if ($scope.locallyConnected == false) {


                        client.send(message);
                    } else {

                        thermostatFactory.setTemp($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, $scope.setTempData.label).then(function() {
                            // alert('updates');
                        }).catch(function() {
                            $scope.locallyConnected = false;
                            $scope.zero();
                            // alert('error');
                        });


                    }
                    msgSend = true;
                    msgSendAndRply = true
                } else {
                    msgSend = false;
                }
                var timeout = $timeout(function() {
                    if (msgSend == false) {
                        temp = $scope.setTempData.label;
                        var msg_str = temp.toString();
                        console.log('msg-------------', msg_str);

                        var message = new Messaging.Message(msg_str);
                        message.destinationName = thermostatId + '/settemp';
                        message.qos = 0;
                        if ($scope.locallyConnected == false) {


                            client.send(message);
                        } else {

                            thermostatFactory.setTemp($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, $scope.setTempData.label).then(function() {
                                //  alert('updates');
                            }).catch(function() {
                                $scope.locallyConnected = false;
                                $scope.zero();
                                // alert('error');
                            });
                        }
                        msgSend = true;
                        msgSendAndRply = true;
                    }
                }, 3000)
                timerCount = 0;

            }

        };
        $scope.decrTemp = function() {
            if ($scope.setTempData.label >= 16 && $scope.setTempData.label <= 30) {
                $scope.setTempData.label -= 1;




                if (timerCount > timerRef) {
                    temp = $scope.setTempData.label;
                    var msg_str = temp.toString();
                    var message = new Messaging.Message(msg_str);
                    message.destinationName = thermostatId + '/settemp';
                    message.qos = 0;
                    if ($scope.locallyConnected == false) {


                        client.send(message);
                    } else {

                        thermostatFactory.setTemp($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, $scope.setTempData.label).then(function() {
                            // alert('updates');
                        }).catch(function() {
                            $scope.locallyConnected = false;
                            $scope.zero();
                            // alert('error');
                        });
                    }
                    msgSend = true;
                    msgSendAndRply = true;
                } else {
                    msgSend = false;
                }
                var timeout1 = $timeout(function() {
                        if (msgSend == false) {
                            temp = $scope.setTempData.label;
                            var msg_str = temp.toString();
                            var message = new Messaging.Message(msg_str);
                            message.destinationName = thermostatId + '/settemp';
                            message.qos = 0;
                            if ($scope.locallyConnected == false) {


                                client.send(message);
                            } else {


                                thermostatFactory.setTemp($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, $scope.setTempData.label).then(function() {
                                    // alert('updates');
                                }).catch(function() {
                                    $scope.locallyConnected = false;
                                    $scope.zero();
                                    // alert('error');
                                });
                            }

                            msgSend = true;
                            msgSendAndRply = true;
                        }
                    },
                    3000)
                timerCount = 0;





            }

        };
        $scope.sleepToggle = function() {
            if ($scope.filter.sleep == true) {
                $scope.settings.mode = "01";
                $scope.localDataForSend.mode = 1;
            } else if ($scope.filter.sleep == false) {
                $scope.settings.mode = "00";
                $scope.localDataForSend.mode = 0;
            }
            var msg_str = $scope.settings.mode + $scope.settings.fan + $scope.settings.autorun;
            // message = new Paho.MQTT.Message(msg_str);
            // message.destinationName = "thermostat2/mode";
            // client.send(message);
            var message = new Messaging.Message(msg_str);
            message.destinationName = thermostatId + '/mode';
            message.qos = 0;
            if ($scope.locallyConnected == false) {
                client.send(message);
            } else {
                thermostatFactory.mode($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, $scope.localDataForSend.mode, $scope.localDataForSend.fan, $scope.localDataForSend.autorun).then(function() {
                    // alert('Updated');
                }).catch(function() {
                    $scope.locallyConnected = false;
                    $scope.zero();
                    // alert('error');
                });
            }

        };
        $scope.deviceOn = function() {
            // $scope.deviceStatus.on = !$scope.deviceStatus.on;
            var msg_str = '00';
            var onoffStat = 1;
            if ($scope.deviceStatus.on) {
                msg_str = '01';
                onoffStat = 1;
            } else {
                msg_str = '00';
                onoffStat = 0;
            }
            //var msg_str = '00';
            var message = new Messaging.Message(msg_str);
            message.destinationName = thermostatId + '/onoff';
            message.qos = 0;
            if ($scope.locallyConnected == false) {


                client.send(message);
            } else {
                thermostatFactory.onoff($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, onoffStat).then(function() {
                    /// alert('Updated');
                }).catch(function() {
                    $scope.locallyConnected = false;
                    $scope.zero();
                    // alert('error');
                });

            }
        };

        $scope.autorunToggle = function() {
            if ($scope.filter.autorun == true) {
                $scope.settings.autorun = "01";
                $scope.localDataForSend.autorun = 1;
            } else if ($scope.filter.autorun == false) {
                $scope.settings.autorun = "00";
                $scope.localDataForSend.autorun = 0;
            }
            var msg_str = $scope.settings.mode + $scope.settings.fan + $scope.settings.autorun;
            // message = new Paho.MQTT.Message(msg_str);
            // message.destinationName = "thermostat2/mode";
            // client.send(message);
            var message = new Messaging.Message(msg_str);
            message.destinationName = thermostatId + '/mode';
            message.qos = 0;
            if ($scope.locallyConnected == false) {


                client.send(message);
            } else {
                thermostatFactory.mode($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, $scope.localDataForSend.mode, $scope.localDataForSend.fan, $scope.localDataForSend.autorun).then(function() {
                    // alert('Updated');
                }).catch(function() {
                    $scope.locallyConnected = false;
                    $scope.zero();
                    // alert('error');
                });

            }

        };
        $scope.$watch('setTempData', function(newValue, oldValue) {
            newValue.percentage = newValue.label / 30;
        }, true);
        $scope.$watch('roomTempData', function(newValue, oldValue) {
            newValue.percentage = newValue.label / 3;
        }, true);
        $scope.setPlan = function() {
            $state.go('app.weeklyplan');
        };
        $scope.sendWeekly = function() {
            $scope.weeks = [{
                w: 'SUN',
                msgStr: 'weeklysun',
                msgStrl: 'Weeklysun'
            }, {
                w: 'MON',
                msgStr: 'weeklymon',
                msgStrl: 'Weeklymon'
            }, {
                w: 'TUE',
                msgStr: 'weeklytue',
                msgStrl: 'Weeklytue'
            }, {
                w: 'WED',
                msgStr: 'weeklywed',
                msgStrl: 'Weeklywed'
            }, {
                w: 'THU',
                msgStr: 'weeklythurs',
                msgStrl: 'Weeklythurs'
            }, {
                w: 'FRI',
                msgStr: 'weeklyfri',
                msgStrl: 'Weeklyfri'
            }, {
                w: 'SAT',
                msgStr: 'weeklysat',
                msgStrl: 'Weeklysat'
            }];
            if ($scope.sendWeeklyPlan.status) {
                sendWeeklyplans();
            }


        };

        function sendWeeklyplans() {
            if (weekIndex < 7) { //  if the counter < 10, call the loop function
                console.log('+++++');
                if (localStorage.getItem($scope.weeks[weekIndex].w)) {
                    var arrayToSend = JSON.parse(localStorage.getItem($scope.weeks[weekIndex].w));
                    var msg_str = '';
                    var msg_strl = ''
                    for (var m = 0; m < 48; m++) {
                        if (arrayToSend[m] >= 15) {
                            msg_strl = msg_strl + '&a[' + m + ']=' + arrayToSend[m];
                            msg_str = msg_str + arrayToSend[m];
                        } else {
                            msg_strl = msg_strl + '&a[' + m + ']=' + '31';
                            msg_str = msg_str + '31';
                        }
                    }
                    console.log(msg_strl);
                    var message = new Messaging.Message(msg_str);
                    message.destinationName = thermostatId + '/' + $scope.weeks[weekIndex].msgStr;
                    message.qos = 0;
                    // var stringtosendlocally = $scope.weeks[weekIndex].msgStrl +'=0'+ msg_strl;
                    // console.log(stringtosendlocally);
                    if ($scope.locallyConnected == false) {
                        client.send(message);
                    } else {
                        var stringtosendlocally = $scope.weeks[weekIndex].msgStrl + '=0' + msg_strl;
                        console.log(stringtosendlocally);
                        thermostatFactory.weeklypgm($scope.deviceip, $stateParams.itemId, $scope.currentDevicePwd, stringtosendlocally).then(function() {

                        }).catch(function() {
                            $scope.locallyConnected = false;
                            $scope.zero();
                        });
                    }
                }
                weekIndex++; //  increment the counter

            }
        }
        $scope.zero = function() {
            if (window.cordova) {
                // alert();
                var zeroconf = cordova.plugins.zeroconf;
                console.log('loged by anoop----------------------------');
                zeroconf.getHostname(function success(hostname) {
                    console.log('++++++++++++++++++++++++++++++++++++++++', hostname); // ipad-of-becvert.local.
                });
                zeroconf.watch('_http._tcp.', 'local.', function(result) {
                    console.log('***************************', result.service);
                    var action = result.action;
                    var service = result.service;
                    /* service : {
                        'domain' : 'local.',
                        'type' : '_http._tcp.',
                        'name': 'Becvert\'s iPad',
                        'port' : 80,
                        'hostname' : 'ipad-of-becvert.local',
                        'ipv4Addresses' : [ '192.168.1.125' ], 
                        'ipv6Addresses' : [ '2001:0:5ef5:79fb:10cb:1dbf:3f57:feb0' ],
                        'txtRecord' : {
                            'foo' : 'bar'
                        }
                    } */
                    if ($stateParams.itemId == result.service.name.toUpperCase()) {
                        // alert(result.service.name.toUpperCase());
                        $scope.locallyConnected = true;
                        $scope.deviceip = result.service.ipv4Addresses[0];

                    } else {

                    }
                });


            }

        }
        $scope.zero();

    }]);
