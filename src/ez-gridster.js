'use strict';

angular.module('ez.gridster', [])

.constant('ezGridsterConfig', {
  widget_base_dimensions: [400, 300],
  widget_margins: [5, 5],
  widget_selector: 'li',
  helper: 'clone',
  draggable: {},
  remove: {
    silent: true
  },
  resize: {
    enabled: true
  }
})

.directive('ezGridsterWidget', ['$timeout', 'ezGridsterConfig', function($timeout, ezGridsterConfig) {
  return {
    restrict: 'AE',
    templateUrl: 'ez-gridster-tpl.html',
    link: function(scope, $element) {
      $timeout(function() { // update gridster after digest
        scope.$parent.gridster.add_widget($element);
      });

      scope.$on('$destroy', function() {
        scope.$parent.gridster.remove_widget($element);//, ezGridsterConfig.option.remove.silent);
      });
    }
  };
}])

.directive('ezGridster', ['$timeout', 'ezGridsterConfig', function ($timeout, ezGridsterConfig) {
  return {
    restrict: 'AE',
    scope: {
      widgets: '=ezGridster'
    },
    template: '<ul><li class="gs-w box" ez-gridster-widget ng-repeat="widget in widgets" data-col="{{ widget.col }}" data-row="{{ widget.row }}" data-sizex="{{ widget.size_x }}" data-sizey="{{ widget.size_y }}"></li></ul>',
    link: function (scope, $element, attrs) {
      scope.options = angular.extend( ezGridsterConfig, (scope.$parent.$eval(attrs.ezGridsterOptions) || []) );

      scope.gridster = $element.addClass('gridster').find('ul').gridster(scope.options).data('gridster');

      scope.$on('ez_gridster.add_widget', function(e, widget) {
        var size_x = widget.size_x || 1,
            size_y = widget.size_y || 1;

        widget = angular.extend(widget, gridster.next_position(size_x, size_y));

        scope.widgets.push(widget);

        scope.$emit('ez_gridster.widget_added', widget);
      });

      //scope.$on('ez_gridster.clear', function(e, callback) {
//console.log('1', callback);
        //scope.gridster.remove_all_widgets(function() {
          ////scope.$apply(function() {
            //scope.widgets = [];
            //console.log('scope', scope);
//console.log('cb', callback);
            //if (callback) {
              //callback();
            //}
            //scope.$digest();
          ////});
        //});
      //});

      scope.removeWidget = function(widget, index) {
        scope.widgets.splice(index, 1);
        scope.$emit('ez_gridster.widget_removed', widget, index);
      };
    }
  };

}]);

