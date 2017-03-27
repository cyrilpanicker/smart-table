- run `npm install` to install dependencies.
- run `npm start` to run the demo application.

***example :***

*Files to include :*
```html
<link rel="stylesheet" href="/smart-table/smart-table.css" />
<script src="/libs/jquery.min.js"></script>
<script src="/libs/angular.min.js"></script>
<script src="/libs/ng-table.js"></script>
<script src="/smart-table/smart-table.js"></script>
```
*JavaScript :*
```javascript
var metadata = {
    "apiUrl":"/api/users",
    "columns":[{"title":"ID","field": "id","sortable":true,"defaultSortOrder":null},
        {"title": "Name","field": "name","sortable":true,"defaultSortOrder":"desc"}],
    "paginate":true,
    "pagerSeriesCount": 4,
    "count": 5,
    "rowSelectable":true,
    "paginationTitleTemplate":"Showing {FROM} to {TO} of {TOTAL}",
    "noRecordsMessage":"No records to show.",
    "loadingMessage":"Loading data."
};

angular.module('app',['smartTable'])
.controller('MainController',['$scope','SmartTableParams', function($scope,SmartTableParams){
    $scope.usersTable = new SmartTableParams(metadata);
    $scope.searchParams = {param1:'value1'};
    $scope.onRowSelect = function(rows){$scope.selectedRows = rows;};
    $scope.onUsersDataFetchStart = function(){console.log('fetch-data-start');};
    $scope.onUsersDataFetchEnd = function(){console.log('fetch-data-end');};
}]);
```
*HTML :*
```html
<div smart-table="usersTable" request-params="searchParams" on-row-select="onRowSelect"
    on-fetch-start="onUsersDataFetchStart" on-fetch-end="onUsersDataFetchEnd"></div>
    
<button ng-click="usersTable.resetAndReload()">Reload</button>
```