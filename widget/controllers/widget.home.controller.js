'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetHomeCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce', 'LAYOUTS', '$rootScope',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce, LAYOUTS, $rootScope) {
        var WidgetHome = this;
        WidgetHome.data = null;
        WidgetHome.sections = null;
        //create new instance of buildfire carousel viewer
        WidgetHome.view = null;
        WidgetHome.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        WidgetHome.showDescription = function (description) {
          return !((description == '<p>&nbsp;<br></p>') || (description == '<p><br data-mce-bogus="1"></p>'));
        };

        WidgetHome.loadMore = function () {
          if (WidgetHome.busy) return;
          WidgetHome.busy = true;
          if (WidgetHome.data.content.storeName)
            getSections(WidgetHome.data.content.storeName);
          else
            WidgetHome.sections = [];
        };

        var currentStoreName = "";
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
              if (WidgetHome.data.content.storeName) {
                currentStoreName = WidgetHome.data.content.storeName;
              }
              if (!WidgetHome.data.design.sectionListLayout) {
                WidgetHome.data.design.sectionListLayout = LAYOUTS.sectionListLayout[0].name;
              }
              getSections(WidgetHome.data.content.storeName);
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
                  WidgetHome.data = event.data;
                  if (!WidgetHome.data.design)
                    WidgetHome.data.design = {};
                  if (!WidgetHome.data.design.sectionListLayout) {
                    WidgetHome.data.design.sectionListLayout = LAYOUTS.sectionListLayout[0].name;
                  }
                  if (!WidgetHome.data.content.storeName) {
                    WidgetHome.sections = [];
                    currentStoreName = "";
                    WidgetHome.offset = 0;
                    WidgetHome.busy = false;
                  }

                  if (WidgetHome.data.content.storeName && currentStoreName != WidgetHome.data.content.storeName)
                    WidgetHome.loadMore();
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
          WidgetHome.view = null;
          if (!WidgetHome.view) {
            WidgetHome.view = new buildfire.components.carousel.view("#carousel", [], "WideScreen");
          }
          if (WidgetHome.data && WidgetHome.data.content.carouselImages) {
            WidgetHome.view.loadItems(WidgetHome.data.content.carouselImages, null, "WideScreen");
          } else {
            WidgetHome.view.loadItems([]);
          }
        });


        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });

        init();
      }]);
})(window.angular);