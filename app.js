angular.module('app',['smartTable'])

.controller('MainController',['$scope','SmartTableParams', function($scope,SmartTableParams){

    var columns = [
        { title: 'ID', field: 'id'},
        { title: 'Name', field: 'name'}
    ];

    $scope.usersTable = new SmartTableParams({
        columns:columns,
        apiUrl:'/data/users.json',
        pagination:{
            test:'test'
        }
    });

}]);