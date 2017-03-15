(function(angular){
    'use strict'

    angular.module('smartTable',['ngTable'])

    .directive('smartTable',[function(){
        return {
            replace:true,
            templateUrl:'smart-table/smart-table.html',
            controller:['$scope','$attrs',function($scope,$attrs){
                var params;
				var paginationTitle = '';
                $scope.$watch($attrs.smartTable,function(_params){
                    if(_params){
                        $scope.ngTableParamsObject = params = _params;
                        paginationTitle = params.$params.paginationTitleTemplate || 'Showing {FROM} to {TO} of {TOTAL}'; 
                        if($attrs.onDataFetch && !params.$params.onDataFetch){
                            params.$params.onDataFetch = $scope.$eval($attrs.onDataFetch);
                        }
                    }
                });
   	            $scope.$on('ngTableAfterReloadData', function(){
					if(params){
						$scope.pages = params.generatePagesArray(params.page(), params.total(), params.count());
						$scope.numPages = Math.ceil(params.total() / params.count());
						updatePaginationTitle();
					}
   	            }, true);
   	            $scope.selectPage = function (page) {
   	                if (!!page && page.number && page.active) {
   	                    params.page(page.number);
   	                }
   	            };
   	            $scope.previous = function (disableFlag) {
   	                if (!disableFlag) {
   	                    var pagenumber = $scope.ngTableParamsObject.page() - 1;
   	                    $scope.ngTableParamsObject.page(pagenumber);
   	                }
   	            };
   	            $scope.next = function (disableFlag) {
   	                if (!disableFlag) {
   	                    var pagenumber = $scope.ngTableParamsObject.page() + 1;
   	                    $scope.ngTableParamsObject.page(pagenumber);
   	                }
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
            var cachedResponse = null;
            var params = null;
            var ngTableResetAndReload = null;
            var getServerData = function($defer,_params){
                $http({
                    method:'GET',
                    url:parameters.apiUrl,
                    params:{
                        startPage : _params.pagerData.startPage,
                        endPage : _params.pagerData.endPage,
                        pageSize : params.$params.count
                    }
                }).then(function(response){
                    cachedResponse = response.data;
                    if(params.$params.onDataFetch && typeof params.$params.onDataFetch === 'function'){
                        params.$params.onDataFetch(response.data,_params);
                    }
                    $defer.resolve(response.data,_params);
                });                
            };
            var getCachedData = function($defer,params){
                if(cachedResponse){
                    $defer.resolve(cachedResponse,params);
                }else{
                    getServerData($defer,params);
                }
            };
            settings = settings || {};
            settings.getServerData = settings.getServerData || getServerData;
            settings.getCachedData = settings.getCachedData || getCachedData;
            settings.getData = settings.getData || getCachedData;
            if(!parameters.pagination){
                parameters.paginate = false;
            }else{
                for (var property in parameters.pagination) {
                    if(parameters.pagination.hasOwnProperty(property)){
                        parameters[property] = parameters.pagination[property]; 
                    }
                }
                parameters.paginate = true;            
            }
            delete parameters.pagination;
            params = new ngTableParams(parameters,settings);
            ngTableResetAndReload = params.resetAndReload;
            params.resetAndReload = function(){
                cachedResponse = null;
                ngTableResetAndReload();
            };
            return params;
        };
    }]);

})(angular);