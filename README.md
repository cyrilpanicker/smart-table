- run `npm install` to install dependencies.
- run `npm start` to run the demo application.

***example :***
*files to include :*
```html
        <script src="/libs/jquery.min.js"></script>
        <script src="/libs/angular.min.js"></script>
        <script src="/libs/ng-table.js"></script>
        <script src="/smart-table/smart-table.js"></script>
```
*JavaScript :*
```javascript
var metaData = {
    "apiUrl":"/api/users",
    "columns":[{"title":"ID","field": "id"},{"title": "Name","field": "name"}],
    "pagination":{"pagerSeriesCount": 4},
    "count": 5
}
angular.module('app',['smartTable'])
.controller('MainController',['$scope','SmartTableParams', function($scope,SmartTableParams){
    $scope.usersTable = new SmartTableParams(metadata);
}]);
```
*HTML :*
```html
<div smart-table="usersTable"></div>
<button ng-click="usersTable.resetAndReload()">Reload</button>
```