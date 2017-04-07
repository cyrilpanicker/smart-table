(function(angular){
    'use strict'

    angular.module('smartTable',['ngTable'])

    .directive('smartTable',[function(){
        return {
            replace:true,
            scope:true,
            templateUrl:'smart-table/smart-table.html',
            controller:['$scope','$attrs','$element',function($scope,$attrs,$element){
                var params = null;
                var model = $scope.smartTableModel = {};
                var currentData = null;
                var selectAllCheckBox = $element.find('#selectAllCheckBox')[0];
                model.dataFetchStartCallbackString = $attrs.onFetchStart;
                model.dataFetchEndCallbackString = $attrs.onFetchEnd;
                model.rowSelectCallbackString = $attrs.onRowSelect;
                model.onActionCallbackString = $attrs.onAction;
                model.requestParamsString = $attrs.requestParams;
                model.currentSortColumn = null;
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
                var resetSelectedRows = function(){
                    if(!currentData)return;
                    currentData.forEach(function(datum){
                        datum._isSelected = false;
                    });
                };
                var selectAllRows = function(){
                    if(!currentData)return;
                    currentData.forEach(function(datum){
                        datum._isSelected = true;
                    });
                };
                model.onSelectAllClick = function(event){
                    if(event.target.checked){
                        selectAllRows();
                    }else{
                        resetSelectedRows();
                    }
                    model.updateSelectedRows();
                };
                model.updateSelectedRows = function(){
                    if(!currentData)return;
                    var selectedRows = currentData.filter(function(datum){return datum._isSelected;});
                    if(selectedRows.length === currentData.length){
                        angular.element(selectAllCheckBox).prop('indeterminate',false);
                        if(currentData.length){
                            model.allRowsSelected = true;
                        }
                    }else{
                        if(selectedRows.length!==0){
                            angular.element(selectAllCheckBox).prop('indeterminate',true);
                        }else{
                            angular.element(selectAllCheckBox).prop('indeterminate',false);
                        }
                        model.allRowsSelected = false;
                    }
                    var rowSelectCallback = $scope.$eval(model.rowSelectCallbackString);
                    if(rowSelectCallback && typeof rowSelectCallback === 'function'){
                        rowSelectCallback(selectedRows.map(function(_row){
                            var row = angular.copy(_row);
                            delete row._isSelected;
                            return row;
                        }));
                    }
                };
                model.onAction = function(actionId,datum){
                    var onAction = $scope.$eval(model.onActionCallbackString);
                    if(onAction && typeof onAction === 'function'){
                        onAction(actionId,datum);
                    }
                };
                $scope.$watch($attrs.smartTable,function(_params){
                    if(!_params)return;
                    params = $scope.ngTableParamsObject = _params;
                    model.paginationTitleTemplate = _params.$params.paginationTitleTemplate || 'Showing {FROM} to {TO} of {TOTAL}';
                    model.noRecordsMessage = _params.$params.noRecordsMessage || 'No records to show.';
                    model.loadingMessage = _params.$params.loadingMessage || 'Loading data';
                    model.defaultSortParams = {sortColumn:null,sortOrder:null};
                    for(var i=0;i<_params.$params.columns.length;i++){
                        if(_params.$params.columns[i].defaultSortOrder){
                            model.currentSortColumn = _params.$params.columns[i].field;
                            model.defaultSortParams.sortColumn = _params.$params.columns[i].field;
                            model.defaultSortParams.sortOrder = _params.$params.columns[i].defaultSortOrder;
                            model.sortParams = angular.copy(model.defaultSortParams);
                            break;
                        }
                    }
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
                    if(params.$params.rowSelectable){
                        currentData = event.targetScope.$data;
                        resetSelectedRows();
                        model.updateSelectedRows();
                    }
   	            });
            }]
        };
    }])

    .factory('SmartTableParams',['$http','ngTableParams',function($http,ngTableParams){
        return function(parameters,settings){
            var params = null;
            var cachedResponse = null;
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
                if(model.sortParams.sortColumn === model.currentSortColumn){
                    model.sortParams.sortOrder = model.sortParams.sortOrder==='asc' ? 'desc' : 'asc';
                }else{
                    model.sortParams.sortOrder = 'asc';
                    model.currentSortColumn = model.sortParams.sortColumn;
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
                model.sortParams = angular.copy(model.defaultSortParams);
            };
            params.resetCachedResponse = function(){
                cachedResponse = null;
            };
            return params;
        };
    }])

    .run(['$templateCache',function($templateCache){
        $templateCache.put('smart-table/smart-table-pagination.html','<nav ng-init="params=ngTableParamsObject;model=smartTableModel"> <p ng-show="params.total()">{{model.paginationTitle}}</p><ul ng-show="params.total()"> <li class="previous" ng-class="{\'disabled\': params.page()===1}"> <a href="" ng-click="model.previous(params.page()===1)"> <span>« PREV</span> </a> </li><li ng-class="{\'selected\': params.page()==page.number}" ng-repeat="page in model.pages"> <a href="" ng-click="model.selectPage(page)"> <span ng-bind="page.number"></span> </a> </li><li class="next" ng-class="{\'disabled\': params.page()===model.numPages}"> <a href="" ng-click="model.next(params.page()===model.numPages)"> <span>NEXT »</span> </a> </li></ul></nav>');
        $templateCache.put('smart-table/smart-table.html','<div class="smart-table" ng-init="model=smartTableModel"> <div class="top-pagination" ng-if="ngTableParamsObject.$params.paginate" ng-include="\'smart-table/smart-table-pagination.html\'" > </div><table ng-table="ngTableParamsObject"> <thead> <tr> <th class="row-select" ng-show="params.$params.rowSelectable" ng-style="{\'width\':params.$params.rowSelectorColumnWidth+\'%\'}"> <input id="selectAllCheckBox" type="checkbox" ng-checked="model.allRowsSelected" ng-click="model.onSelectAllClick($event)"/> </th> <th ng-repeat="col in params.$params.columns" ng-click="col.sortable && params.serverSortBy(col.field)" ng-class="{\'sortable\':col.sortable, \'sort-asc\':model.sortParams.sortColumn===col.field && model.sortParams.sortOrder===\'asc\', \'sort-desc\':model.sortParams.sortColumn===col.field && model.sortParams.sortOrder===\'desc\'}" ng-style="{\'width\':col.width+\'%\'}" > <div ng-bind="col.title"></div></th> </tr></thead> <tbody> <tr ng-repeat="datum in $data" ng-show="!model.loading && $data.length"> <td class="row-select" ng-show="params.$params.rowSelectable"> <input type="checkbox" ng-model="datum._isSelected" ng-click="model.updateSelectedRows()"/> </td><td ng-repeat="col in params.$params.columns"> <div class="marker-container"> <div class="marker-group" ng-repeat="markerGroup in col.markers"> <img class="marker-image" ng-repeat="marker in markerGroup" ng-show="datum[marker.property]" ng-src="{{marker.imageUrl}}"/> </div></div><div class="field-container"> <a href="" ng-show="col.isFieldActionable" ng-click="model.onAction(null,datum)" ng-bind="!datum[col.field] ? ((datum[col.field]===0||datum[col.field]===false) ? datum[col.field] : col.defaultText) : datum[col.field]"></a> <span ng-show="!col.isFieldActionable" ng-bind="!datum[col.field] ? ((datum[col.field]===0||datum[col.field]===false) ? datum[col.field] : col.defaultText) : datum[col.field]"></span> </div><div ng-show="col.infoColumns.length" smart-table-tooltip-wrapper class="info-columns-container tooltip-wrapper{{col.infoTooltipPosition ? \' \'+col.infoTooltipPosition : \' left\'}}"> <a href="" class="info-icon"></a> <div class="tooltip-container"> <div class="tooltip-content"> <span ng-repeat="innerCol in col.infoColumns"> <span class="title" ng-bind="innerCol.title"></span> : <span ng-bind="!datum[innerCol.field] ? ((datum[innerCol.field]===0||datum[innerCol.field]===false) ? datum[innerCol.field] : innerCol.defaultText) : datum[innerCol.field]"></span> <br/> </span> </div></div></div><div class="actions-container"> <a ng-repeat="action in col.actions" ng-class="{\'image-link\':action.imageUrl}" href="" ng-click="model.onAction(action.id,datum)"> <span ng-show="!action.imageUrl" ng-bind="action.text"></span> <img ng-show="action.imageUrl" ng-src="{{action.imageUrl}}" ng-attr-title="{{action.text}}"/> </a> </div></td></tr><tr class="no-records" ng-show="!model.loading && !$data.length"> <td colspan="{{params.$params.columns.length + params.$params.rowSelectable}}" ng-bind="model.noRecordsMessage" > </td></tr><tr class="loading-message" ng-show="model.loading"> <td colspan="{{params.$params.columns.length + params.$params.rowSelectable}}" ng-bind="model.loadingMessage" > </td></tr></tbody> </table> <div class="bottom-pagination" ng-if="ngTableParamsObject.$params.paginate" ng-include="\'smart-table/smart-table-pagination.html\'" > </div></div>');
    }])

    .directive('smartTableTooltipWrapper', function ($compile, $timeout) {
        var getTextWidth = function (element) {
            var text = element.html();
            element.html('<span>' + text + '</span>');
            var width = element.find('span:first').width();
            element.html(text);
            return width;
        };
        return {
            // restrict: 'C',
            link: {
                pre: angular.noop,
                post: function (scope, element) {
                    element.on('mouseenter', function () {
                        var textWidth = getTextWidth(element.find('.tooltip-content'));
                        if (textWidth < 260) {
                            element.find('.tooltip-container').width(textWidth + 1);
                        }
                    });
                }
            }
        };
    })

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
