'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetCartCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'ECommerceSDK', '$sce', 'LAYOUTS', '$rootScope', 'Buildfire', 'ViewStack',
      function ($scope, DataStore, TAG_NAMES, ECommerceSDK, $sce, LAYOUTS, $rootScope, Buildfire, ViewStack) {

        var WidgetCart = this;
        WidgetCart.listeners = {};
        var currentView = ViewStack.getCurrentView();
        var currentStoreName = "";
        var breadCrumbFlag = true;

          buildfire.history.get('pluginBreadcrumbsOnly', function (err, result) {
              if(result && result.length) {
                  result.forEach(function(breadCrumb) {
                      if(breadCrumb.label == 'Cart') {
                          breadCrumbFlag = false;
                      }
                  });
              }
              if(breadCrumbFlag) {
                  buildfire.history.push('Cart', { elementToShow: 'Cart' });
              }
          });

        $rootScope.cartItemToUpdate = {};
        WidgetCart.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        WidgetCart.removeItemFromCart = function (item) {
          var success = function (result) {
            var index = $rootScope.cart.items.indexOf(item);
            if (index != -1) {
              $rootScope.cart.items.splice(index, 1);
            }
            if ($rootScope.cart.item_count) {
              $rootScope.cart.item_count = $rootScope.cart.item_count - item.quantity;
            }
            if ($rootScope.cart.total_price) {
              $rootScope.cart.total_price = $rootScope.cart.total_price - (item.quantity * item.price);
            }
          };

          var error = function (error) {
            console.log("Error removing item from cart:", error);
          };

          ECommerceSDK.updateCartItem(WidgetCart.data.content.storeName, item.variant_id, 0).then(success, error);
        };

        var getCart = function (storeName) {
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              console.log("^^^^^^^^^^^^^^^^^^^^^^^", result);
              $rootScope.cart = result;
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error In Fetching cart details', err);
            };
          ECommerceSDK.getCart(storeName).then(success, error);
        };

        var init = function () {
          var success = function (result) {
              WidgetCart.data = result.data;
              if (!WidgetCart.data.design)
                WidgetCart.data.design = {};
              if (!WidgetCart.data.content)
                WidgetCart.data.content = {};
              if (!WidgetCart.data.settings)
                WidgetCart.data.settings = {};
              if (WidgetCart.data.content.storeName) {
                currentStoreName = WidgetCart.data.content.storeName;
              }
              if (!WidgetCart.data.design.itemListLayout) {
                WidgetCart.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
              }
              if(!result.id) {
                  WidgetCart.data.content.storeName = TAG_NAMES.DEFAULT_STORE_NAME;
              }
              if (WidgetCart.data.content.storeName)
                getCart(WidgetCart.data.content.storeName);
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
                  WidgetCart.data = event.data;
                  if (!WidgetCart.data.design)
                    WidgetCart.data.design = {};
                  if (!WidgetCart.data.design.itemListLayout) {
                    WidgetCart.data.design.itemListLayout = LAYOUTS.itemListLayout[0].name;
                  }
                  if (!WidgetCart.data.content.storeName) {
                    WidgetCart.item = null;
                    currentStoreName = "";
                  }
                  if (!WidgetCart.data.content.storeName)
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

        WidgetCart.updateCart = function(item){
          $rootScope.cartItemToUpdate={
            variantId : item.variant_id,
            variant: item.variant_title,
            quantity:item.quantity,
            data:item
          };
          ViewStack.push({
            template: 'Update_Cart_Item',
            params: {
              handle: item.handle
            }
          });
        };

        WidgetCart.checkoutCart = function () {
          Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              console.log("#########################################", result);
              ViewStack.push({
                template: 'Checkout',
                params: {
                  url: result
                }
              });
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.error('Error while cart checkout', JSON.parse(JSON.stringify(err)));
            };
          ECommerceSDK.checkoutCart(WidgetCart.data.content.storeName).then(success, error);
        };

        $scope.$on("$destroy", function () {
          for (var i in WidgetCart.listeners) {
            if (WidgetCart.listeners.hasOwnProperty(i)) {
              WidgetCart.listeners[i]();
            }
          }
          DataStore.clearListener();
        });

        WidgetCart.listeners['POP'] = $rootScope.$on('BEFORE_POP', function (e, view) {
          console.log("SINGLE:", view.template, 'Shopping_Cart');

          if (view.template === 'Shopping_Cart') {
            $scope.$destroy();
          }
        });
        init();
      }
    ])
})(window.angular);