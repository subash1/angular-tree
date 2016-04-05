window.element = angular.element;

// options
/**
 * 1. childrenField = identify the child property
 * 2. indent = indent between each level
 * 3. labelField = label to be show
 * 4. expandCollapseStyle = css class to apply for collapse and open
 * 5. folderIconStyle = css class for folder icon
 * 6. onItemSelect = select a nan-expandabe node in a tree,
 *    params
 *       1. dom - respective dom reference,
 *       2. id - item id.
 * 7. showFileSize - to show the size in the tree item
 * */


App.directive('angularTree', function(){

    var link = function($scope, $elem, $attr){
        var options = $scope.options;
        $scope.$watch('source', function(newVal, oldVal){
            if($scope.source.length)
                renderDOM( $scope, $elem);
        }, true);

        var renderDOM = function($scope, $elem){
            $elem.empty();
            applyDom($scope.source, $elem, 0);
        };


        var firstNode = true;
        var applyDom = function(source,parent, indent){
            for(var i = 0; i < source.length; i++){
                var item = source[i];
                var itemUI = getRenderedUI(item);
                if(!firstNode)
                    itemUI.css('display','none');
                firstNode = false;
                parent.append(itemUI);
                itemUI.css('margin-left', indent+'px');
                if(item[options.childrenField] && item[options.childrenField].length) {
                    applyDom(item[options.childrenField], itemUI, options.indent);
                }
            }
        };

        var getRenderedUI = function(item){
            var div = element("<div/>");
            div.attr('item-id', item.id);
            var expand = element("<span/>").addClass(options.expandCollapseStyle || 'expand-collapse');
            if(item[options.childrenField]){
                div.addClass('level');
                expand.append(element('<i/>')
                    .addClass('glyphicon glyphicon-plus-sign'))
                    .attr('expanded', 'false')
                    .bind('click', expandNodes);
            }
            var typeIcon = element('<span/>').addClass(options.folderIconStyle || 'folder-icon')
                .append(element('<i/>').addClass(item.entity_type == 'directory' ? 'glyphicon glyphicon-folder-close' : 'glyphicon glyphicon-file'));
            div.addClass(options.treeItemStyle || 'tree-item');
            div.append(expand)
                .append(typeIcon)
                .append(element('<span/>')
                    .html(item[options.labelField])
                    .addClass('tree-label')
                    .append(element('<span/>').addClass('size-label').css('display', options.showFileSize ? 'inline' : 'none').attr('title', item.sizeInBytes).html(formatSize(item.sizeInBytes)))
            );
            div.bind('click', treeItemClickHandler);
            return div;
        }

        var formatSize = function(bytes){
            if(bytes < 1024)
                return bytes+" B";
            else if(bytes < (1024 * 1024))
                return Math.round(bytes/1024) + 'KB';
            else
                return Math.round(bytes/(1024*1024)) + 'MB'
        };

        var prevSelectedItem = null;
        var treeItemClickHandler = function(event){
            var div = element(event.currentTarget);
            if(prevSelectedItem)
                prevSelectedItem.removeClass('selected');
            var labelUI = element(div.children()[2]); // we need take care here if we change the ui structure of the tree
            labelUI.addClass('selected');
            prevSelectedItem = labelUI;
            if(div.hasClass('level')){
                expandNodes({currentTarget : div.children()[0]});
            } else {
                if(options.onItemSelect){
                    options.onItemSelect({dom : div, id : parseInt(div.attr('item-id'))});
                }
            }
            event.stopPropagation();
        };

        var expandNodes = function(event){
            var ct = $(event.currentTarget); // nextAll not support in JqLite. so that only goto jquery
            if(ct.attr('expanded') == "true") {
                ct.nextAll('.tree-item').hide();
                ct.next().find('i').addClass('glyphicon-folder-close').removeClass('glyphicon-folder-open');
                ct.find('i').addClass('glyphicon-plus-sign').removeClass('glyphicon-minus-sign');
                ct.attr('expanded', 'false');
            } else {
                ct.nextAll('.tree-item').show();
                ct.next().find('i').addClass('glyphicon-folder-open').removeClass('glyphicon-folder-close');
                ct.find('i').addClass('glyphicon-minus-sign').removeClass('glyphicon-plus-sign');
                ct.attr('expanded', 'true');
            }
            if(event.stopPropagation)
                event.stopPropagation();
        }

    };

    return {
        restrict : 'A',
        scope : {
            source : '=',
            options : '='
        },
        link : link
    }

});