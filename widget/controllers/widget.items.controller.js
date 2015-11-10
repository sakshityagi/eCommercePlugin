'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetItemsCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce', 'LAYOUTS', '$rootScope', 'PAGINATION', 'Buildfire', '$routeParams',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce, LAYOUTS, $rootScope, PAGINATION, Buildfire, $routeParams) {
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&");
        $rootScope.showHome = false;
        var WidgetItems = this;
        WidgetItems.data = null;
        WidgetItems.items = [];
        WidgetItems.busy = false;
        WidgetItems.pageNumber = 1;
        //create new instance of buildfire carousel viewer
        WidgetItems.view = null;
        WidgetItems.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        WidgetItems.showDescription = function (description) {
          return !((description == '<p>&nbsp;<br></p>') || (description == '<p><br data-mce-bogus="1"></p>'));
        };

        WidgetItems.loadMore = function () {
          if (WidgetItems.busy) return;
         // WidgetItems.busy = true;
          if (WidgetItems.data && $routeParams.handle) {
            getItems(WidgetItems.data.content.storeName, $routeParams.handle);
          }
          else{
            WidgetItems.items = [];}
        };

        var currentStoreName = "";
        var getItems = function (storeName, handle) {
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              console.log("********************************", result);
              WidgetItems.items = WidgetItems.items.length ? WidgetItems.items.concat(result) : result;
              WidgetItems.pageNumber = WidgetItems.pageNumber + 1;
              if (result.length == PAGINATION.itemsCount) {
                WidgetItems.busy = false;
              }
            }
            , error = function (err) {
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
              if (!WidgetItems.data.design.sectionListLayout) {
                WidgetItems.data.design.sectionListLayout = LAYOUTS.sectionListLayout[0].name;
              }
                WidgetItems.loadMore();
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
                  if (!WidgetItems.data.design.sectionListLayout) {
                    WidgetItems.data.design.sectionListLayout = LAYOUTS.sectionListLayout[0].name;
                  }
                  if (!WidgetItems.data.content.storeName) {
                    WidgetItems.items = [];
                    currentStoreName = "";
                    WidgetItems.offset = 0;
                    WidgetItems.busy = false;
                  }

                  if (WidgetItems.data.content.storeName && currentStoreName != WidgetItems.data.content.storeName)
                    WidgetItems.loadMore();
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


        $rootScope.$on("Carousel:LOADED", function () {
          WidgetItems.view = null;
          if (!WidgetItems.view) {
            WidgetItems.view = new buildfire.components.carousel.view("#carousel", [], "WideScreen");
          }
          if (WidgetItems.data && WidgetItems.data.content.carouselImages) {
            WidgetItems.view.loadItems(WidgetItems.data.content.carouselImages, null, "WideScreen");
          } else {
            WidgetItems.view.loadItems([]);
          }
        });


        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });

        init();
      }]);
})(window.angular);