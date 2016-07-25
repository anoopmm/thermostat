angular.module('thermostat.factories', [])
    .factory('$localStorage', ['$window', function($window) {
        'use strict';
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return JSON.parse($window.localStorage[key] || '{}');
            },
            remove: function(key) {
                delete $window.localStorage[key];
            }
        };
    }])
    .factory('thermostatFactory', ['$http', 'appConfig', function($http, appConfig) {
        'use strict';
        return {
            connectWifi: function(wifiData) {
                console.log('http://192.168.4.1/ssid=' + wifiData.uname + '&password=' + wifiData.pwd + '&groupid=sensomate1&thermostatid=thermostat2&');
                return $http({
                    method: 'GET',
                    //url: "http://192.168.4.1/sensomate",
                    url: 'http://192.168.4.1/ssid=' + wifiData.uname + '&password=' + wifiData.pwd + '&groupid=sensomate1&thermostatid=thermostat2&',
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
            },
            getAll: function() {
                return $http({
                    method: 'GET',
                    url: appConfig.baseUrl1,
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
            },
            getRoomById: function(roomId) {
                return $http({
                    method: 'GET',
                    url: appConfig.baseUrl1 + roomId,
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
            },
            updateRoom: function(tempSetPoint, ahu_control) {

                console.log('tempSetPoint', tempSetPoint);
                console.log('ahu_control', ahu_control);
                return $http({
                    method: 'POST',
                    url: appConfig.baseUrl2,
                    data: {
                        tempSetPoint: tempSetPoint,
                        ahu_control: ahu_control
                    },
                    'Content-Type': 'application/json'
                });
            },
            changeSetTemp: function(roomId, TemperatureSetPoint) {
                return $http({
                    method: 'POST',
                    url: appConfig.baseUrl1 + roomId,
                    data: {
                        TemperatureSetPoint: TemperatureSetPoint
                    },
                    'Content-Type': 'application/json'
                });
            }

        };
    }])
    .factory('userFactory', ['$http', 'appConfig', function($http, appConfig) {
        'use strict';
        return {
            doLogin: function(loginDetails) {
                var data = {
                    "pass": loginDetails.password,
                    "phone_number": loginDetails.phoneNumber,

                }
                return $http({
                    method: 'POST',
                    url: appConfig.baseUrl + 'rpc/login',
                    data: data,
                    'Content-Type': 'application/json'
                });
            },
            signUp: function(registerDetails) {

                return $http({
                    method: 'POST',
                    url: appConfig.baseUrl + 'rpc/signup',
                    data: registerDetails,

                });
            },
            getProfileDetails: function(phoneNumberDetails) {
                console.log('phoneNumberDetails', phoneNumberDetails);
                return $http({
                    method: 'POST',
                    url: appConfig.baseUrl + 'rpc/get_profile',
                    headers: {
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    data: phoneNumberDetails

                });
            }
        };
    }])
