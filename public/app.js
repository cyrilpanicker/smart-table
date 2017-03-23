angular.module('app',['smartTable'])

.controller('MainController',['$scope','$http','SmartTableParams','$interval', function($scope,$http,SmartTableParams,$interval){

	$scope.usersTable = null;
	$scope.searchParams = {id:null,name:null};
	$scope.searchModel = {id:null,name:null};
	$scope.selectedRows = [];
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

	$scope.onRowSelect = function(rows){
		$scope.selectedRows = rows;
	};

	$scope.onUsersDataFetchStart = function(){
		console.log('start');
	};

	$scope.onUsersDataFetchEnd = function(){
		console.log('end');
	};

}]);