'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetItemsCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce', 'LAYOUTS', '$rootScope', 'PAGINATION', 'Buildfire', '$routeParams',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce, LAYOUTS, $rootScope, PAGINATION, Buildfire, $routeParams) {
        var WidgetItems = this;
        WidgetItems.data = null;
        WidgetItems.items = [];
        WidgetItems.busy = false;
        WidgetItems.pageNumber = 1;
        WidgetItems.loadMore = function () {
          if (WidgetItems.busy) return;
          WidgetItems.busy = true;
          if (WidgetItems.data && $routeParams.handle) {
            getItems(WidgetItems.data.content.storeName, $routeParams.handle);
          }
          else {
            WidgetItems.items = [];
          }
        };

        var currentStoreName = "";
        var getItems = function (storeName, handle) {
          Buildfire.spinner.show();
          var success = function (result) {
              $rootScope.showCategories = false;
              Buildfire.spinner.hide();
              console.log("...........................", result);
              WidgetItems.items = WidgetItems.items.length ? WidgetItems.items.concat(result) : result;
              WidgetItems.pageNumber = WidgetItems.pageNumber + 1;
              if (result.length == PAGINATION.itemsCount) {
                WidgetItems.busy = false;
              }
            }
            , error = function (err) {
              $rootScope.showCategories = false;
              Buildfire.spinner.hide();
              console.error('Error In Fetching Single Video Details', err);
            };
          ECommerceSDK.getItems(storeName, handle, WidgetItems.pageNumber).then(success, error);
        };

        /*
         * Fetch user's data from datastore
         */

        var init = function () {
          var success = function (result) {
              WidgetItems.data = result.data;
              if (!WidgetItems.data.design)
                WidgetItems.data.design = {};
              if (!WidgetItems.data.content)
                WidgetItems.data.content = {};
              if (!WidgetItems.data.settings)
                WidgetItems.data.settings = {};
              if (WidgetItems.data.content.storeName) {
                currentStoreName = WidgetItems.data.content.storeName;
              }
              if (!WidgetItems.data.design.itemListLayout) {
                WidgetItems.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
              }
              $rootScope.showCategories = false;
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
                  WidgetItems.data = event.data;
                  if (!WidgetItems.data.design)
                    WidgetItems.data.design = {};
                  if (!WidgetItems.data.design.itemListLayout) {
                    WidgetItems.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
                  }
                  if (!WidgetItems.data.content.storeName) {
                    WidgetItems.items = [];
                    currentStoreName = "";
                    WidgetItems.offset = 0;
                    WidgetItems.busy = false;
                  }

                  if (WidgetItems.data.content.storeName && currentStoreName != WidgetItems.data.content.storeName){
                    WidgetItems.items = [];
                    WidgetItems.busy = false;
                    WidgetItems.pageNumber = 1;
                    WidgetItems.loadMore();
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
          $rootScope.$broadcast('ROUTE_CHANGED');
        });

        init();
      }]);
})(window.angular);