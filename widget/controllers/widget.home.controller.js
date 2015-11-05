'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK) {
        var WidgetHome = this;
        WidgetHome.data = null;
        WidgetHome.sections = null;


        var getSections = function (storeName) {
          var success = function (result) {
              console.log("********************************", result);
              WidgetHome.sections = result;
            }
            , error = function (err) {
              console.error('Error In Fetching Single Video Details', err);
            };
          ECommerceSDK.getSections(storeName).then(success, error);
        };

        /*
         * Fetch user's data from datastore
         */

        var init = function () {
          var success = function (result) {
              WidgetHome.data = result.data;
              if (!WidgetHome.data.design)
                WidgetHome.data.design = {};
              if (!WidgetHome.data.content)
                WidgetHome.data.content = {};
              if (!WidgetHome.data.settings)
                WidgetHome.data.settings = {};
              if (WidgetHome.data.content.storeName)
                getSections(WidgetHome.data.content.storeName);
            }
            , error = function (err) {
              console.error('Error while getting data', err);
            };
          DataStore.get(TAG_NAMES.SHOPIFY_INFO).then(success, error);
        };

        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });

        init();
      }]);
})(window.angular);