angular.module('app',['smartTable'])

.controller('MainController',['$scope','$http','SmartTableParams','$timeout', function($scope,$http,SmartTableParams,$timeout){

	$scope.usersTable = null;
	$scope.searchParams = {id:null,name:null};
	$scope.searchModel = {id:null,name:null};
	$scope.selectedRows = [];
	$scope.message = '';
	$scope.loading = false;
	var timeoutPromise;

	$scope.apiUrlBasepath = 'http://localhost:9000/api/';

	$http({
		method:'GET',
		url:'metadata.json'
	}).then(function(response){
		$scope.usersTable = new SmartTableParams(response.data);
	});

	// $http({
	// 	method:'GET',
	// 	url:'demo-metadata.json'
	// }).then(function(response){
	// 	$scope.demoTable = new SmartTableParams(response.data);
	// });

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

	$scope.onUsersDataFetchStart = function(request){
		$scope.loading = true;
		// request.method = 'GET';
		// request.params = request.data;
		// delete request.data;
		request.headers = {header1:'header1'};
		return request;
	};

	$scope.onUsersDataFetchEnd = function(response,error){
		$scope.loading = false;
		console.log('end');
		if(error){
			console.log('error occurred : ');
			console.log(error);
		}else{
			// response.data.resultSet = response.data.data;
			// response.data.totalItems = response.data.total;
			// delete response.data.data;
			// delete response.data.total;
		}
		return response;
	};

	$scope.onUserAction = function(field,actionId,user){
		console.log(field);
		console.log(actionId);
		console.log(user);
		// $timeout.cancel(timeoutPromise);
		// if($scope.message){
		// 	$scope.message += ', ';
		// }
		// if(actionId===null){
		// 	$scope.message += 'User-'+user.id+' selected';	
		// }else{
		// 	$scope.message += 'Process-'+actionId+':User-'+user.id;	
		// }
		// timeoutPromise = $timeout(function(){
		// 	$scope.message = '';
		// },2000);
	};

}]);