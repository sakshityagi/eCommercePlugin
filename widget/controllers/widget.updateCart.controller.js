'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetUpdateCartCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce', 'LAYOUTS', '$rootScope', 'PAGINATION', 'Buildfire', 'ViewStack',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce, LAYOUTS, $rootScope, PAGINATION, Buildfire, ViewStack) {

        var WidgetUpdateCart = this;
        WidgetUpdateCart.listeners = {};
        WidgetUpdateCart.currentAddedItemInCart = {
          Variant: $rootScope.cartItemToUpdate
        };
        var currentView = ViewStack.getCurrentView();
        var currentStoreName = "";

        WidgetUpdateCart.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        var getCart = function (storeName) {
          console.log("^^^^^^^^^^^^^^^^^^^^^^lkkklk");
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              console.log("^^^^^^^^^^^^^^^^^^^^^^^vvvvv", result);
              WidgetUpdateCart.cartUpdated = result;
              $rootScope.cart = WidgetUpdateCart.cartUpdated;
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error In Fetching cart details', err);
            };
          ECommerceSDK.getCart(storeName).then(success, error);
        };

        var getProduct = function (storeName, handle) {
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              console.log("===============================", result);
              WidgetUpdateCart.item = result;
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error In Fetching Single product Details', err);
            };
          ECommerceSDK.getProduct(storeName, handle).then(success, error);
        };

        var init = function () {
          var success = function (result) {
              WidgetUpdateCart.data = result.data;
              if (!WidgetUpdateCart.data.design)
                WidgetUpdateCart.data.design = {};
              if (!WidgetUpdateCart.data.content)
                WidgetUpdateCart.data.content = {};
              if (!WidgetUpdateCart.data.settings)
                WidgetUpdateCart.data.settings = {};
              if (WidgetUpdateCart.data.content.storeName) {
                currentStoreName = WidgetUpdateCart.data.content.storeName;
              }
              if (!WidgetUpdateCart.data.design.itemListLayout) {
                WidgetUpdateCart.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
              }
              if(!result.id) {
                  WidgetUpdateCart.data.content.storeName = TAG_NAMES.DEFAULT_STORE_NAME;
              }
              if (WidgetUpdateCart.data.content.storeName && currentView.params.handle)
                getProduct(WidgetUpdateCart.data.content.storeName, currentView.params.handle);
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
                  WidgetUpdateCart.data = event.data;
                  if (!WidgetUpdateCart.data.design)
                    WidgetUpdateCart.data.design = {};
                  if (!WidgetUpdateCart.data.design.itemListLayout) {
                    WidgetUpdateCart.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
                  }
                  if (!WidgetUpdateCart.data.content.storeName) {
                    WidgetUpdateCart.item = null;
                    currentStoreName = "";
                  }
                  if (!WidgetUpdateCart.data.content.storeName)
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

        WidgetUpdateCart.updateVariant = function (variant) {
          WidgetUpdateCart.currentAddedItemInCart.Variant = {
            variantId: variant.id,
            variantNewId: variant.id,
            title: variant.title,
            quantity: $rootScope.cartItemToUpdate.quantity
          };

          console.log("WidgetUpdateCart.currentAddedItemInCart.Variant", WidgetUpdateCart.currentAddedItemInCart.Variant)
        };

        WidgetUpdateCart.cancelClick = function () {
          ViewStack.pop();
        };

        WidgetUpdateCart.goToCart = function () {
          ViewStack.push({
            template: 'Shopping_Cart'
          });
        };


        WidgetUpdateCart.updateProductToCart = function () {
          var success = function (result) {
            console.log("****************************Success************", result);
            if (WidgetUpdateCart.currentAddedItemInCart.Variant.quantity == 0) {
              var success = function (result) {
                console.log("****************************Success************", result);
                getCart(WidgetUpdateCart.data.content.storeName);
              };
              var error = function (error) {
                console.log("****************************Error************", error);
              };
              ECommerceSDK.addItemInCart(WidgetUpdateCart.data.content.storeName,
                WidgetUpdateCart.currentAddedItemInCart.Variant.variantNewId,
                $rootScope.cartItemToUpdate.quantity)
                .then(success, error);
            } else {
              getCart(WidgetUpdateCart.data.content.storeName);
            }

            ViewStack.push({
              template: 'Shopping_Cart'
            });
          };

          var error = function (error) {
            console.log("****************************Error************", error);
          };

          if (WidgetUpdateCart.currentAddedItemInCart.Variant.variantId != $rootScope.cartItemToUpdate.variantId) {
            WidgetUpdateCart.currentAddedItemInCart.Variant.quantity = 0;
            WidgetUpdateCart.currentAddedItemInCart.Variant.variantId = $rootScope.cartItemToUpdate.variantId;
          }

          ECommerceSDK.updateCartItem(WidgetUpdateCart.data.content.storeName,
            WidgetUpdateCart.currentAddedItemInCart.Variant.variantId,
            WidgetUpdateCart.currentAddedItemInCart.Variant.quantity)
            .then(success, error);
        };

        $scope.$on("$destroy", function () {
          for (var i in WidgetUpdateCart.listeners) {
            if (WidgetUpdateCart.listeners.hasOwnProperty(i)) {
              WidgetUpdateCart.listeners[i]();
            }
          }
          DataStore.clearListener();
        });


        WidgetUpdateCart.listeners['POP'] = $rootScope.$on('BEFORE_POP', function (e, view) {
          console.log("SINGLE:", view.template, 'update_cart');
          if (view.template === 'Update_Cart_Item') {
            $scope.$destroy();
          }
        });
        init();
      }
    ])
})(window.angular);