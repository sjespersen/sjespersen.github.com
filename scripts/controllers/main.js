'use strict';

var app = angular.module('sjespersen.github.comApp');

app.controller('MainCtrl', function ($scope, photoData) {

    $scope.photos = [];
    $scope.items = [];

    photoData.getAllItems().then(function (data) {
        var parsedData = angular.fromJson(data);
        $scope.items = parsedData.photoset.photo;
        var length = $scope.items.length+1;
        var width = parseInt($scope.items[0].width_z)+10;
        $('#content').css('width',length*width+"px")
    },
    function (errorMessage) {
        $scope.error = errorMessage;
    });
});

app.config(function ($httpProvider) {
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

app.factory('photoData', function ($http, $q) {
    return {
        getAllItems: function () {
            //Creating a deferred object
            var deferred = $q.defer();

            var apiUrl = 'http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=cbc7794d9c70c9c2a7d697ee9761366e&format=json&photoset_id=72157637290722265&extras=tags,url_z&nojsoncallback=1';

            //Calling Web API to fetch pics
            $http.get(apiUrl).success(function (data) {
                //Passing data to deferred's resolve function on successful completion
                deferred.resolve(data);
            }).error(function (error) {
                //Sending a friendly error message in case of failure
                deferred.reject("An error occured while fetching items");
            });
            //Returning the promise object
            return deferred.promise;
        }
    }
})
