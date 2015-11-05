'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce) {
        var WidgetHome = this;
        WidgetHome.data = null;
        WidgetHome.sections = null;
        WidgetHome.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        WidgetHome.showDescription = function (description) {
          return !((description == '<p>&nbsp;<br></p>') || (description == '<p><br data-mce-bogus="1"></p>'));
        };


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