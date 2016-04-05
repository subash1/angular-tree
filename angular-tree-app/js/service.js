App.service('$dataService', ['$http','$rootScope',function($http, $rootScope){
    this.loadFileData = function(){
        $http({
            url: App.dataServiceUrl.getFiles,
            dataType: 'json',
            method: 'GET',
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then(function(res){
            $rootScope.$emit(Events.FileDataLoaded, res);
        });
    }
}]);