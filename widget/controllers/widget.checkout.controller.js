'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetCheckoutCtrl', ['$scope', 'DataStore', '$rootScope', 'Buildfire', 'ViewStack', '$sce',
      function ($scope, DataStore, $rootScope, Buildfire, ViewStack, $sce) {

        var WidgetCheckout = this;
        WidgetCheckout.listeners = {};
        var currentView = ViewStack.getCurrentView();
        WidgetCheckout.url = currentView.params.url;

        WidgetCheckout.safeUrl = function (url) {
          if (url)
            return $sce.trustAsResourceUrl(url);
        };

      }
    ])
})(window.angular);