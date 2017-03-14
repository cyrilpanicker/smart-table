angular.module('smartTable',['ngTable'])

.factory('SmartTableParams',['ngTableParams','$http',function(ngTableParams,$http){
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
        return new ngTableParams(parameters,settings);
    };
}])

.directive('smartTable',function($compile){
    return {
        replace:true,
        templateUrl:'smart-table.html',
        link:function(scope,element,attributes){
            scope.ngTableParamsObject = scope.$eval(attributes.smartTable);
        }
    };
});