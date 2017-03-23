(function(angular){
    'use strict'

    angular.module('smartTable',['ngTable'])

    .directive('smartTable',[function(){
        return {
            replace:true,
            scope:true,
            templateUrl:'smart-table/smart-table.html',
            controller:['$scope','$attrs',function($scope,$attrs){
                var params = null;
                var model = $scope.smartTableModel = {};
                var currentData = null;
                model.dataFetchStartCallbackString = $attrs.onFetchStart;
                model.dataFetchEndCallbackString = $attrs.onFetchEnd;
                model.rowSelectCallbackString = $attrs.onRowSelect;
                model.requestParamsString = $attrs.requestParams;
                model.selectedRowsObjectString = $attrs.selectedRows;
                model.sortParams = {sortColumn:null,sortOrder:null};
                model.selectedRows = [];
                model.selectPage = function (page) {
                    if (!!page && page.number && page.active) {
                        params.page(page.number);
                    }
                };
                model.previous = function (disableFlag) {
                    if(disableFlag)return;
                    var pagenumber = params.page() - 1;
                    params.page(pagenumber);
                };
                model.next = function (disableFlag) {
                    if(disableFlag)return;
                    var pagenumber = params.page() + 1;
                    params.page(pagenumber);
                };
                model.resetSelectedRows = function(){
                    currentData.forEach(function(datum){
                        datum._isSelected = false;
                    });
                };
                model.selectAllRows = function(){
                    currentData.forEach(function(datum){
                        datum._isSelected = true;
                    });
                };
                model.onSelectAllClick = function(event){
                    if(event.target.checked){
                        model.selectAllRows();
                    }else{
                        model.resetSelectedRows();
                    }
                    model.updateSelectedRows();
                };
                model.updateSelectedRows = function(){
                    var selectedRows = currentData.filter(function(datum){return datum._isSelected;});
                    if(selectedRows.length === currentData.length){
                        model.allRowsSelected = true;
                    }else{
                        model.allRowsSelected = false;
                    }
                    var rowSelectCallback = $scope.$eval(model.rowSelectCallbackString);
                    if(rowSelectCallback && typeof rowSelectCallback === 'function'){
                        if(!currentData){
                            rowSelectCallback(null);
                        }else{
                            rowSelectCallback(selectedRows);
                        }
                    }
                };
                $scope.$watch($attrs.smartTable,function(_params){
                    if(!_params)return;
                    params = $scope.ngTableParamsObject = _params;
                    model.paginationTitleTemplate = _params.$params.paginationTitleTemplate || 'Showing {FROM} to {TO} of {TOTAL}';
                    model.noRecordsMessage = _params.$params.noRecordsMessage || 'No records to show.';
                    model.loadingMessage = _params.$params.loadingMessage || 'Loading data';
                });
   	            $scope.$on('ngTableAfterReloadData', function(event){
                    if(!params)return;
                    model.pages = params.generatePagesArray(params.page(), params.total(), params.count());
                    model.numPages = Math.ceil(params.total() / params.count());
   	                var from = (params.page() - 1) * params.count() + 1;
   	                var to = params.page() * params.count();
   	                if (to > params.total()) {
   	                    to = params.total();
   	                }
   	                model.paginationTitle = model.paginationTitleTemplate
					   .replace('{FROM}', from)
					   .replace('{TO}', to)
					   .replace('{TOTAL}', params.total());
                    currentData = event.targetScope.$data;
                    if(currentData){
                        model.resetSelectedRows();
                    }
                    model.updateSelectedRows();
                    model.allRowsSelected = false;
   	            });
            }]
        };
    }])

    .factory('SmartTableParams',['$http','ngTableParams',function($http,ngTableParams){
        return function(parameters,settings){
            var params = null;
            var cachedResponse = null;
            var currentSortColumn = null;
            var _scope = null;
            var model = null;
            var ngTableResetAndReload = null;
            var postData = null;
            var getServerData = function($defer,_params){
                _scope = params.settings().$scope;
                model = _scope.smartTableModel;
                // TODO:
                // _scope.$watch('$data',function(data){
                //     console.log('data');
                // });
                var requestParams = _scope.$eval(model.requestParamsString);
                var dataFetchStartCallback = _scope.$eval(model.dataFetchStartCallbackString);
                var dataFetchEndCallback = _scope.$eval(model.dataFetchEndCallbackString);
                postData = Object.assign({},requestParams,model.sortParams);
                if(params.$params.paginate){
                    postData = Object.assign(postData,_params.pagerData,{pageSize:params.$params.count});
                }
                model.loading = true;
                if(dataFetchStartCallback && typeof dataFetchStartCallback === 'function'){
                    dataFetchStartCallback($defer,_params);
                }
                $http({
                    method:'POST',
                    url:parameters.apiUrl,
                    data:postData
                }).then(function(response){
                    cachedResponse = response.data;
                    $defer.resolve(response.data,_params);
                    if(dataFetchEndCallback && typeof dataFetchEndCallback === 'function'){
                        dataFetchEndCallback(response.data,_params);
                    }
                    model.loading = false;
                },function(error){
                    console.log('SMART-TABLE - Error occurred while fetching data.');
                    console.log(error);
                    if(dataFetchEndCallback && typeof dataFetchEndCallback === 'function'){
                        dataFetchEndCallback(null,_params,error);
                    }
                    model.loading = false;
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
                model.sortParams.sortColumn = column;
                if(model.sortParams.sortColumn === currentSortColumn){
                    model.sortParams.sortOrder = model.sortParams.sortOrder==='asc' ? 'desc' : 'asc';
                }else{
                    model.sortParams.sortOrder = 'asc';
                    currentSortColumn = model.sortParams.sortColumn;
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
                model.sortParams = {sortColumn:null,sortOrder:null};
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
