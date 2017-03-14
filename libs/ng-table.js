(function (angular, factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        define(['angular'], function (angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(angular || null, function (angular) {

    var app = angular.module('ngTable', []);

    app.factory('ngTableParams', ['$q', '$log', '$filter', function ($q, $log, $filter) {
        var isNumber = function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        };
        var ngTableParams = function (baseParameters, baseSettings) {
            var self = this,
                log = function () {
                    if (settings.debugMode && $log.debug) {
                        $log.debug.apply(this, arguments);
                    }
                };

            this.data = [];
            this.dataSource = [];
            this.checkboxes = {
                checked: false,
                items: []
            };
            this.prevMultipler = null;
            this.startIndex = null;
            this.endIndex = null;
            this.cachedBlocks = {};
            this.pagerData = {};

            this.parameters = function (newParameters, parseParamsFromUrl) {
                parseParamsFromUrl = parseParamsFromUrl || false;
                if (angular.isDefined(newParameters)) {
                    for (var key in newParameters) {
                        var value = newParameters[key];
                        if (parseParamsFromUrl && key.indexOf('[') >= 0) {
                            var keys = key.split(/\[(.*)\]/).reverse()
                            var lastKey = '';
                            for (var i = 0, len = keys.length; i < len; i++) {
                                var name = keys[i];
                                if (name !== '') {
                                    var v = value;
                                    value = {};
                                    value[lastKey = name] = (isNumber(v) ? parseFloat(v) : v);
                                }
                            }
                            if (lastKey === 'sorting') {
                                params[lastKey] = {};
                            }
                            params[lastKey] = angular.extend(params[lastKey] || {}, value[lastKey]);
                        } else {
                            params[key] = (isNumber(newParameters[key]) ? parseFloat(newParameters[key]) : newParameters[key]);
                        }
                    }
                    log('ngTable: set parameters', params);
                    return this;
                }
                return params;
            };

            this.settings = function (newSettings) {
                if (angular.isDefined(newSettings)) {
                    if (angular.isArray(newSettings.data)) {
                        //auto-set the total from passed in data
                        newSettings.total = newSettings.data.length;
                    }
                    settings = angular.extend(settings, newSettings);
                    log('ngTable: set settings', settings);
                    return this;
                }
                return settings;
            };

            this.page = function (page) {
                return angular.isDefined(page) ? this.parameters({ 'page': page }) : params.page;
            };

            this.total = function (total) {
                return angular.isDefined(total) ? this.settings({ 'total': total }) : settings.total;
            };

            this.count = function (count) {
                // reset to first page because can be blank page
                return angular.isDefined(count) ? this.parameters({ 'count': count, 'page': 1 }) : params.count;
            };

            this.pageCount = function () {
                return angular.isDefined(params.count) && angular.isDefined(settings.total)
                        ? Math.ceil(settings.total / params.count) : 0;
            };

            this.filter = function (filter) {
                return angular.isDefined(filter) ? this.parameters({ 'filter': filter }) : params.filter;
            };

            this.sorting = function (sorting) {
                if (arguments.length == 2) {
                    var sortArray = {};
                    sortArray[sorting] = arguments[1];
                    this.parameters({ 'sorting': sortArray });
                    return this;
                }
                return angular.isDefined(sorting) ? this.parameters({ 'sorting': sorting }) : params.sorting;
            };

            this.isSortBy = function (field, direction) {
                return angular.isDefined(params.sorting[field]) && params.sorting[field] == direction;
            };

            this.orderBy = function () {
                var sorting = [];
                for (var column in params.sorting) {
                    sorting.push((params.sorting[column] === "asc" ? "+" : "-") + column);
                }
                return sorting;
            };

            this.multiplier = function () {
                return Math.ceil(self.page() / self.$params.pagerSeriesCount);
            };

            this.getServerData = function ($defer, params) {
                if (angular.isArray(this.data) && angular.isObject(params)) {
                    $defer.resolve(this.data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                } else {
                    $defer.resolve([]);
                }
            };

            this.getGroups = function ($defer, column, self, fetchFromServer) {
                var defer = $q.defer();

                defer.promise.then(function (data) {
                    var groups = {};
                    angular.forEach(data.resultSet, function (item) {
                        var groupName = angular.isFunction(column) ? column(item) : item[column];

                        groups[groupName] = groups[groupName] || {
                            data: []
                        };
                        groups[groupName]['value'] = groupName;
                        groups[groupName].data.push(item);
                    });
                    var result = [];
                    for (var i in groups) {
                        result.push(groups[i]);
                    }
                    log('ngTable: refresh groups', result);

                    $defer.resolve({ resultSet: result, totalItems: data.totalItems });
                }).catch(function (error) {
                    console.log('Error: smart-ng-table =:: ' + JSON.stringify(error));
                });

                if (fetchFromServer)
                    settings.getServerData(defer, self);
                else
                    settings.getData(defer, self);
            };

            this.generatePagesArray = function (currentPage, totalItems, pageSize) {
                var maxBlocks, numPages, pages, multiplier,
                maxBlocks = this.$params.pagerSeriesCount;
                pages = [];
                numPages = Math.ceil(totalItems / pageSize);
                if (numPages >= 1) {
                    multiplier = Math.ceil(currentPage / maxBlocks);
                    if (multiplier === 1) {
                        this.startIndex = 1;
                        this.endIndex = multiplier * maxBlocks;
                    } else {
                        this.startIndex = ((multiplier - 1) * maxBlocks) + 1;
                        this.endIndex = ((multiplier - 1) * maxBlocks) + maxBlocks;
                    }
                    if (this.endIndex > numPages) {
                        this.endIndex = numPages;
                    }
                    for (var index = this.startIndex; index <= this.endIndex; index++) {
                        pages.push({
                            number: index,
                            active: currentPage !== index
                        });
                    }
                }

                return pages;
            };

            this.url = function (asString) {
                asString = asString || false;
                var pairs = (asString ? [] : {});
                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        var item = params[key],
                            name = encodeURIComponent(key);
                        if (typeof item === "object") {
                            for (var subkey in item) {
                                if (!angular.isUndefined(item[subkey]) && item[subkey] !== "") {
                                    var pname = name + "[" + encodeURIComponent(subkey) + "]";
                                    if (asString) {
                                        pairs.push(pname + "=" + item[subkey]);
                                    } else {
                                        pairs[pname] = item[subkey];
                                    }
                                }
                            }
                        } else if (!angular.isFunction(item) && !angular.isUndefined(item) && item !== "") {
                            if (asString) {
                                pairs.push(name + "=" + encodeURIComponent(item));
                            } else {
                                pairs[name] = encodeURIComponent(item);
                            }
                        }
                    }
                }
                return pairs;
            };

            this.reload = function (fetchFromServer) {
                var $defer = $q.defer(),
                    filteredData,
                    self = this;

                settings.$loading = true;

                $defer.promise.then(function (data) {
                    log('ngTable: reload data');
                    settings.$loading = false;
                    // First updated cachedBlocks array when incremental/on-demand caching is "ON".
                    if (self.$params.paginate && !self.$params.blockCaching) {
                        if (!self.cachedBlocks.hasOwnProperty(self.prevMultipler)) {
                            Object.defineProperty(self.cachedBlocks, self.prevMultipler, {
                                value: null,
                                writable: false
                            });
                        }
                    }
                    // Update total row count after getting data
                    self.total(data.totalItems);
                    // Store complete data
                    self.dataSource = data.resultSet;
                    console.log('smart-ng-table: current scope', settings.$scope);

                    data = (self.$params.sortable && self.sorting())
                                ? $filter('orderBy')(self.dataSource, self.orderBy())
                                : self.dataSource;
                    // In case pagination is set to false, no need to filter the data
                    // Instead get all records at once
                    if (self.$params.paginate) {
                        // filter data
                        filteredData = self.filterDataByPageBlock(data);
                    } else {
                        // Un-filtered records
                        filteredData = data;
                    }

                    if (self.$params.serverSideGrouping || settings.groupBy) {
                        self.data = settings.$scope.$groups = filteredData;
                    } else {
                        self.data = settings.$scope.$data = filteredData;
                    }

                    settings.$scope.$emit('ngTableAfterReloadData');
                }).catch(function (error) {
                    console.log('Error: smart-ng-table =:: ' + JSON.stringify(error));
                });

                if (!this.$params.serverSideGrouping && settings.groupBy) {
                    settings.getGroups($defer, settings.groupBy, this, fetchFromServer);
                } else {
                    if (fetchFromServer)
                        settings.getServerData($defer, this);
                    else
                        settings.getData($defer, this);
                }
            };

            this.resetAndReload = function () {
                // Reset params
                self.prevMultipler = null;
                self.total(0); // Reset to datasource count as 0.
                if (self.page() === 1) {
                    if (self.prevMultipler === null) {
                        self.prevMultipler = self.multiplier();
                        angular.extend(self.pagerData, self.pagerParams());
                    }
                    self.reload(true); // reload without reset
                } else {
                    self.page(1); // this will automagically fires watcher.
                }
            };

            this.filterDataByPageBlock = function (data) {
                var self = this;

                if (self.$params.blockCaching) {
                    if (self.page() && self.count()) {
                        var multiplier = self.multiplier(),
                            startIndex = (self.page() - (self.$params.pagerSeriesCount * (multiplier - 1))) - 1;
                        return data.slice(startIndex * self.count(), (startIndex + 1) * self.count());
                    }
                } else {
                    return data.slice((self.page() - 1) * self.count(), self.page() * self.count());
                }
            };

            this.pagerParams = function () {
                var self = this;
                if (!!self.page()) {
                    var currMultiplier = self.multiplier();
                    if (self.prevMultipler !== currMultiplier) {
                        if (self.prevMultipler < currMultiplier) {
                            return {
                                startPage: self.page(),
                                get endPage() {
                                    var value = self.page() + self.$params.pagerSeriesCount - 1;
                                    if (self.total() === 0) {
                                        return value;
                                    }
                                    var numPages = Math.ceil(self.total() / self.count());
                                    if (value <= numPages) {
                                        return value;
                                    } else {
                                        return numPages;
                                    }
                                }
                            }
                        } else {
                            return {
                                startPage: self.page() - self.$params.pagerSeriesCount + 1,
                                get endPage() {
                                    if (self.page() < 0) {
                                        return 1;
                                    } else {
                                        return self.page();
                                    }
                                }
                            }
                        }
                    } else {
                        return {
                            startPage: self.page(),
                            get endPage() {
                                var value = self.page() + self.$params.pagerSeriesCount - 1;
                                if (self.total() === 0) {
                                    return value;
                                }
                                var numPages = Math.ceil(self.total() / self.count());
                                if (value <= numPages) {
                                    return value;
                                } else {
                                    return numPages;
                                }
                            }
                        }
                    }
                }
            };

            this.getData = function () {
                /* No implementation here */
            };

            this.serverSortBy = function (toBeSortColumn) {
                settings.serverSortBy(toBeSortColumn);
            };

            var params = this.$params = {
                page: 1,
                count: 1,
                filter: {},
                sorting: {},
                group: {},
                groupBy: null,
                pagerSeriesCount: 1,
                sortable: false,
                blockCaching: true,
                paginate: false,
                serverSideGrouping: false,
                serverSort: true
            };

            var settings = Object.create(null);

            settings.$scope = null;
            settings.$loading = false;
            settings.data = null;
            settings.total = 0;
            settings.defaultSort = 'desc';
            settings.filterDelay = 750;
            settings.counts = [10, 25, 50, 100];
            settings.getGroups = this.getGroups;
            settings.getServerData = this.getServerData;
            settings.getData = this.getData;
            settings.serverSortBy = this.serverSortBy;

            //var settings = {
            //    $scope: null, // set by ngTable controller
            //    $loading: false,
            //    data: null, //allows data to be set when table is initialized
            //    total: 0,
            //    defaultSort: 'desc',
            //    filterDelay: 750,
            //    counts: [10, 25, 50, 100],
            //    getGroups: this.getGroups,
            //    getServerData: this.getServerData,
            //    getData: this.getData,
            //    serverSortBy: this.serverSortBy
            //};

            this.settings(baseSettings);
            this.parameters(baseParameters, true);
            return this;
        };
        return ngTableParams;
    }]);

    var ngTableController = ['$scope', 'ngTableParams', '$timeout', function ($scope, ngTableParams, $timeout) {
        $scope.$loading = false;

        if (!$scope.hasOwnProperty("params")) {
            $scope.params = new ngTableParams();
        }
        $scope.params.settings().$scope = $scope;

        var delayFilter = (function () {
            var timer = 0;
            return function (callback, ms) {
                $timeout.cancel(timer);
                timer = $timeout(callback, ms);
            };
        })();

        $scope.$watch('params.$params', function (newParams, oldParams) {
            $scope.params.settings().$scope = $scope;
            var blockCaching = $scope.params.$params.blockCaching;

            if (!angular.equals(newParams.filter, oldParams.filter)) {
                delayFilter(function () {
                    $scope.params.$params.page = 1;
                    $scope.params.reload(blockCaching);
                }, $scope.params.settings().filterDelay);
            } else {
                if ($scope.params.$params.paginate) {
                    if ($scope.params.prevMultipler === null) {
                        $scope.params.prevMultipler = $scope.params.multiplier();
                        angular.extend($scope.params.pagerData, $scope.params.pagerParams());
                    }
                    if ($scope.params.prevMultipler !== $scope.params.multiplier()) {
                        angular.extend($scope.params.pagerData, $scope.params.pagerParams());
                        $scope.params.prevMultipler = $scope.params.multiplier();
                        if (blockCaching || !$scope.params.cachedBlocks.hasOwnProperty($scope.params.multiplier())) {
                            // fetch new data from server.
                            $scope.params.reload(true);
                            return;
                        }
                    }
                    $scope.params.reload(false);
                } else {
                    $scope.params.reload(true);
                }
            }
        }, true);

        $scope.sortBy = function (column, event) {

            var parsedSortable = $scope.parse(column.sortable);
            if (!parsedSortable) {
                return;
            }

            if ($scope.params.$params.serverSort) {
                // START - Server side sorting
                $scope.params.serverSortBy(parsedSortable);
                // END - Server side sorting
            } else {
                // START - Client side sorting

                var defaultSort = $scope.params.settings().defaultSort;
                var inverseSort = (defaultSort === 'asc' ? 'desc' : 'asc');
                var sorting = $scope.params.sorting() && $scope.params.sorting()[parsedSortable] && ($scope.params.sorting()[parsedSortable] === defaultSort);
                var sortingParams = (event.ctrlKey || event.metaKey) ? $scope.params.sorting() : {};
                sortingParams[parsedSortable] = (sorting ? inverseSort : defaultSort);

                $scope.params.parameters({
                    sorting: sortingParams
                });
            }
        };
    }];

    app.directive('ngTable', ['$compile', '$q', '$parse',
        function ($compile, $q, $parse) {
            'use strict';

            return {
                restrict: 'A',
                priority: 1001,
                scope: true,
                controller: ngTableController,
                compile: function (element) {
                    var columns = [], i = 0, row = null;

                    // Check for header pager attribute
                    var ngtablePager = $parse(element.attr('x-data-paginate')
                                                || element.attr('data-paginate')
                                                || element.attr('paginate')),
                        hideHeader = $parse(element.attr('x-data-hideHeader')
                                                || element.attr('data-hideHeader')
                                                || element.attr('hideHeader')),
                    // custom header
                    thead = element.find('thead');

                    // IE 8 fix :not(.ng-table-group) selector
                    angular.forEach(angular.element(element.find('tr')), function (tr) {
                        tr = angular.element(tr);
                        if (!tr.hasClass('ng-table-group') && !row) {
                            row = tr;
                        }
                    });
                    if (!row) {
                        return;
                    }
                    angular.forEach(row.find('td'), function (item) {
                        var el = angular.element(item);
                        if (el.attr('ignore-cell') && 'true' === el.attr('ignore-cell')) {
                            return;
                        }
                        var parsedAttribute = function (attr, defaultValue) {
                            if(attr==='title'){
                                return function(scope){
                                    return $parse(el.attr('data-' + attr))(scope);
                                };
                            }
                            return function (scope) {
                                return $parse(el.attr('x-data-' + attr) || el.attr('data-' + attr) || el.attr(attr))(scope, {
                                    $columns: columns
                                }) || defaultValue;
                            };
                        };

                        var parsedTitle = parsedAttribute('title', ' '),
                            headerTemplateURL = parsedAttribute('header', false),
                            filter = parsedAttribute('filter', false)(),
                            filterTemplateURL = false,
                            filterName = false;

                        if (filter && filter.$$name) {
                            filterName = filter.$$name;
                            delete filter.$$name;
                        }
                        if (filter && filter.templateURL) {
                            filterTemplateURL = filter.templateURL;
                            delete filter.templateURL;
                        }

                        el.attr('data-title-text', parsedTitle()); // this used in responsive table
                        columns.push({
                            id: i++,
                            title: parsedTitle,
                            sortable: parsedAttribute('sortable', false),
                            'class': el.attr('x-data-header-class') || el.attr('data-header-class') || el.attr('header-class'),
                            filter: filter,
                            filterTemplateURL: filterTemplateURL,
                            filterName: filterName,
                            headerTemplateURL: headerTemplateURL,
                            filterData: (el.attr("filter-data") ? el.attr("filter-data") : null),
                            show: (el.attr("ng-show") ? function (scope) {
                                return $parse(el.attr("ng-show"))(scope);
                            } : function () {
                                return true;
                            })
                        });
                    });


                    return function (scope, element, attrs) {
                        scope.$loading = false;
                        scope.$columns = columns;
                        // check whether to form table header or not.
                        var hasPager = ngtablePager(scope),
                            hasHeader = hideHeader(scope);

                        scope.$watch(attrs.ngTable, (function (params) {
                            if (angular.isUndefined(params)) {
                                return;
                            }
                            scope.paramsModel = $parse(attrs.ngTable);
                            scope.params = params;
                        }), true);
                        scope.parse = function (text) {
                            return angular.isDefined(text) ? text(scope) : '';
                        };
                        if (attrs.showFilter) {
                            scope.$parent.$watch(attrs.showFilter, function (value) {
                                scope.show_filter = value;
                            });
                        }
                        angular.forEach(columns, function (column) {
                            var def;
                            if (!column.filterData) {
                                return;
                            }
                            def = $parse(column.filterData)(scope, {
                                $column: column
                            });
                            if (!(angular.isObject(def) && angular.isObject(def.promise))) {
                                throw new Error('Function ' + column.filterData + ' must be instance of $q.defer()');
                            }
                            delete column.filterData;
                            return def.promise.then(function (data) {
                                if (!angular.isArray(data)) {
                                    data = [];
                                }
                                data.unshift({
                                    title: '-',
                                    id: ''
                                });
                                column.data = data;
                            });
                        });
                        if (!element.hasClass('ng-table')) {
                            scope.templates = {
                                header: (attrs.templateHeader ? attrs.templateHeader : 'ng-table/header.html'),
                                pagination: (attrs.templatePagination ? attrs.templatePagination : 'ng-table/pager.html')
                            };
                            var headerTemplate = thead.length > 0 ? thead : angular.element(document.createElement('thead')).attr('ng-include', 'templates.header');

                            element.find('thead').remove();

                            if (!hasHeader) {
                                $(element).addClass('ng-table')
                                    .prepend(headerTemplate);

                                $compile(headerTemplate)(scope);
                            }

                            if (hasPager) {
                                scope.params.$params.paginateCaption = attrs.paginatecaption;  // AJG SMART: to display custom pagination text
                                var topPaginationTemplate = angular.element(document.createElement('div')).attr({
                                    'paginate-table': 'params'
                                });
                                var bottomPaginationTemplate = angular.element(document.createElement('div')).attr({
                                    'paginate-table': 'params'

                                });

                                $(element).addClass('ng-table')
                                    .after(topPaginationTemplate)      // Table top pager
                                    .before(bottomPaginationTemplate);   // Table end pager

                                $compile(topPaginationTemplate)(scope);
                                $compile(bottomPaginationTemplate)(scope);
                            }
                        }
                    };
                }
            }
        }
    ]);

    app.directive('paginateTable2', ['$compile',
        function ($compile) {
            'use strict';

            return {
                restrict: 'A',
                scope: {
                    'params': '=paginateTable2',
                    'templateUrl': '='
                },
                replace: false,
                link: function (scope, element, attrs) {

                    scope.params.settings().$scope.$on('ngTableAfterReloadData', function () {
                        scope.pages = scope.params.generatePagesArray(scope.params.page(), scope.params.total(), scope.params.count());
                    }, true);

                    scope.$watch('templateUrl', function (templateUrl) {
                        if (angular.isUndefined(templateUrl)) {
                            return;
                        }
                        var template = angular.element(document.createElement('div'))
                        template.attr({
                            'ng-include': 'templateUrl'
                        });
                        element.append(template);
                        $compile(template)(scope);
                    });
                }
            };
        }
    ]);

    angular.module('ngTable').run(['$templateCache', function ($templateCache) {
        $templateCache.put('ng-table/filters/select-multiple.html', '<select ng-options="data.id as data.title for data in column.data" multiple ng-multiple="true" ng-model="params.filter()[name]" ng-show="filter==\'select-multiple\'" class="filter filter-select-multiple form-control" name="{{column.filterName}}"> </select>');
        $templateCache.put('ng-table/filters/select.html', '<select ng-options="data.id as data.title for data in column.data" ng-model="params.filter()[name]" ng-show="filter==\'select\'" class="filter filter-select form-control" name="{{column.filterName}}"> </select>');
        $templateCache.put('ng-table/filters/text.html', '<input type="text" name="{{column.filterName}}" ng-model="params.filter()[name]" ng-if="filter==\'text\'" class="input-filter form-control"/>');
        $templateCache.put('ng-table/header.html', '<tr> <th ng-repeat="column in $columns" ng-class="{ \'sortable\': parse(column.sortable), \'sort-asc\': params.sorting()[parse(column.sortable)]==\'asc\', \'sort-desc\': params.sorting()[parse(column.sortable)]==\'desc\' }" style="background-color: lightblue;" ng-click="sortBy(column, $event)" ng-show="column.show(this)" ng-init="template=column.headerTemplateURL(this)" class="header {{column.class}}"> <div ng-if="!template" ng-show="!template" ng-bind="parse(column.title)"></div> <div ng-if="template" ng-show="template"><div ng-include="template"></div></div> </th> </tr> <tr ng-show="show_filter" class="ng-table-filters"> <th ng-repeat="column in $columns" ng-show="column.show(this)" class="filter"> <div ng-repeat="(name, filter) in column.filter"> <div ng-if="column.filterTemplateURL" ng-show="column.filterTemplateURL"> <div ng-include="column.filterTemplateURL"></div> </div> <div ng-if="!column.filterTemplateURL" ng-show="!column.filterTemplateURL"> <div ng-include="\'ng-table/filters/\' + filter + \'.html\'"></div> </div> </div> </th> </tr>');
        //$templateCache.put('ng-table/pager.html', '<div class="ng-cloak ng-table-pager"> <div ng-if="params.settings().counts.length" class="ng-table-counts btn-group pull-right"> <button ng-repeat="count in params.settings().counts" type="button" ng-class="{\'active\':params.count()==count}" ng-click="params.count(count)" class="btn btn-default"> <span ng-bind="count"></span> </button> </div> <ul class="pagination"> <li ng-class="{\'disabled\': !page.active}" ng-repeat="page in pages" ng-switch="page.type"> <a ng-switch-when="prev" ng-click="params.page(page.number)" href="">&laquo;</a> <a ng-switch-when="first" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="page" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="more" ng-click="params.page(page.number)" href="">&#8230;</a> <a ng-switch-when="last" ng-click="params.page(page.number)" href=""><span ng-bind="page.number"></span></a> <a ng-switch-when="next" ng-click="params.page(page.number)" href="">&raquo;</a> </li> </ul> </div> ');
        $templateCache.put('ng-table/headers/checkbox.html', '<input type="checkbox" ng-model="params.checkboxes.checked" id="select_all" name="filter-checkbox" value="" ng-click="check_all_checked(checkboxes.checked)" />');
    }]);

    return app;
}));