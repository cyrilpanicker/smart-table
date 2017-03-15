angular.module('app',['smartTable'])

.controller('MainController',['$scope','$http','SmartTableParams', function($scope,$http,SmartTableParams){

	$http({
		method:'GET',
		url:'/metadata.json'
	}).then(function(response){
		$scope.usersTable = new SmartTableParams(response.data);
	});

	$scope.onUsersDataFetch = function(data,params){
		console.log('data fetched');
		console.log(data);
		console.log(params);
	};

}]);