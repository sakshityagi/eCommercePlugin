'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetCheckoutCtrl', ['$scope', 'DataStore', '$rootScope', 'Buildfire', 'ViewStack', '$sce',
      function ($scope, DataStore, $rootScope, Buildfire, ViewStack, $sce) {

        var WidgetCheckout = this;
        var breadCrumbFlag = true;
        WidgetCheckout.listeners = {};
          buildfire.history.get('pluginBreadcrumbsOnly', function (err, result) {
              if(result && result.length) {
                  result.forEach(function(breadCrumb) {
                      if(breadCrumb.label == 'Checkout') {
                          breadCrumbFlag = false;
                      }
                  });
              }
              if(breadCrumbFlag) {
                  buildfire.history.push('Checkout', { elementToShow: 'Checkout' });
              }
          });
        WidgetCheckout.currentView = ViewStack.getCurrentView();
        if(WidgetCheckout.currentView.params) {
          WidgetCheckout.url = WidgetCheckout.currentView.params.url;
        }

        WidgetCheckout.safeUrl = function (url) {
          if (url)
            return $sce.trustAsResourceUrl(url);
        };
      }
    ])
})(window.angular);