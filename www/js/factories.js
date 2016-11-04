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
                console.log('wifiData', wifiData);
                console.log(wifiData);
                return $http({
                    method: 'GET',
                    //url: "http://192.168.4.1/sensomate",
                    url: 'http://192.168.4.1/ssid=' + wifiData.wifi_name + '&password=' + encodeURIComponent(wifiData.wifi_password) + '&groupid=' + wifiData.groupId + '&thermostatid=' + wifiData.product_id + '&',
                    'Content-Type': 'application/x-www-form-urlencoded'
                });
            },
            checkWifi: function(wifiData) {
                return $http({
                    method: 'GET',
                    //url: "http://192.168.4.1/sensomate",
                    url: 'http://192.168.4.1/getdevicedetails',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    timeout: 5000

                });
            },
            readPwd: function(wifiData) {
                return $http({
                    method: 'GET',
                    //url: "http://192.168.4.1/sensomate",
                    url: 'http://192.168.4.1/testreaddevpwd',
                    timeout: 5000

                });
            },
            checkPassword: function(value) {
                return $http({
                    method: 'GET',
                    //url: "http://192.168.4.1/sensomate",
                    url: 'http://192.168.4.1/checkdevicepwd=' + encodeURIComponent(value) + '&',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    timeout: 5000

                });
            },
            changePassword: function(data) {
                return $http({
                    method: 'GET',
                    //url: "http://192.168.4.1/sensomate",
                    url: 'http://192.168.4.1/olddevicepwd=' + encodeURIComponent(data.old) + '&newdevicepwd=' + encodeURIComponent(data.new) + '&',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    timeout: 5000

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
            },
            getDeviceId: function(ip) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Getid',
                    'Content-Type': 'application/json'
                });
            },
            createNewPswd: function(ip, deviceid, defaultpwd, newpwd) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Deviceconfig?Deviceid=' + deviceid + '&Defaultdevicepassword=' + defaultpwd + '&Newdevicepassword=' + newpwd,
                    'Content-Type': 'application/json'
                });
            },
            connectOldDevice: function(ip, deviceid, oldpwd) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Deviceconfig?Deviceid=' + deviceid + '&Olddevicepassword=' + oldpwd,
                    'Content-Type': 'application/json'
                });
            },
            updatePwd: function(id, pwd) {
                return $http({
                    method: 'GET',
                    url: appConfig.baseUrl + 'product/changepassword/' + id + '/' + pwd,
                    'Content-Type': 'application/json'
                });
            },
            setTemp: function(ip, deviceid, pwd, temp) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Devicedata?Deviceid=' + deviceid + '&Devicepassword=' + pwd + "&Settemperature=" + temp,
                    'Content-Type': 'application/json'
                });
            },
            mode: function(ip, deviceid, pwd, mode, fan, autorun) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Devicedata?Deviceid=' + deviceid + '&Devicepassword=' + pwd + "&Mode=" + mode + "&Fan=" + fan + "&Autorun=" + autorun,
                    'Content-Type': 'application/json'
                });
            },
            onoff: function(ip, deviceid, pwd, onoff) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Devicedata?Deviceid=' + deviceid + '&Devicepassword=' + pwd + "&Onoff=" + onoff,
                    'Content-Type': 'application/json'
                });
            },
            currentStatus: function(ip, deviceid, pwd) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Devicedata?Deviceid=' + deviceid + '&Devicepassword=' + pwd + "&Getcurrentstatus=20",
                    'Content-Type': 'application/json'
                });
            },
            changePwd: function(ip, deviceid, oldvalue,value) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Deviceconfig?Deviceid=' + deviceid + '&Changedevicepassword='+oldvalue+"&Newdevicepassword="+value,
                    'Content-Type': 'application/json'
                });
            },

            weeklypgm: function(ip, deviceid, pwd,data) {
                return $http({
                    method: 'GET',
                    url: 'http://' + ip + '/Devicedata?Deviceid=' + deviceid + '&Devicepassword=' + pwd+'&' +data,
                    'Content-Type': 'application/json'
                });
            }

        };
    }])
    .factory('userFactory', ['$http', 'appConfig', function($http, appConfig) {
        'use strict';
        return {
            doLogin: function(loginDetails) {
                console.log('-------------------', loginDetails);
                return $http({
                    method: 'POST',
                    url: appConfig.baseUrl + 'user/auth',
                    data: loginDetails,
                });
            },
            signUp: function(registerDetails) {

                return $http({
                    method: 'POST',
                    url: appConfig.baseUrl + 'user/signup',
                    data: registerDetails,

                });
            }
        };
    }])
    .factory('userProductFactory', ['$http', 'appConfig', function($http, appConfig) {
        'use strict';
        return {
            assignProduct: function(Details) {
                console.log('-------------------', Details);
                return $http({
                    method: 'POST',
                    url: appConfig.baseUrl + 'userproduct/allocate',
                    data: Details,
                });
            },
            getAssignedProducts: function(id) {

                return $http({
                    method: 'GET',
                    url: appConfig.baseUrl + 'userproduct/' + id,
                });
            }
        };
    }]);
