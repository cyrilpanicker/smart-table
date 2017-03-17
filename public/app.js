angular.module('app',['smartTable'])

.controller('MainController',['$scope','$http','SmartTableParams','$interval', function($scope,$http,SmartTableParams,$interval){

	$scope.usersTable = null;
	$scope.searchParams = {id:null,name:null};
	$scope.searchModel = {id:null,name:null};
	var intervalPromise = null;

	$http({
		method:'GET',
		url:'/metadata.json'
	}).then(function(response){
		$scope.usersTable = new SmartTableParams(response.data);
	});

	$scope.onSearch = function(searchModel){
		$scope.searchParams = angular.copy($scope.searchModel);
		$scope.usersTable.resetAndReload();
	};

	$scope.onReset = function(){
		$scope.searchModel = {id:null,name:null};
		$scope.searchParams = {id:null,name:null};
		$scope.usersTable.resetAndReload();
	};

	$scope.onUsersDataFetchStart = function(){
		$scope.message = 'Fetching data';
		intervalPromise = $interval(function(){
			$scope.message = $scope.message+'.';
		},100);
	};

	$scope.onUsersDataFetchEnd = function(){
		$scope.message = '';
		if(intervalPromise){
			$interval.cancel(intervalPromise);
		}
	};

	$scope.onUsersDataFetch = function(data,params){
		console.log('---------------');
		console.log('data fetched');
		console.log(data);
		console.log(params);
		console.log('---------------');
	};

}]);