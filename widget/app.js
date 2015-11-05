'use strict';
(function (angular) {
  angular
    .module('eCommercePluginWidget', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          template: '<div></div>'
        })
        .when('/items', {
          templateUrl: 'templates/items.html',
          controllerAs: 'WidgetItems',
          controller: 'WidgetItemsCtrl'
        })
        .when('/item/:id', {
          templateUrl: 'templates/Item_Details.html',
          controllerAs: 'WidgetSingle',
          controller: 'WidgetSingleCtrl'
        })
        .otherwise('/');
    }])
})(window.angular);