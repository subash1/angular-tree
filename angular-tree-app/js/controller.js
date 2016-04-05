App.controller("MainController", ['$scope','$rootScope','$dataService', function MainController($scope, $rootScope, $dataService){
    $scope.treeSource = []; // to be used for generate the tree.
    $scope.treeOptions = {
        childrenField : 'children',
        labelField : 'name',
        indent : 30,
        expandCollapseStyle : 'expand-collapse',
        showFileSize : true
    };

    
    
     // data loaded by eager way - dont have online service 
    /*$dataService.loadFileData();
    $rootScope.$on(Events.FileDataLoaded, function(event, result){
        treeRawSource  = angular.copy(result.data);
        var root = buildTreeStructure(result.data);
        calculateFileSize(root, root[0]);
        $scope.treeSource = root;
        console.log($scope.source);
    });*/


    var treeRawSource = {};
    var buildTreeStructure = function( array, parent, tree ){

        tree = typeof tree !== 'undefined' ? tree : [];
        parent = typeof parent !== 'undefined' ? parent : { id: -1 };

        var children = _.filter( array, function(child){
            return child.parentID == parent.id;
        });

        if( !_.isEmpty( children )  ){
            if( parent.id == -1 ){
                tree = children;
            }else{
                parent['children'] = children
            }
            _.each(children, function( child ){
                buildTreeStructure( array, child , tree);
            });
        }
        return tree;
    };

    
    var calculateFileSize = function(childs, root){
        _.each(childs, function(object){
            if(object['children']){
                calculateFileSize(object['children'],object);
            }
        });
        root.sizeInBytes = sumUp(childs);
    };



    var sumUp = function(children){
        var sum = 0
        _.each(children, function(object){
            sum += object.sizeInBytes;
        });
        return sum;
    }
    
    // not have the service in online. so i just hardcoded the database values.
     var result = JSON.parse('[{"entity_type":"directory","name":"app","parentID":-1,"sizeInBytes":-1,"id":1},{"entity_type":"file","name":"metadata.xml","parentID":1,"sizeInBytes":1233,"id":2},{"entity_type":"file","name":"pom.xml","parentID":1,"sizeInBytes":234,"id":3},{"entity_type":"directory","name":"js","parentID":1,"sizeInBytes":-1,"id":4},{"entity_type":"file","name":"main.js","parentID":4,"sizeInBytes":243,"id":5},{"entity_type":"file","name":"nav.js","parentID":4,"sizeInBytes":543,"id":6},{"entity_type":"file","name":"login.js","parentID":4,"sizeInBytes":123,"id":7},{"entity_type":"directory","name":"css","parentID":1,"sizeInBytes":-1,"id":8},{"entity_type":"file","name":"bootstrap.css","parentID":8,"sizeInBytes":2434,"id":9}]');
     var root = buildTreeStructure(result);
     calculateFileSize(root, root[0]);
     $scope.treeSource = root;
}]);