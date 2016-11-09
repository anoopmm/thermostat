angular.module('thermostat.profile', ['ionic'])
    .config(['$stateProvider', function($stateProvider) {
        'use strict';
        $stateProvider
            .state('app.profile', {
                url: '/profile',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/profile/profile.html',
                        controller: 'profileCtrl'
                    }
                }
            })

    }])
    .controller('profileCtrl', ['$scope', '$state', '$ionicPopup', '$cordovaImagePicker', '$cordovaCamera', function($scope, $state, $ionicPopup, $cordovaImagePicker, $cordovaCamera) {

        $scope.openAddRoom = function() {
            $state.go('app.addroom');
        };

        $scope.edit = function(index) {
            // Triggered on a button click, or some other target
            $scope.data = {};
            $scope.profile = {};
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                template: '<div class="popup-option" ng-click="captureImage()" >Take Photo</div><div ng-click="chooseImage()" class="popup-option" >Choose  from Gallery</div>',
                title: 'Enter new room name',
                subTitle: '',
                scope: $scope,
                buttons: [
                    { text: 'Cancel' }, {
                        text: '<b>Save</b>',
                        type: 'button-positive',
                        onTap: function(e) {
                            if (!$scope.data.wifi) {
                                //don't allow the user to close unless he enters wifi password
                                e.preventDefault();
                            } else {
                                $scope.items[index].RoomName = $scope.data.wifi;
                                return $scope.data.wifi;
                            }
                        }
                    }
                ]
            });

            myPopup.then(function(res) {
                console.log('Tapped!', res);
            });


            $scope.chooseImage = function() {
                myPopup.close();
                // Image picker will load images according to these settings
                var options = {
                    maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                    width: 400,
                    height: 400,
                    quality: 80 // Higher is better
                };

                $cordovaImagePicker.getPictures(options).then(function(results) {
                    // Loop through acquired images
                    console.log('results', results);
                    $scope.profile.imgURI = results[0];
                }, function(error) {
                    console.log('Error: ' + JSON.stringify(error)); // In case of error
                });
            };
            $scope.captureImage = function() {

                myPopup.close();
                var options = {
                    quality: 50,
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

                    $scope.profile.imgURI = "data:image/jpeg;base64," + imageData;
                }, function(err) {
                    // An error occured. Show a message to the user
                });
            };

            // $timeout(function() {
            //     myPopup.close(); //close the popup after 3 seconds for some reason
            // }, 8000);
        };

    }])
