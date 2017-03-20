(function(angular){
    'use strict'

    angular.module('smartTable',['ngTable'])

    .directive('smartTable',[function(){
        return {
            replace:true,
            scope:true,
            templateUrl:'smart-table/smart-table.html',
            controller:['$scope','$attrs',function($scope,$attrs){
                var params;
				var paginationTitle = '';
                $scope.$watch($attrs.smartTable,function(_params){
                    if(!_params)return;
                    $scope.ngTableParamsObject = params = _params;
                    paginationTitle = params.$params.paginationTitleTemplate || 'Showing {FROM} to {TO} of {TOTAL}'; 
                    if($attrs.smartTableDataFetchStartCallback && !params.$params.dataFetchStartCallback){
                        params.$params.dataFetchStartCallback = $attrs.smartTableDataFetchStartCallback;
                    }
                    if($attrs.smartTableDataFetchEndCallback && !params.$params.dataFetchEndCallback){
                        params.$params.dataFetchEndCallback = $attrs.smartTableDataFetchEndCallback;
                    }
                    if($attrs.smartTableRequestParams && !params.$params.requestParams){
                        params.$params.requestParams = $attrs.smartTableRequestParams;
                    }
                });
   	            $scope.$on('ngTableAfterReloadData', function(){
                    if(!params)return;
                    $scope.pages = params.generatePagesArray(params.page(), params.total(), params.count());
                    $scope.numPages = Math.ceil(params.total() / params.count());
                    updatePaginationTitle();
   	            });
   	            $scope.selectPage = function (page) {
   	                if (!!page && page.number && page.active) {
   	                    params.page(page.number);
   	                }
   	            };
   	            $scope.previous = function (disableFlag) {
					if(disableFlag)return;
					var pagenumber = $scope.ngTableParamsObject.page() - 1;
					$scope.ngTableParamsObject.page(pagenumber);
   	            };
   	            $scope.next = function (disableFlag) {
					if(disableFlag)return;
					var pagenumber = $scope.ngTableParamsObject.page() + 1;
					$scope.ngTableParamsObject.page(pagenumber);
   	            };
   	            var updatePaginationTitle = function () {
   	                var from = (params.page() - 1) * params.count() + 1;
   	                var to = params.page() * params.count();
   	                if (to > params.total()) {
   	                    to = params.total();
   	                }
   	                $scope.paginationTitle = paginationTitle
					   .replace('{FROM}', from)
					   .replace('{TO}', to)
					   .replace('{TOTAL}', params.total());
   	            };
            }]
        };
    }])

    .factory('SmartTableParams',['$http','ngTableParams',function($http,ngTableParams){
        return function(parameters,settings){
            var params = null;
            var cachedResponse = null;
            var ngTableResetAndReload = null;
            var sortParams = {sortColumn:null,sortOrder:null};
            var currentSortColumn = null;
            var pagerParams = {};
            var getServerData = function($defer,_params){
                var directiveScope = params.settings().$scope;
                var requestParams = directiveScope.$eval(params.$params.requestParams);
                var dataFetchStartCallback = directiveScope.$eval(params.$params.dataFetchStartCallback);
                var dataFetchEndCallback = directiveScope.$eval(params.$params.dataFetchEndCallback);
                pagerParams.startPage = _params.pagerData.startPage;
                pagerParams.endPage = _params.pagerData.endPage;
                pagerParams.pageSize = params.$params.count;
                if(dataFetchStartCallback && typeof dataFetchStartCallback === 'function'){
                    dataFetchStartCallback($defer,_params);
                }
                $http({
                    method:'POST',
                    url:parameters.apiUrl,
                    data:Object.assign({},requestParams,sortParams,pagerParams)
                }).then(function(response){
                    cachedResponse = response.data;
                    if(dataFetchEndCallback && typeof dataFetchEndCallback === 'function'){
                        dataFetchEndCallback(response.data,_params);
                    }
                    $defer.resolve(response.data,_params);
                },function(error){
                    console.log('SMART-TABLE - Error occurred while fetching data.');
                    console.log(error);
                    if(dataFetchEndCallback && typeof dataFetchEndCallback === 'function'){
                        dataFetchEndCallback(null,_params,error);
                    }
                });                
            };
            var getCachedData = function($defer,params){
                if(cachedResponse){
                    $defer.resolve(cachedResponse,params);
                }else{
                    getServerData($defer,params);
                }
            };
            var serverSortBy = function(column){
                sortParams.sortColumn = column;
                if(sortParams.sortColumn === currentSortColumn){
                    sortParams.sortOrder = sortParams.sortOrder==='asc' ? 'desc' : 'asc';
                }else{
                    sortParams.sortOrder = 'asc';
                    currentSortColumn = sortParams.sortColumn;
                }
                params.resetAndReload(true);
            };
            settings = settings || {};
            settings.getServerData = settings.getServerData || getServerData;
            settings.getCachedData = settings.getCachedData || getCachedData;
            settings.getData = settings.getData || getCachedData;
            settings.serverSortBy = settings.serverSortBy || serverSortBy;
            params = new ngTableParams(parameters,settings);
            ngTableResetAndReload = params.resetAndReload;
            params.resetAndReload = function(retainSort){
                if(!retainSort){
                    params.resetSorting();
                }
                params.resetCachedResponse();
                ngTableResetAndReload();
            };
            params.resetSorting = function(reload){
                sortParams = {sortColumn:null,sortOrder:null};
            };
            params.resetCachedResponse = function(){
                cachedResponse = null;
            };
            return params;
        };
    }]);

})(angular);


if (typeof Object.assign != 'function') {
    Object.assign = function(target, varArgs) {
        'use strict';
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var to = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];
            if (nextSource != null) {
                for (var nextKey in nextSource) {
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                    	to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}
