***View demo here :*** [http://smarttable-cyrilpanicker.rhcloud.com/](http://smarttable-cyrilpanicker.rhcloud.com/)

***Files to include :***
```html
<link rel="stylesheet" href="/smart-table/smart-table.css" />
<script src="/libs/jquery.min.js"></script>
<script src="/libs/angular.min.js"></script>
<script src="/libs/ng-table.js"></script>
<script src="/smart-table/smart-table.js"></script>
```
***MetaData :***
```javascript
var metadata = {
    "apiUrl":"/api/users",
    "paginate":true,
    "pagerSeriesCount": 4,
    "count": 5,
    "rowSelectable":true,
    "rowSelectorColumnWidth":5,
    "paginationTitleTemplate":"Showing {FROM} to {TO} of {TOTAL} Users",
    "noRecordsMessage":"No records to show.",
    "loadingMessage":"Loading data.",
    "columns":[
        {
            "title":"ID","field": "id","sortable":true,"defaultSortOrder":null,"width":7,
            "defaultText":"--","isFieldActionable":true,"infoTooltipPosition":null,
            "markers":[
                [
                    {"imageUrl":"/images/mark-rush-icon.png","property":"isRush"}
                ],
                [
                    {"imageUrl":"/images/policy-icon.png","property":"isPolicy"},
                    {"imageUrl":"/images/top-nonpolicy-icon.png","property":"isNonPolicy"},
                    {"imageUrl":"/images/others-icon.png","property":"isOthers"}
                ]
            ],
            "infoColumns":[]
        },
        {
            "title": "Name","field": "name","sortable":true,"defaultSortOrder":"desc","width":7,
            "defaultText":"--","isFieldActionable":false,"infoTooltipPosition":null,
            "markers":[],
            "infoColumns":[],
            "actions":[]
        },
        {
            "title": "Skill","field": "skill","sortable":false,"defaultSortOrder":null,"width":null,
            "defaultText":"NA","isFieldActionable":false,"infoTooltipPosition":null,
            "markers":[],
            "infoColumns":[],
            "actions":[]
        },
        {
            "title": null,"field": null,"sortable":null,"defaultSortOrder":null,"width":3,
            "defaultText":null,"isFieldActionable":false,"infoTooltipPosition":"top",
            "markers":[],
            "infoColumns":[
                {"title": "Info1","field": "info1","defaultText":"--"},
                {"title": "Info2","field": "info2","defaultText":"Not Applicable"}
            ],
            "actions":[]
        },
        {
            "title":"Actions1","field":null,"sortable":false,"defaultSortOrder":null,"width":14,
            "defaultText":null,"isFieldActionable":false,"infoTooltipPosition":null,
            "markers":[],
            "infoColumns":[],
            "actions":[
                {"id":1,"text":"Process1","imageUrl":null},
                {"id":2,"text":"Process2","imageUrl":null}
            ]
        },
        {
            "title":"Actions2","field":null,"sortable":false,"defaultSortOrder":null,"width":7,
            "defaultText":null,"isFieldActionable":false,"infoTooltipPosition":null,
            "markers":[],
            "infoColumns":[],
            "actions":[
                {"id":3,"text":"Process3","imageUrl":"/images/edit-icon.png"},
                {"id":4,"text":"Process4","imageUrl":"/images/delete-icon.png"}
            ]
        }
    ]
};
```
***JavaScript :***
```javascript
angular.module('app',['smartTable'])
.controller('MainController',['$scope','SmartTableParams', function($scope,SmartTableParams){
    $scope.usersTable = new SmartTableParams(metadata);
    $scope.searchParams = {param1:'value1'};
    $scope.onRowSelect = function(rows){$scope.selectedRows = rows;};
    $scope.onUserAction = function(actionId,user){
        if(actionId===null){
            $scope.message = 'User with ID '+user.id+' selected';
        }else{
            $scope.message = 'Process-'+actionId+' selected for user with ID '+user.id;
        }
    };
    $scope.onUsersDataFetchStart = function(){console.log('fetch-data-start');};
    $scope.onUsersDataFetchEnd = function(){console.log('fetch-data-end');};
}]);
```
***HTML :***
```html
<div smart-table="usersTable"
    request-params="searchParams"
    on-row-select="onRowSelect"
    on-fetch-start="onUsersDataFetchStart"
    on-fetch-end="onUsersDataFetchEnd"
    on-action="onUserAction">
</div>
    
<button ng-click="usersTable.resetAndReload()">Reload</button>
```
***NPM Scripts for the demo application on GitHub :***
- run `npm install` to install dependencies.
- run `npm start` to run the demo application.