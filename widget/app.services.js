'use strict';

(function (angular, buildfire) {
  angular.module('eCommercePluginWidget')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory('DataStore', ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES',
      function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
        var onUpdateListeners = [];
        return {
          get: function (_tagName) {
            var deferred = $q.defer();
            Buildfire.datastore.get(_tagName, function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            });
            return deferred.promise;
          },
          getById: function (_id, _tagName) {
            var deferred = $q.defer();
            if (typeof _id == 'undefined') {
              return deferred.reject(new Error({
                code: STATUS_CODE.UNDEFINED_ID,
                message: STATUS_MESSAGES.UNDEFINED_ID
              }));
            }
            Buildfire.datastore.get(_tagName, function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            });
            return deferred.promise;
          },
          insert: function (_item, _tagName) {
            var deferred = $q.defer();
            if (typeof _item == 'undefined') {
              return deferred.reject(new Error({
                code: STATUS_CODE.UNDEFINED_DATA,
                message: STATUS_MESSAGES.UNDEFINED_DATA
              }));
            }
            if (Array.isArray(_item)) {
              return deferred.reject(new Error({
                code: STATUS_CODE.ITEM_ARRAY_FOUND,
                message: STATUS_MESSAGES.ITEM_ARRAY_FOUND
              }));
            } else {
              Buildfire.datastore.insert(_item, _tagName, false, function (err, result) {
                if (err) {
                  return deferred.reject(err);
                } else if (result) {
                  return deferred.resolve(result);
                }
              });
            }
            return deferred.promise;
          },
          update: function (_id, _item, _tagName) {
            var deferred = $q.defer();
            if (typeof _id == 'undefined') {
              return deferred.reject(new Error({
                code: STATUS_CODE.UNDEFINED_ID,
                message: STATUS_MESSAGES.UNDEFINED_ID
              }));
            }
            if (typeof _item == 'undefined') {
              return deferred.reject(new Error({
                code: STATUS_CODE.UNDEFINED_DATA,
                message: STATUS_MESSAGES.UNDEFINED_DATA
              }));
            }
            Buildfire.datastore.update(_id, _item, _tagName, function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            });
            return deferred.promise;
          },
          save: function (_item, _tagName) {
            var deferred = $q.defer();
            if (typeof _item == 'undefined') {
              return deferred.reject(new Error({
                code: STATUS_CODE.UNDEFINED_DATA,
                message: STATUS_MESSAGES.UNDEFINED_DATA
              }));
            }
            Buildfire.datastore.save(_item, _tagName, function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            });
            return deferred.promise;
          },
          deleteById: function (_id, _tagName) {
            var deferred = $q.defer();
            if (typeof _id == 'undefined') {
              return deferred.reject(new Error({
                code: STATUS_CODE.UNDEFINED_ID,
                message: STATUS_MESSAGES.UNDEFINED_ID
              }));
            }
            Buildfire.datastore.delete(_id, _tagName, function (err, result) {
              if (err) {
                return deferred.reject(err);
              } else if (result) {
                return deferred.resolve(result);
              }
            });
            return deferred.promise;
          },
          onUpdate: function () {
            var deferred = $q.defer();
            var onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
              if (!event) {
                return deferred.notify(new Error({
                  code: STATUS_CODE.UNDEFINED_DATA,
                  message: STATUS_MESSAGES.UNDEFINED_DATA
                }), true);
              } else {
                return deferred.notify(event);
              }
            }, true);
            onUpdateListeners.push(onUpdateFn);
            return deferred.promise;
          },
          clearListener: function () {
            onUpdateListeners.forEach(function (listner) {
              listner.clear();
            });
            onUpdateListeners = [];
          }
        }
      }])
    .factory('ECommerceSDK', ['$q', 'STATUS_CODE', 'STATUS_MESSAGES', 'PAGINATION',
      function ($q, STATUS_CODE, STATUS_MESSAGES, PAGINATION) {
        var getSections = function (storeName, pageNumber) {
          var deferred = $q.defer();
          var _url = '';
          if (!storeName) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          } else {
            var eCommerceSDKObj = new eCommerceSDK.account({accountName: storeName});
            eCommerceSDKObj.getCollections({
              pageSize: PAGINATION.sectionsCount,
              pageNumber: pageNumber || 1
            }, function (collections) {
              if (collections)
                deferred.resolve(collections);
              else
                deferred.resolve(null);
            });
          }
          return deferred.promise;
        };
        var getItems = function (storeName, handle, pageNumber) {
          var deferred = $q.defer();
          var _url = '';
          if (!storeName) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          } else {
            var eCommerceSDKObj = new eCommerceSDK.account({accountName: storeName});
            eCommerceSDKObj.getProducts(handle, {
              pageSize: PAGINATION.sectionsCount,
              pageNumber: pageNumber || 1
            }, function (products) {
              if (products)
                deferred.resolve(products);
              else
                deferred.resolve(null);
            });
          }
          return deferred.promise;
        };
        var getProduct = function (storeName, handle) {
          var deferred = $q.defer();
          var _url = '';
          if (!storeName) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          } else {
            var eCommerceSDKObj = new eCommerceSDK.account({accountName: storeName});
            eCommerceSDKObj.getProduct(handle, {}, function (product) {
              if (product)
                deferred.resolve(product);
              else
                deferred.resolve(null);
            });
          }
          return deferred.promise;
        };
        var getCart = function (storeName) {
          var deferred = $q.defer();
          var _url = '';
          if (!storeName) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          } else {
            var eCommerceSDKObj = new eCommerceSDK.account({accountName: storeName});
            eCommerceSDKObj.getCart({}, function (cart) {
              if (cart)
                deferred.resolve(cart);
              else
                deferred.resolve(null);
            });
          }
          return deferred.promise;
        };
        var addItemInCart = function (storeName, variant_id, quantity) {
          var deferred = $q.defer();
          var _url = '';
          if (!storeName) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          } else {
            var eCommerceSDKObj = new eCommerceSDK.account({accountName: storeName});
            eCommerceSDKObj.addItem(variant_id, quantity, {}, function (cart) {
              if (cart)
                deferred.resolve(cart);
              else
                deferred.resolve(null);
            });
          }
          return deferred.promise;
        };
        var updateCartItem = function (storeName, variant_id, quantity) {
          var deferred = $q.defer();
          var _url = '';
          if (!storeName) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          } else {
            var eCommerceSDKObj = new eCommerceSDK.account({accountName: storeName});
            eCommerceSDKObj.changeItem(variant_id, quantity, {}, function (cart) {
              if (cart)
                deferred.resolve(cart);
              else
                deferred.resolve(null);
            });
          }
          return deferred.promise;
        };
        var checkoutCart = function (storeName) {
          var deferred = $q.defer();
          var _url = '';
          if (!storeName) {
            deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          } else {
            var eCommerceSDKObj = new eCommerceSDK.account({accountName: storeName});
            eCommerceSDKObj.checkout(function (redirectUrl) {
              if (redirectUrl)
                deferred.resolve(redirectUrl);
              else
                deferred.resolve(null);
            });
          }
          return deferred.promise;
        };
        return {
          getSections: getSections,
          getItems: getItems,
          getProduct: getProduct,
          getCart: getCart,
          addItemInCart: addItemInCart,
          updateCartItem: updateCartItem,
          checkoutCart: checkoutCart
        };
      }])
    .factory('Location', [function () {
      var _location = window.location;
      return {
        goTo: function (path) {
          _location.href = path;
        }
      };
    }])
    .factory('ViewStack', ['$rootScope', function ($rootScope) {
      var views = [];
      var viewMap = {};
      return {
        push: function (view) {
          if (viewMap[view.template]) {
            this.pop();
          }
          else {
            viewMap[view.template] = 1;
            views.push(view);
            $rootScope.$broadcast('VIEW_CHANGED', 'PUSH', view);
          }
          return view;
        },
        pop: function () {
          $rootScope.$broadcast('BEFORE_POP', views[views.length - 1]);
          var view = views.pop();
          delete viewMap[view.template];
          $rootScope.$broadcast('VIEW_CHANGED', 'POP', view);
          return view;
        },
        hasViews: function () {
          return !!views.length;
        },
        getCurrentView: function () {
          return views.length && views[views.length - 1] || {};
        },
        popAllViews: function () {
          $rootScope.$broadcast('VIEW_CHANGED', 'POPALL', views);
          views = [];
          viewMap = {};
        }
      };
    }])
})(window.angular, window.buildfire);