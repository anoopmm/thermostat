angular.module('thermostat.filters', [])
    .filter('celsius', [function() {
        return function(celsius) {
            if (celsius === undefined || celsius === null) {
                return '';
            }
            return celsius;
        };
    }])
    .filter('fahrenheit', [function() {
        return function(celsius) {
            if (celsius === undefined || celsius === null) {
                return '';
            }
            var farenheit = celsius * 1.8 + 32;
            return farenheit;
        };
    }]);
