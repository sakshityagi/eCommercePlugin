'use strict';
(function (angular,buildfire) {
  angular
    .module('eCommercePluginWidget', ['ngRoute','infinite-scroll','ngAnimate'])
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
    .run(['Location', '$location','$rootScope', function (Location, $location, $rootScope) {
      buildfire.navigation.onBackButtonClick = function () {
        if ($location.path() != "/items") {
          $rootScope.showCategories = true;
          Location.goTo('#/');
        }
        else {
          buildfire.navigation.navigateHome ();
        }
      };
    }]).filter('getImageUrl', ['Buildfire', function (Buildfire) {
        return function (url, width, height, type) {
          if (type == 'resize')
            return Buildfire.imageLib.resizeImage(url, {
              width: width,
              height: height
            });
          else
            return Buildfire.imageLib.cropImage(url, {
              width: width,
              height: height
            });
        }
      }])
})(window.angular,window.buildfire);