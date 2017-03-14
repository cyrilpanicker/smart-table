angular.module('app',['smartTable'])

.controller('MainController',['$scope','$http','SmartTableParams', function($scope,$http,SmartTableParams){

    $http({
        method:'GET',
        url:'/data/metadata.json'
    }).then(function(response){
        $scope.usersTable = new SmartTableParams(response.data);
    });

}]);