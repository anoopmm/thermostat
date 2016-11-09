// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic',
        'ngCordova',
        'ngMessages',
        'pascalprecht.translate',
        'starter.controllers',
        'thermostat.factories',
        'thermostat.filters',
        'thermostat.menu',
        'thermostat.login',
        'thermostat.selectroom',
        'thermostat.roomdetails',
        'thermostat.addroom',
        'thermostat.configwifi',
        'thermostat.profile',
        'thermostat.registration',
        'ionic-timepicker',
        'thermostat.plan',
        'angular-svg-round-progressbar',
        'thermostat.checkpassword',
        'thermostat.settings',
        'thermostat.weeklyplan',
        'thermostat.esptouch',
        'thermostat.createpassword',
        'chart.js',
        'tabSlideBox'
    ])
    .constant('appConfig', {
        baseUrl: 'http://thermostat.hospifi.co/api/v1/',
        baseUrl2: 'http://api.insmonitor.hospifi.co/ahu/deviceupdate/11/'
    })
    .run(function($ionicPlatform, $rootScope) {
        $rootScope.appSettings = {
            temperatureUnits: 'degree',
            language: 'en'
        };
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            // if (window.cordova && window.cordova.plugins.Keyboard) {
            //     cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            //     cordova.plugins.Keyboard.disableScroll(true);

            // }
            if (window.cordova) {
                setTimeout(function() {
                    navigator.splashscreen.hide();
                }, 1);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

.config(function($stateProvider, $urlRouterProvider, $translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage("en");
    $translateProvider.useSanitizeValueStrategy('escaped');
    $translateProvider.fallbackLanguage("en");
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'modules/menu/menu.html',
        controller: 'menuCtrl'
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise(function() {
        if (window.localStorage.getItem('userdetails')) {
            return 'app/selectroom'
        } else {
            return '/login'
        }
    });
});
