angular.module('app',['smartTable'])

.controller('MainController',['$scope','$http','SmartTableParams','$timeout', function($scope,$http,SmartTableParams,$timeout){

	$scope.usersTable = null;
	$scope.searchParams = {id:null,name:null};
	$scope.searchModel = {id:null,name:null};
	$scope.selectedRows = [];

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
		$scope.selectedRows = rows.map(function(row){return row.id;});
	};

	$scope.onUsersDataFetchStart = function(){
		console.log('start');
	};

	$scope.onUsersDataFetchEnd = function(){
		console.log('end');
	};

	$scope.onUserAction = function(actionId,user){
		$scope.message = 'Process-'+actionId+' selected for user with ID '+user.id;
		$timeout(function(){
			$scope.message = null;
		},2000);
	};

}]);