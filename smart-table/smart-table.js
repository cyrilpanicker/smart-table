(function(angular){
    'use strict'

    angular.module('smartTable',['ngTable'])

    .directive('smartTable',function($compile){
        return {
            replace:true,
            templateUrl:'smart-table/smart-table.html',
            controller:['$scope','$attrs',function($scope,$attrs){
                $scope.$watch($attrs.smartTable,function(params){
                    $scope.ngTableParamsObject = params;
                });
            }]
        };
    })

    .factory('SmartTableParams',['$http','ngTableParams',function($http,ngTableParams){
        return function(parameters,settings){
            if(!settings){
                settings = {};
            }
            if(!settings.hasOwnProperty('getServerData')){
                settings.getServerData = function($defer,params){
                    $http({method:'GET',url:parameters.apiUrl}).then(function(response){
                        $defer.resolve(response.data,params);
                    });
                };
            }
            if(!parameters.pagination){
                parameters.isPaginationEnabled = false;
            }else{
                for (var property in parameters.pagination) {
                    if(parameters.pagination.hasOwnProperty(property)){
                        parameters[property] = parameters.pagination[property]; 
                    }
                }
                parameters.isPaginationEnabled = true;            
            }
            delete parameters.pagination;
            return new ngTableParams(parameters,settings);
        };
    }]);

})(angular);