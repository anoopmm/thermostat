angular.module('thermostat.menu', [])

.controller('menuCtrl', ['$scope', '$translate', '$ionicPopup', '$state', function($scope, $translate, $ionicPopup, $state) {

    $scope.flagOptions = false;
    $scope.flagLanguages = false;
    $scope.showOptions = function() {
        $scope.flagOptions = !$scope.flagOptions;
    }
    $scope.showLanguages = function() {
        $scope.flagLanguages = !$scope.flagLanguages;
        $scope.languages = [{
            "name": "English",
            "code": "en"

        }, {
            "name": "Spanish",
            "code": "es"

        }];
        console.log('languages', $scope.languages);
    };
    $scope.changeLanguage = function(language) {
        $translate.use(language);
        console.log(language);

    };
    $scope.logOut = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Logout',
            template: 'Are you sure?',
            buttons: [{
                text: 'CANCEL',
            }, {
                text: 'YES',
                type: 'button-assertive',
                onTap: function() {
                    $state.go('login');

                }
            }]

        });

        confirmPopup.then(function() {

        });
    };
}])
