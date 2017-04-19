(function(angular){
    'use strict'

    angular.module('smartTable',['ngTable','ngSanitize'])

    .directive('smartTable',[function(){
        return {
            replace:true,
            scope:true,
            templateUrl:'dist/smart-table.html',
            controller:['$scope','$attrs','$element','$compile',function($scope,$attrs,$element,$compile){
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
                model.getMarkerImageUrl = function(value,mappings){
                    var filteredMappings = mappings.filter(function(mapping){
                        return mapping.mappedValue == value;
                    });
                    if(!filteredMappings.length){
                        return null;
                    }else{
                        return filteredMappings[0].imageUrl;
                    }
                };
                model.onAction = function(actionId,datum){
                    var onAction = $scope.$eval(model.onActionCallbackString);
                    if(onAction && typeof onAction === 'function'){
                        onAction(actionId,datum);
                    }
                };

                var createRows = function(columns,isRowSelectable){
                    var rows = $('<tr class="data-rows" ng-repeat="datum in $data" ng-show="!model.loading && $data.length"></tr>');
                    if(isRowSelectable){
                        var rowSelectorCell = $('<td class="row-select"></td>')
                        rowSelectorCell.append('<input type="checkbox" ng-model="datum._isSelected" ng-click="model.updateSelectedRows()" />');
                        rows.append(rowSelectorCell);
                    }
                    for(var i=0;i<columns.length;i++){
                        var cell = $('<td></td>')
                        cell.attr('style','text-align:'+(columns[i].alignment?columns[i].alignment:'left'))
                        var fieldContainer = $('<div class="field-container"></div>');
                        var markerContainer = $('<div class="marker-container"></div>');
                        var infoColumnsContainer = $('<div class="info-columns-container"></div>');
                        var actionsContainer = $('<div class="actions-container"></div>');
                        var field = columns[i].field;
                        var markers = columns[i].markers;
                        var infoColumns = columns[i].infoColumns;
                        var actions = columns[i].actions;
                        if(markers && markers.length){
                            for(var j=0;j<markers.length;j++){
                                var markerGroupDatum = markers[j];
                                var markerGroup = $('<div class="marker-group"></div>');
                                var image = $('<img class="marker-image"></img>');
                                image.attr('ng-src',"{{"+markerGroupDatum.mappings.length+" && model.getMarkerImageUrl(datum['"+markerGroupDatum.field+"'],"+JSON.stringify(markerGroupDatum.mappings)+")}}");
                                markerGroup.append(image);
                                markerContainer.append(markerGroup);
                            }
                        }
                        if(field){
                            if(columns[i].isFieldActionable){
                                var anchor = $('<a href=""></a>');
                                anchor.attr('ng-click',"model.onAction(null,datum)");
                                anchor.attr('ng-bind-html',"!datum['"+field+"'] ? ((datum['"+field+"']===0||datum['"+field+"']===false) ? datum['"+field+"'] : col.defaultText) : datum['"+field+"']");
                                fieldContainer.append(anchor);
                            }else{
                                var span = $('<span></span>');
                                span.attr('ng-bind-html',"(!datum['"+field+"'] ? ((datum['"+field+"']===0||datum['"+field+"']===false) ? datum['"+field+"'] : '"+columns[i].defaultText+"') : datum['"+field+"']) | smartTableTextTruncate:"+columns[i].maxLength);
                                span.attr('title',"{{datum['"+field+"'] && "+columns[i].maxLength+" && datum['"+field+"'].length>"+columns[i].maxLength+" ? datum['"+field+"'] : ''}}");
                                fieldContainer.append(span);
                            }
                        }
                        if(infoColumns && infoColumns.length){
                            infoColumnsContainer.attr('smart-table-tooltip-wrapper','');
                            infoColumnsContainer.addClass('tooltip-wrapper');
                            infoColumnsContainer.addClass(columns[i].infoTooltipPosition?columns[i].infoTooltipPosition:'left');
                            infoColumnsContainer.append('<a href="" class="info-icon"></a>');
                            var tooltipContainer = $('<div class="tooltip-container"></div>');
                            var tooltipContent = $('<div class="tooltip-content"></div>');
                            for(var j=0;j<infoColumns.length;j++){
                                var infoColumnField = infoColumns[j].field;
                                var infoColumnSpan = $('<span></span>');
                                infoColumnSpan.append('<span class="title">'+infoColumns[j].title+' : </span>');
                                var infoColumnValue = $('<span></span>');
                                infoColumnValue.attr('ng-bind',"!datum['"+infoColumnField+"'] ? ((datum['"+infoColumnField+"']===0||datum['"+infoColumnField+"']===false) ? datum['"+infoColumnField+"'] : '"+infoColumns[j].defaultText+"') : datum['"+infoColumnField+"']");
                                infoColumnSpan.append(infoColumnValue);
                                infoColumnSpan.append('<br/>');
                                tooltipContent.append(infoColumnSpan);
                            }
                            tooltipContainer.append(tooltipContent);
                            infoColumnsContainer.append(tooltipContainer);
                        }
                        if(actions && actions.length){
                            for(var j=0;j<actions.length;j++){
                                var actionAnchor = $('<a href=""></a>');
                                actionAnchor.attr('ng-click',"model.onAction("+actions[j].id+",datum)");
                                if(actions[j].imageUrl){actionAnchor.addClass('image-link');}
                                if(!actions[j].imageUrl){
                                    actionAnchor.append('<span>'+actions[j].text+'</span>');
                                }else{
                                    actionAnchor.append('<img src="'+actions[j].imageUrl+'" title="'+actions[j].text+'"></img>')
                                }
                                actionsContainer.append(actionAnchor);
                            }
                        }
                        cell.append(markerContainer);
                        cell.append(fieldContainer);
                        cell.append(infoColumnsContainer);
                        cell.append(actionsContainer);
                        rows.append(cell);
                    }
                    return rows;
                };

                $scope.$watch($attrs.smartTable,function(_params){
                    if(!_params)return;
                    params = $scope.ngTableParamsObject = _params;
                    model.paginationTitleTemplate = _params.$params.paginationTitleTemplate || 'Showing {FROM} to {TO} of {TOTAL}';
                    model.noRecordsMessage = _params.$params.noRecordsMessage || 'No records to show.';
                    model.loadingMessage = _params.$params.loadingMessage || 'Loading data';
                    model.defaultSortParams = {sortColumn:null,sortOrder:null};
                    if(_params.$params.defaultSortColumn){
                        model.defaultSortParams.sortColumn = _params.$params.defaultSortColumn;
                        model.currentSortColumn = _params.$params.defaultSortColumn;
                    }
                    if(_params.$params.defaultSortOrder){
                        model.defaultSortParams.sortOrder = _params.$params.defaultSortOrder;
                    }
                    model.sortParams = angular.copy(model.defaultSortParams);

                });
                $scope.$on('createRows',function(event,data){
                    var template = createRows(data.columns,data.isRowSelectable);
                    // console.log(template[0]);
                    var compiledTemplate = $compile(template)(data.scope);
                    $element.find('tbody').prepend(compiledTemplate);                    
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
                    if(params.$params.isRowSelectable){
                        currentData = event.targetScope.$data;
                        resetSelectedRows();
                        model.updateSelectedRows();
                    }
   	            });
            }]
        };
    }])

    .factory('SmartTableParams',['$http','ngTableParams','$rootScope',function($http,ngTableParams,$rootScope){
        return function(parameters,settings){
            var params = null;
            var cachedResponse = null;
            var _scope = null;
            var model = null;
            var ngTableResetAndReload = null;
            var postData = null;
            var rowsCreated = false;
            var getServerData = function($defer,_params){
                _scope = params.settings().$scope;
                model = _scope.smartTableModel;
                if(!rowsCreated && params.$params.columns && _scope){
                    $rootScope.$broadcast('createRows',{
                        scope:_scope,
                        columns:params.$params.columns,
                        isRowSelectable:params.$params.isRowSelectable
                    });
                    rowsCreated=true;
                }
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
        $templateCache.put('dist/smart-table-pagination.html','<nav ng-init="params=ngTableParamsObject;model=smartTableModel"> <p ng-show="params.total()">{{model.paginationTitle}}</p><ul ng-show="params.total()"> <li class="previous" ng-class="{\'disabled\': params.page()===1}"> <a href="" ng-click="model.previous(params.page()===1)"> <span>« PREV</span> </a> </li><li ng-class="{\'selected\': params.page()==page.number}" ng-repeat="page in model.pages"> <a href="" ng-click="model.selectPage(page)"> <span ng-bind="page.number"></span> </a> </li><li class="next" ng-class="{\'disabled\': params.page()===model.numPages}"> <a href="" ng-click="model.next(params.page()===model.numPages)"> <span>NEXT »</span> </a> </li></ul></nav>');
        $templateCache.put('dist/smart-table.html','<div class="smart-table" ng-init="model=smartTableModel"> <div class="top-pagination" ng-if="ngTableParamsObject.$params.paginate" ng-include="\'dist/smart-table-pagination.html\'" > </div><table ng-table="ngTableParamsObject"> <thead> <tr> <th class="row-select" ng-show="params.$params.isRowSelectable"> <input id="selectAllCheckBox" type="checkbox" ng-checked="model.allRowsSelected" ng-click="model.onSelectAllClick($event)"/> </th> <th ng-repeat="col in params.$params.columns" ng-click="col.isSortable && params.serverSortBy(col.field)" ng-class="{\'sortable\':col.isSortable, \'sort-asc\':model.sortParams.sortColumn===col.field && model.sortParams.sortOrder===\'asc\', \'sort-desc\':model.sortParams.sortColumn===col.field && model.sortParams.sortOrder===\'desc\'}" ng-style="{\'width\':col.width+\'%\'}" > <div ng-bind="col.title"></div></th> </tr></thead> <tbody> <tr class="no-records" ng-show="!model.loading && !$data.length"> <td colspan="{{params.$params.columns.length + params.$params.isRowSelectable}}" ng-bind="model.noRecordsMessage" > </td></tr><tr class="loading-message" ng-show="model.loading"> <td colspan="{{params.$params.columns.length + params.$params.isRowSelectable}}" ng-bind="model.loadingMessage" > </td></tr></tbody> </table> <div class="bottom-pagination" ng-if="ngTableParamsObject.$params.paginate" ng-include="\'dist/smart-table-pagination.html\'" > </div></div>');
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

    .filter('smartTableTextTruncate',[function(){
        return function(text,length){
            if(text && length && text.length>length){
                return text.substr(0,length)+'...';
            }else{
                return text;
            }
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