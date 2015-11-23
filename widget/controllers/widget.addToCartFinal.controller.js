'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetAddToCartFinalCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce', 'LAYOUTS', '$rootScope', 'PAGINATION', 'Buildfire', 'ViewStack',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce, LAYOUTS, $rootScope, PAGINATION, Buildfire, ViewStack) {

        var WidgetAddToCartFinal = this;
        WidgetAddToCartFinal.listeners = {};
        WidgetAddToCartFinal.currentAddedItemInCart = {
          Variant: $rootScope.addedToCart
        };
        var currentView = ViewStack.getCurrentView();
        console.log("currentView", currentView);
        var currentStoreName = "";

        WidgetAddToCartFinal.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        var getProduct = function (storeName, handle) {
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              console.log("===============================", result);
              WidgetAddToCartFinal.item = result;
              console.log("WidgetAddToCartFinal", WidgetAddToCartFinal)
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error In Fetching Single product Details', err);
            };
          ECommerceSDK.getProduct(storeName, handle).then(success, error);
        };

        var init = function () {
          var success = function (result) {
              WidgetAddToCartFinal.data = result.data;
              if (!WidgetAddToCartFinal.data.design)
                WidgetAddToCartFinal.data.design = {};
              if (!WidgetAddToCartFinal.data.content)
                WidgetAddToCartFinal.data.content = {};
              if (!WidgetAddToCartFinal.data.settings)
                WidgetAddToCartFinal.data.settings = {};
              if (WidgetAddToCartFinal.data.content.storeName) {
                currentStoreName = WidgetAddToCartFinal.data.content.storeName;
              }
              if (!WidgetAddToCartFinal.data.design.itemListLayout) {
                WidgetAddToCartFinal.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
              }
              if (WidgetAddToCartFinal.data.content.storeName && currentView.params.handle)
                getProduct(WidgetAddToCartFinal.data.content.storeName, currentView.params.handle);
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
                  WidgetAddToCartFinal.data = event.data;
                  if (!WidgetAddToCartFinal.data.design)
                    WidgetAddToCartFinal.data.design = {};
                  if (!WidgetAddToCartFinal.data.design.itemListLayout) {
                    WidgetAddToCartFinal.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
                  }
                  if (!WidgetAddToCartFinal.data.content.storeName) {
                    WidgetAddToCartFinal.item = null;
                    currentStoreName = "";
                  }

                  if (WidgetAddToCartFinal.data.content.storeName && currentStoreName != WidgetAddToCartFinal.data.content.storeName) {
                    WidgetAddToCartFinal.item = null;
                    getProduct(WidgetAddToCartFinal.data.content.storeName, currentView.params.handle);
                  }
                  if (!WidgetAddToCartFinal.data.content.storeName)
                    ViewStack.popAllViews();
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

        WidgetAddToCartFinal.updateVariant = function (variant) {
          WidgetAddToCartFinal.currentAddedItemInCart.Variant = variant;
          console.log("WidgetAddToCartFinal.currentAddedItemInCart.Variant", WidgetAddToCartFinal.currentAddedItemInCart.Variant)
        };


        WidgetAddToCartFinal.addProductToCart = function () {
          var success = function (result) {
            console.log("****************************Success************", result);
            ViewStack.push({
              template: 'Shopping_Cart'
            });
          };

          var error = function (error) {
            console.log("****************************Error************", error);
          };
          ECommerceSDK.addItemInCart(WidgetAddToCartFinal.data.content.storeName,
            WidgetAddToCartFinal.currentAddedItemInCart.Variant.variantId,
            WidgetAddToCartFinal.currentAddedItemInCart.Variant.quantity)
            .then(success, error);
        };


        WidgetAddToCartFinal.cancelClick = function(){
          ViewStack.pop();
        };

        $scope.$on("$destroy", function () {
          for (var i in WidgetAddToCartFinal.listeners) {
            if (WidgetAddToCartFinal.listeners.hasOwnProperty(i)) {
              WidgetAddToCartFinal.listeners[i]();
            }
          }
          //DataStore.clearListener();
        });


        WidgetAddToCartFinal.listeners['POP'] = $rootScope.$on('BEFORE_POP', function (e, view) {
          console.log("SINGLE:", view.template, 'Add_To_Cart_2');
          if (view.template === 'Add_To_Cart_2') {
            $scope.$destroy();
          }
        });
        init();
      }
    ])
})(window.angular);