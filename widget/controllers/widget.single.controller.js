'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetSingleCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce', 'LAYOUTS', '$rootScope', 'Buildfire', 'ViewStack',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce, LAYOUTS, $rootScope, Buildfire, ViewStack) {
        var WidgetSingle = this;
        WidgetSingle.data = null;
        WidgetSingle.item = null;

        var currentView = ViewStack.getCurrentView();

        var currentStoreName = "";

        var getProduct = function (storeName, handle) {
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              console.log("===============================", result);
              WidgetSingle.item = result;
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error In Fetching Single product Details', err);
            };
          ECommerceSDK.getProduct(storeName, handle).then(success, error);
        };

        /*
         * Fetch user's data from datastore
         */

        var init = function () {
          var success = function (result) {
              WidgetSingle.data = result.data;
              if (!WidgetSingle.data.design)
                WidgetSingle.data.design = {};
              if (!WidgetSingle.data.content)
                WidgetSingle.data.content = {};
              if (!WidgetSingle.data.settings)
                WidgetSingle.data.settings = {};
              if (WidgetSingle.data.content.storeName) {
                currentStoreName = WidgetSingle.data.content.storeName;
              }
              if (!WidgetSingle.data.design.itemListLayout) {
                WidgetSingle.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
              }
              if (WidgetSingle.data.content.storeName && currentView.params.handle)
                getProduct(WidgetSingle.data.content.storeName, currentView.params.handle);
            }
            , error = function (err) {
              console.error('Error while getting data', err);
            };
          DataStore.get(TAG_NAMES.SHOPIFY_INFO).then(success, error);
        };

        var onUpdateCallback = function (event) {
          setTimeout(function () {
            if (event && event.tag) {
              switch (event.tag) {
                case TAG_NAMES.SHOPIFY_INFO:
                  WidgetSingle.data = event.data;
                  if (!WidgetSingle.data.design)
                    WidgetSingle.data.design = {};
                  if (!WidgetSingle.data.design.itemListLayout) {
                    WidgetSingle.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
                  }
                  if (!WidgetSingle.data.content.storeName) {
                    WidgetSingle.item = null;
                    currentStoreName = "";
                  }

                  if (WidgetSingle.data.content.storeName && currentStoreName != WidgetSingle.data.content.storeName) {
                    WidgetSingle.item = null;
                    getProduct(WidgetSingle.data.content.storeName, currentView.params.handle);
                  }
                  break;
              }
              $scope.$digest();
            }
          }, 0);
        };

        /**
         * DataStore.onUpdate() is bound to listen any changes in datastore
         */
        DataStore.onUpdate().then(null, null, onUpdateCallback);


        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });

        init();
      }]);
})(window.angular);