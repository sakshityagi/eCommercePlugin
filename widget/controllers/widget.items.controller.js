'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetItemsCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce', 'LAYOUTS', '$rootScope', 'PAGINATION', 'Buildfire', 'ViewStack',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce, LAYOUTS, $rootScope, PAGINATION, Buildfire, ViewStack) {
        var WidgetItems = this;
        WidgetItems.data = null;
        WidgetItems.items = [];
        WidgetItems.busy = false;
        WidgetItems.pageNumber = 1;

        var currentView = ViewStack.getCurrentView();

        WidgetItems.loadMore = function () {
          console.log("loading some more...");
          if (WidgetItems.busy) return;
          WidgetItems.busy = true;
          console.log(WidgetItems.data, currentView.params);
          if (WidgetItems.data && currentView.params.handle) {
            getItems(WidgetItems.data.content.storeName, currentView.params.handle);
          }
          else {
            WidgetItems.items = [];
          }
        };

        WidgetItems.showItem = function (handle) {
          ViewStack.push({
            template: 'Item_Details',
            params: {
              handle: handle
            }
          });
        };

        var currentStoreName = "";

        var getItems = function (storeName, handle) {
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              console.log("...........................", result);
              WidgetItems.items = WidgetItems.items.length ? WidgetItems.items.concat(result) : result;
              WidgetItems.pageNumber = WidgetItems.pageNumber + 1;
              if (result.length == PAGINATION.itemsCount) {
                WidgetItems.busy = false;
              }
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error In Fetching items list', err);
            };
          ECommerceSDK.getItems(storeName, handle, WidgetItems.pageNumber).then(success, error);
        };

        /*
         * Fetch user's data from datastore
         */

        var init = function () {
          var success = function (result) {
              console.log("djnfdsjknfkjdsnbsfkgnbkj---", result);
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
            }
            , error = function (err) {
              console.error('Error while getting data', err);
            };
          DataStore.get(TAG_NAMES.SHOPIFY_INFO).then(success, error);
        };

        WidgetItems.changeItemView = function (itemLayout) {
          if (itemLayout == 'itemLayoutOne') {
            WidgetItems.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
          }
          else {
            WidgetItems.data.design.itemListLayout = LAYOUTS.itemListLayout[1].name;
           }
            saveData(WidgetItems.data,TAG_NAMES.SHOPIFY_INFO);
          ViewStack.pop();
          ViewStack.push({
              template : WidgetItems.data.design.itemListLayout,
              params: {
                handle: currentView.params.handle
              }
            });
         }
        var saveData = function (newObj, tag) {
          if (typeof newObj === 'undefined') {
            return;
          }
          var success = function (result) {
                console.info('Saved data result: ', result);
              }
              , error = function (err) {
                console.error('Error while saving data : ', err);
              };
          DataStore.save(newObj, tag).then(success, error);
        };
        var onUpdateCallback = function (event) {
          setTimeout(function () {
            if (event && event.tag) {
              switch (event.tag) {
                case TAG_NAMES.SHOPIFY_INFO:
                  WidgetItems.data = event.data;
                    console.log("WidgetItems.data.design.itemListLayout",WidgetItems.data.design.itemListLayout
                    )
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
                    ViewStack.popAllViews();
                  }

                  if (WidgetItems.data.content.storeName && currentStoreName != WidgetItems.data.content.storeName) {
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
        });

        init();
      }]);
})(window.angular);