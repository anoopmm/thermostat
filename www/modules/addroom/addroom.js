angular.module('thermostat.addroom', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.addroom', {
                url: '/addroom',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/addroom/addroom.html',
                        controller: 'addRoomCtrl'
                    }
                }
            })

    }])
    .controller('addRoomCtrl', ['$scope', '$ionicPopup', '$cordovaImagePicker', '$cordovaCamera', function($scope, $ionicPopup, $cordovaImagePicker, $cordovaCamera) {
        $scope.thermostats = [{
            thermostatId: 1,
            thermostatName: 'Thermostat1',

        }, {
            thermostatId: 2,
            thermostatName: 'Thermostat2',

        }];
        $scope.addRoomData = {
            thermostatId: '',
            imgURI: '',
            userName: ''
        }
        $scope.imgErrorMessgage = false;
        var myPopup;
        $scope.openPopUp = function() {
            myPopup = $ionicPopup.show({
                template: '<div class="popup-option" ng-click="captureImage()" >Take Photo</div><div ng-click="chooseImage()" class="popup-option" >Choose  from Gallery</div>',
                title: 'Add Photo',
                scope: $scope,
                buttons: [{
                    text: 'Cancel',
                    type: 'button-postive',
                }]
            });
        };
        $scope.chooseImage = function() {
            myPopup.close();
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 800,
                height: 800,
                quality: 80 // Higher is better
            };

            $cordovaImagePicker.getPictures(options).then(function(results) {
                // Loop through acquired images
                console.log('results', results);
                $scope.addRoomData.imgURI = results[0];
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error)); // In case of error
            });
        };
        $scope.captureImage = function() {

            myPopup.close();
            var options = {
                quality: 20,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                $scope.imageData = imageData;

                $scope.addRoomData.imgURI = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // An error occured. Show a message to the user
            });
        };
        $scope.addRoom = function(addForm) {
            console.log($scope.addRoomData);
            if ($scope.addRoomData.imgURI) {
                $scope.imgErrorMessgage = false;
                console.log('Add Room Data', $scope.addRoomData);
                $scope.addedRooms = $localstorage.getObject('addedRooms');
                console.log('addedRooms before adding a new room', $scope.addedRooms);
                $scope.addedRooms.push($scope.addRoomData);
                // $localstorage.setObject('addedRooms', $scope.addedRooms);
                console.log('addedRooms after adding a new room', $localstorage.getObject('addedRooms'));
            } else {
                $scope.imgErrorMessgage = true;
            }

        };



    }])
