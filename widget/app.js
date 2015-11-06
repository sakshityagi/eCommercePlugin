'use strict';
(function (angular) {
  angular
    .module('eCommercePluginWidget', ['ngRoute'])
    .config(['$routeProvider', '$compileProvider', function ($routeProvider, $compileProvider) {

      /**
       * To make href urls safe on mobile
       */
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);

      $routeProvider
        .when('/', {
          template: '<div></div>'
        })
        .when('/items/:handle', {
          templateUrl: 'templates/items.html',
          controllerAs: 'WidgetItems',
          controller: 'WidgetItemsCtrl'
        })
        .when('/item/:handle', {
          templateUrl: 'templates/Item_Details.html',
          controllerAs: 'WidgetSingle',
          controller: 'WidgetSingleCtrl'
        })
        .otherwise('/');
    }])
    .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $rootScope.$broadcast("Carousel:LOADED");
        }
      };
    }])
})(window.angular);