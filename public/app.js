angular.module('app',['smartTable'])

.controller('MainController',['$scope','$http','SmartTableParams','$timeout', function($scope,$http,SmartTableParams,$timeout){

	$http({
		method:'GET',
		url:'/metadata.json'
	}).then(function(response){
		$scope.usersTable = new SmartTableParams(response.data);
	});

	// $scope.onUsersDataFetch = function(data,params){
	// 	console.log('---------------');
	// 	console.log('data fetched');
	// 	console.log(data);
	// 	console.log(params);
	// 	console.log('---------------');
	// };

	// $scope.searchParams = {
	// 	a:['asd','asd']
	// };

	// $timeout(function(){
	// 	$scope.searchParams.a={b:['edg','asd']};
	// 	$scope.searchParams.b=[1,2,3];
	// },5000);

}]);