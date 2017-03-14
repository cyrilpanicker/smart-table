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
    'use strict';

    angular.module('ngTable')
   	.directive('paginateTable', function () {
   	    return {
   	        restrict: 'A',
   	        scope: {
   	            'params': '=paginateTable'
   	        },
   	        replace: false,
   	        template: '<nav>\
                        <div class="clearfix table_nav table_header"> \
                        <p class="pull-left fontBold" ng-hide="params.total() == 0"> \
                            {{paginationTitle}} \
                        </p> \
                        <p class="pull-left fontBold" ng-show="params.total() == 0"> \
                             \
                        </p> \
						  <ul class="pagination pull-right margin0" ng-if="params.total() != 0">\
						    <li class="previous" ng-class="{\'disabled\': params.page() === 1 || params.total() == 0 }"><a href="javascript:void(0)" ng-click="previous(params.page() === 1 || arams.total() == 0)"><span aria-hidden="true">&laquo; Prev</span><span class="sr-only">Previous</span></a></li>\
						    <li ng-class="{\'selected\': params.page() == page.number}" ng-repeat="page in pages"><a href="javascript:void(0)" ng-click="itemClicked(page)"><span ng-bind="page.number"></span></a></li> \
                            <li class="next" ng-class="{\'disabled\': params.page() === numPages || params.total() == 0}"><a href="javascript:void(0)" ng-click="next(params.page() === numPages || params.total() == 0)"><span aria-hidden="true">Next &raquo;</span><span class="sr-only">Next</span></a></li>\
						  </ul>\
                        </div> \
					</nav>',
   	        link: function (scope, element, attrs) {   	            
   	            var from = 0,
   	                to = 0,
                    paginationTitle = scope.params.$params.paginateCaption || 'Showing {FROM} to {TO} of {TOTAL}';     //'bla bla bla {FROM} bla {TO} bla {TOTAL} bla bla'    ---> standard format of caption

   	            scope.params.settings().$scope.$on('ngTableAfterReloadData', function () {
   	                scope.pages = scope.params.generatePagesArray(scope.params.page(), scope.params.total(), scope.params.count());
   	                scope.numPages = Math.ceil(scope.params.total() / scope.params.count());
   	                _updatePagerText();
   	            }, true);

   	            scope.previous = function (disableFlag) {
   	                if (!disableFlag) {
   	                    //console.log('previous :'+scope.params.page());
   	                    var pagenumber = scope.params.page() - 1;
   	                    scope.params.page(pagenumber);
   	                }
   	            };

   	            scope.next = function (disableFlag) {
   	                if (!disableFlag) {
   	                    //console.log('next :'+scope.params.page());
   	                    var pagenumber = scope.params.page() + 1;
   	                    scope.params.page(pagenumber);
   	                }
   	            };

   	            scope.itemClicked = function (item) {
   	                if (!!item && item.number && item.active) {
   	                    scope.params.page(item.number);
   	                }
   	            };

   	            //  update pagination title by {FROM}, {TO} & {TOTAL} attributes
   	            var updatePaginationTitle = function (_from, _to) {
   	                scope.paginationTitle = paginationTitle.replace('{FROM}', _from).replace('{TO}', _to).replace('{TOTAL}', scope.params.total());
   	            };

   	            var _updatePagerText = function () {
   	                from = (scope.params.page() - 1) * scope.params.count() + 1;
   	                to = scope.params.page() * scope.params.count();
   	                if (to > scope.params.total()) {
   	                    to = scope.params.total();
   	                }
   	                updatePaginationTitle(from, to);
   	            };

   	            updatePaginationTitle(from, to);

   	        }
   	    }
   	})
       
}));