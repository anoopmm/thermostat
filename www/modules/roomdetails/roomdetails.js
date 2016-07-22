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
    .controller('roomDetailsCtrl', ['$scope', '$state', 'thermostatFactory', '_', '$interval', '$stateParams', function($scope, $state, thermostatFactory, _, $interval, $stateParams) {
        'use strict';
        // constants
        $scope.settings = {
            mode: "00",
            fan: "00",
            autorun: "00"
        }
        $scope.filter = {
            cool: true,
            sleep: false,
            autorun: false
        }
        $scope.setTempData = {
            label: 5,
            percentage: 5
        };
        $scope.roomTempData = {
            label: 40,
            percentage: 40
        };
        $scope.setTempData.label = 22;
        $scope.roomTempData.label = 0;

        $scope.weeklyPlan = false;
        $scope.tempStatus = {
            low: false,
            medium: false,
            high: false,
            automode: false
        };

        var mqttBrokerURI = "m10.cloudmqtt.com";
        var mqttClientName = "browser-" + (new Date().getTime());
        var mqttUsername = "sensomate"; // sxnrjvjw  your MQTT username
        var mqttPassword = "senso123"; // 3Y2818zm5B1- your MQTT password
        var mqttTopic = "thermostat2/#"; // your MQTT topic /<username>/topic
        var temp = 15;
        var client;
        var message;
        // wait for page to be ready
        // document.addEventListener("DOMContentLoaded", function(event) {

        // Create a client instance,
        // uses the paho library (https://www.eclipse.org/paho/clients/js/)
        client = new Paho.MQTT.Client(mqttBrokerURI, 37682, "/wss", mqttClientName);
        // set callback handlers
        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;
        // connect the client
        client.connect({
            userName: mqttUsername,
            password: mqttPassword,
            onSuccess: onConnect,
            onFailure: onFail
        });
        // called when the client connects
        function onConnect() {
            // Once a connection has been made, subscribe to the topic.
            console.log("connected");
            client.subscribe(mqttTopic);
            console.log("subscribed to " + mqttTopic);
        }

        function onFail() {
            // Once a connection has been made, subscribe to the topic.
            console.log("failed");
            client.connect({
                userName: mqttUsername,
                password: mqttPassword,
                onSuccess: onConnect,
                onFailure: onFail
            });
            //client.subscribe(mqttTopic);
            //console.log("subscribed to " + mqttTopic);
        }
        // called when the client loses it's connection
        function onConnectionLost(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("connection lost:" + responseObject.errorMessage);
                client.connect({
                    userName: mqttUsername,
                    password: mqttPassword,
                    onSuccess: onConnect,
                    onFailure: onFail
                });

            }
        }

        function onMessageArrived(message) {
            switch (message.destinationName) {
                case "thermostat2/pub/roomtemp":
                    console.log(message.payloadString);
                    $scope.roomTempData.label = parseInt(message.payloadString.substr(2, 2));
                    $scope.setTempData.label = parseInt(message.payloadString.substr(0, 2));

                    $scope.$apply();
                    break;
                case "thermostat2/pub/mode":
                    $scope.recmode = parseInt(message.payloadString.substr(0, 2));
                    $scope.recautorun = parseInt(message.payloadString.substr(4, 2))
                    if ($scope.recmode === 1) {
                        $scope.filter.sleep = true;
                    } else if ($scope.recmode == 0) {
                        $scope.filter.autorun = false;
                    }
                    if ($scope.recautorun === 1) {
                        $scope.filter.autorun = true;
                    } else if ($scope.recautorun == 0) {
                        $scope.filter.sleep = false;
                    }
                    $scope.$apply();
                    console.log('mode', $scope.recmode);
                    break;

            }
        }

        //****************************************************************************************//


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
                } else {
                    $scope.tempStatus.automode = false;
                    $scope.tempStatus.low = true;
                    $scope.settings.fan = "00";
                }
            }
            if (status == 'medium') {
                $scope.tempStatus.automode = false;
                $scope.tempStatus.high = false;
                if ($scope.tempStatus.medium === false) {
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = true;
                    $scope.settings.fan = "01";
                } else {
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = false;
                    $scope.settings.fan = "00";

                }
            }
            if (status == 'high') {

                $scope.tempStatus.automode = false;
                if ($scope.tempStatus.high === false) {
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = true;
                    $scope.tempStatus.high = true;
                    $scope.settings.fan = "02";
                } else {
                    $scope.tempStatus.high = false;
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = true;
                    $scope.settings.fan = "01";
                }
            }
            if (status === 'auto') {
                console.log('automode', $scope.tempStatus.automode);
                if ($scope.tempStatus.automode === true) {
                    $scope.tempStatus.low = false;
                    $scope.tempStatus.medium = false;
                    $scope.tempStatus.high = false;
                    $scope.settings.fan = "03";
                } else {
                    $scope.tempStatus.low = true;
                    $scope.tempStatus.medium = true;
                    $scope.tempStatus.high = true;
                    $scope.settings.fan = "02";
                }
            }
            var msg_str = $scope.settings.mode + $scope.settings.fan + $scope.settings.autorun;
            message = new Paho.MQTT.Message(msg_str);
            message.destinationName = "thermostat2/mode";
            client.send(message);
        };

        $scope.incrTemp = function() {
            console.log('inc1');
            if ($scope.setTempData.label >= 4 && $scope.setTempData.label < 30) {
                console.log('inc2');
                $scope.setTempData.label += 1;
                temp = $scope.setTempData.label;
                var msg_str = temp.toFixed(2);
                message = new Paho.MQTT.Message(msg_str);
                message.destinationName = "thermostat2/settemp";
                client.send(message);
            }

        };
        $scope.decrTemp = function() {
            console.log('dcr1');
            if ($scope.setTempData.label >= 5 && $scope.setTempData.label <= 30) {
                console.log('dcr2');
                $scope.setTempData.label -= 1;
                temp = $scope.setTempData.label;
                var msg_str = temp.toFixed(2);
                message = new Paho.MQTT.Message(msg_str);
                message.destinationName = "thermostat2/settemp";
                client.send(message);
            }

        };
        $scope.sleepToggle = function() {
            if ($scope.filter.sleep == true) {
                $scope.settings.mode = "01";
            } else if ($scope.filter.sleep == false) {
                $scope.settings.mode = "00";
            }
            var msg_str = $scope.settings.mode + $scope.settings.fan + $scope.settings.autorun;
            message = new Paho.MQTT.Message(msg_str);
            message.destinationName = "thermostat2/mode";
            client.send(message);
        };
        $scope.autorunToggle = function() {
            if ($scope.filter.autorun == true) {
                $scope.settings.autorun = "01";
            } else if ($scope.filter.autorun == false) {
                $scope.settings.autorun = "00";
            }
            var msg_str = $scope.settings.mode + $scope.settings.fan + $scope.settings.autorun;
            message = new Paho.MQTT.Message(msg_str);
            message.destinationName = "thermostat2/mode";
            client.send(message);

        };
        $scope.$watch('setTempData', function(newValue, oldValue) {
            newValue.percentage = newValue.label / 30;
        }, true);
        $scope.$watch('roomTempData', function(newValue, oldValue) {
            newValue.percentage = newValue.label / 3;
        }, true);
        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };
        $scope.setPlan = function() {
            $state.go('app.setplan');
        };

    }]);
