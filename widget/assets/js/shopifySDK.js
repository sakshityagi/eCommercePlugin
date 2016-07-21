if (typeof (eCommerceSDK) == "undefined") eCommerceSDK = {};

eCommerceSDK.api = {
  apiTimeout: 30000
  , server: 'https://{0}.myshopify.com/'
  , _fullLogging: false
  , get: function (id, accountName, method, params, callback, errorCallback) {
    var self = this;
    var queryString = '';

    if (params) {
      params.forEach(function (element) {
        if (queryString != '')
          queryString += '&';
        queryString += element.key + '=' + element.value;
      });
    }

    var serverUrl = this.server.replace("{0}", accountName) + method + ".json?" + queryString;

    try {
      var tmr = null;
      if (self._fullLogging && console.log)
        console.info("Call: " + JSON.stringify(serverUrl));
      var p = $.ajax({
        url: serverUrl,
        dataType: 'jsonp',
        timeout: this.apiTimeout,
        success: function(result) {
          console.log("Success......");
          if (tmr) clearTimeout(tmr);

          if (self._fullLogging)
            console.log("Result: " + JSON.stringify(result));

          if (callback) callback(result);
        },
        error: function(e) {
          if (errorCallback)
            errorCallback(e);
        }
      });
    }
    catch (e) {

      if (errorCallback)
        errorCallback(e);
      else if (console.log)
        console.error(e.message);
    }
  }
  , post: function (id, accountName, method, params, callback, errorCallback, doCallbackDelay) {
    var serverUrl = this.server.replace("{0}", accountName) + method;
    var hasResponded = false;

    $('#iframeECommerceShopify').remove();
    $('#formECommerceShopify').remove();

    var body = $('body')[0];

    var iframe = document.createElement('iframe');
    iframe.name = "iframeECommerceShopify";
    iframe.id = iframe.name;
    $(iframe).hide();
    body.appendChild(iframe);

    var f = document.createElement('form');
    f.id = "formECommerceShopify";
    f.target = iframe.name;
    $(f).hide();
    body.appendChild(f);
    f.method = 'POST';
    f.action = serverUrl;

    if (params) {
      params.forEach(function (element) {
        var v = document.createElement('input');
        v.setAttribute('type', 'hidden');
        v.setAttribute('name', element.key);
        v.setAttribute('value', element.value);
        f.appendChild(v);
      });
    }

    var r = document.createElement('input');
    r.setAttribute('type', 'hidden');
    r.setAttribute('name', 'return_to');
    r.setAttribute('value', 'back');

    f.appendChild(r);
    f.submit();

    setTimeout(function() {
      if(doCallbackDelay && !hasResponded) {
        hasResponded = true;
        if (callback)
          return callback();
      }
    }, 3000);

    iframe.onload = function () {
      $(iframe).remove();
      $(f).remove();
      hasResponded = true;
      if (callback)
        return callback();
    };

    iframe.onerror = function () {
      $(iframe).remove();
      $(f).remove();
      if (errorCallback)
        errorCallback();
      else {
        if (callback)
          callback();
      }
    };

    return false;
  }
};

eCommerceSDK.tools = {
  /*

   Override so that eCommerceSDK.tools.formatMoney returns pretty
   money values instead of cents.

   */
  money_format: null,

  /*

   onItemAdded = function(line_item) {
   $('message').update('Added '+line_item.title + '...');
   }

   */

  /* Tools */

  formatMoney: function (cents, format) {
    if (typeof cents == 'string') cents = cents.replace('.', '');
    var value = '';
    var patt = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = (format || this.money_format || '$ {{amount}}');

    function addCommas(moneyString) {
      return moneyString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + ',');
    }

    switch (formatString.match(patt)[1]) {
      case 'amount':
        value = addCommas(this.floatToString(cents / 100.0, 2));
        break;
      case 'amount_no_decimals':
        value = addCommas(this.floatToString(cents / 100.0, 0));
        break;
      case 'amount_with_comma_separator':
        value = this.floatToString(cents / 100.0, 2).replace(/\./, ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = addCommas(this.floatToString(cents / 100.0, 0)).replace(/\./, ',');
        break;
    }
    return formatString.replace(patt, value);
  },

  resizeImage: function (image, size) {
    try {
      if (size == 'original') {
        return image;
      }
      else {
        var matches = image.match(/(.*\/[\w\-\_\.]+)\.(\w{2,4})/);
        return matches[1] + '_' + size + '.' + matches[2];
      }
    } catch (e) {
      return image;
    }
  },

  /* Used by Tools */

  floatToString: function (numeric, decimals) {
    var amount = numeric.toFixed(decimals).toString();
    if (amount.match(/^\.\d+/)) {
      return "0" + amount;
    }
    else {
      return amount;
    }
  },

  /* Used by API */

  attributeToString: function (attribute) {
    if ((typeof attribute) !== 'string') {
      // Converts to a string.
      attribute += '';
      if (attribute === 'undefined') {
        attribute = '';
      }
    }
    // Removing leading and trailing whitespace.
    return $.trim(attribute);
  }
};

// -------------------------------------------------------------------------------------
// options: {accountName:'shopifyaccount'}
// -------------------------------------------------------------------------------------
eCommerceSDK.account = function (options) {
  if (!options || !(options.accountName)) {
    throw ("missing account Name");
    return;
  }

  this.accountName = options.accountName;
  if (options.moneyFormat)
    eCommerceSDK.tools.money_format = options.moneyFormat;
  else
    eCommerceSDK.tools.money_format = '$ {{amount}}';
};

eCommerceSDK.account.prototype = {
  accountName: null,

  registerCallbacks: function (method, options, callback) {
    if (!this.callbacks)
      this.callbacks = {};
    if (!this.callbacks[method])
      this.callbacks[method] = [];
    this.callbacks[method].push({options: options, callback: callback});
  },

  getRegisteredCallbacks: function (method) {
    if (!this.callbacks)
      this.callbacks = {};
    if (!this.callbacks[method])
      this.callbacks[method] = [];
    return this.callbacks[method];
  },

  onError: function (XMLHttpRequest, textStatus) {
    // Shopify returns a description of the error in XMLHttpRequest.responseText.
    // It is JSON.
    // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    if (!!data.message) {
      console.error(data.message + '(' + data.status + '): ' + data.description);
    } else {
      console.error('Error : ' + ECommerce.fullMessagesFromErrors(data).join('; ') + '.');
    }
  },

  fullMessagesFromErrors: function (errors) {
    var fullMessages = [];
    $.each(errors, function (attribute, messages) {
      $.each(messages, function (index, message) {
        fullMessages.push(attribute + ' ' + message);
      });
    });
    return fullMessages
  },

  // -------------------------------------------------------------------------------------
  // POST to cart/add.js returns the JSON of the line item associated with the added item.
  // -------------------------------------------------------------------------------------
  addItem: function (variant_id, quantity, options, callback) {
    var self = this;

    var params = [];
    params.push({key: 'id', value: variant_id});
    params.push({key: 'quantity', value: quantity || 1});

    eCommerceSDK.api.post(1, this.accountName, 'cart/add.js', params, function (result) {
      if (callback) {
        callback(result);
      }
      self.getCart(null, null);
    }, null, true);
  },

  //// ---------------------------------------------------------
  //// POST to cart/change.js returns the cart in JSON.
  //// ---------------------------------------------------------
  removeItem: function (variant_id, options, callback) {
    var self = this;

    var params = [];
    params.push({key: 'id', value: variant_id});
    params.push({key: 'quantity', value: 0});

    eCommerceSDK.api.post(1, this.accountName, 'cart/change.js', params, function (result) {
      if (callback) {
        callback(result);
      }

      self.getCart(null, null);
    }, null, true);
  },

  //// ---------------------------------------------------------
  //// POST to cart/change.js returns the cart in JSON.
  //// ---------------------------------------------------------
  changeItem: function (variant_id, quantity, options, callback) {
    var self = this;

    var params = [];
    params.push({key: 'id', value: variant_id});
    params.push({key: 'quantity', value:quantity|| 0});
    eCommerceSDK.api.post(1, this.accountName, 'cart/change.js', params, function (result) {
      if (callback) {
        callback(result);
      }

      self.getCart(null, null);
    }, null, true);
  },

  // ---------------------------------------------------------
  // GET cart.js returns the cart in JSON.
  // ---------------------------------------------------------
  getCart: function (options, callback) {
    var self = this;
    eCommerceSDK.api.get(1, this.accountName, 'cart', [], function (result) {
      if (callback)
        callback(result);

      var callbacks = self.getRegisteredCallbacks('getCart');
      if (callbacks) {
        for (var i = 0; i < callbacks.length; i++) {
          try {
            if (callbacks[i].callback)
              callbacks[i].callback(result);
          }
          catch (e) {
            console.error(e);
          }
        }
      }
    });
  },

  // ---------------------------------------------------------
  // registerGetCart cart.js returns the cart in JSON.
  // ---------------------------------------------------------
  registerGetCart: function (options, callback) {
    this.registerCallbacks('getCart', options, callback);
    this.getCart(options, callback);
  },

  // ---------------------------------------------------------
  // GET collections.json returns the collections in JSON.
  // ---------------------------------------------------------
  getCollections: function (options, callback) {
    var params = [];

    if (!options) {
      options = {pageSize: 20, pageNumber: 1};
    }
    if (options.pageSize)
      params.push({key: 'limit', value: options.pageSize});
    else {
      options.pageSize = 20;
      params.push({key: 'limit', value: options.pageSize});
    }
    if (options.pageNumber)
      params.push({key: 'page', value: options.pageNumber});
    else {
      if (options.totalItems) {
        var pageNumber = Math.ceil((options.totalItems / options.pageSize) + 1);
        params.push({key: 'page', value: pageNumber});
      }
      else
        params.push({key: 'page', value: 1});
    }

    eCommerceSDK.api.get(1, this.accountName, 'collections', params, function (result) {
      if (callback) {
        if (result)
          callback(result.collections);
        else
          callback(null);
      }
    }, function () {
      if (callback) {
        callback(null);
      }
    });
  },

  // ---------------------------------------------------------
  // GET collections/<handler>/products.json returns the products in JSON.
  // ---------------------------------------------------------
  getProducts: function (handle, options, callback) {
    var params = [];

    if (!options) {
      options = {pageSize: 20, pageNumber: 1};
    }
    if (options.pageSize)
      params.push({key: 'limit', value: options.pageSize});
    else {
      options.pageSize = 9;
      params.push({key: 'limit', value: options.pageSize});
    }
    if (options.pageNumber)
      params.push({key: 'page', value: options.pageNumber});
    else {
      if (options.totalItems) {
        var pageNumber = Math.ceil((options.totalItems / options.pageSize) + 1);
        params.push({key: 'page', value: pageNumber});
      }
      else
        params.push({key: 'page', value: 1});
    }

    eCommerceSDK.api.get(1, this.accountName, 'collections/' + handle + '/products', params, function (result) {
      if (callback) {
        if (result)
          callback(result.products);
        else
          callback(null);
      }
    });
  },

  // ---------------------------------------------------------
  // GET products/<product-handle>.js returns the product in JSON.
  // ---------------------------------------------------------
  getProduct: function (handle, options, callback) {
    eCommerceSDK.api.get(1, this.accountName, 'products/' + handle, [], function (result) {
      if (callback) {
        if (result) {
          var product = result.product;
          if (product && product.options) {
            for (var j = 0; j < product.options.length; j++) {
              for (var i = 0; i < product.variants.length; i++) {
                if (typeof (product.options[j].elements) == "undefined")
                  product.options[j].elements = [];
                if (!product.variants[i].options)
                  product.variants[i].options = {};

                if (product.options[j].elements.indexOf(product.variants[i]["option" + (j + 1).toString()]) < 0) {
                  product.options[j].elements.push(product.variants[i]["option" + (j + 1).toString()]);

                  product.variants[i].options[product.options[j].id] = product.variants[i]["option" + (j + 1).toString()];
                }
              }
            }
          }
          callback(product);
        }
        else
          callback(null);
      }
    });
  },

  // ---------------------------------------------------------
  // params: product, options = [{value},{value}]
  // return variantId
  // ---------------------------------------------------------
  findVariantIdByOptions: function (product, options) {
    var variantId = null;
    if (product && product.variants) {
      for (var i = 0; i < product.variants.length; i++) {
        var isFound = true;
        for (var j = 0; j < options.length; j++) {
          var key = 'option' + (j + 1).toString();
          if (!product.variants[i][key] || product.variants[i][key] != options[j]) {
            isFound = false;
            break;
          }
        }
        if (isFound) {
          variantId = product.variants[i].id;
          break;
        }
      }
    }
    return variantId;
  },

  checkout: function (callback) {
    console.log(">>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<shop");
    var self = this;
    this.getCart(null, function (result) {
      console.log("cart $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$4");
      if (result) {
        var token = result.token;
        if (callback) callback(eCommerceSDK.api.server.replace('{0}', self.accountName) + 'cart');
        //eCommerceSDK.api.get(1, self.accountName, 'admin/shop', [], function (shopResult) {
        //    if (callback && token && shopResult && shopResult.id) {
        //        var redirectUrl = 'https://checkout.shopify.com/carts/{id}/{token}';
        //        redirectUrl = redirectUrl.replace('{id}', shopResult.id).replace('{token}', token);
        //        callback(redirectUrl);
        //    }
        //});
      }
    });
  }

  //// ---------------------------------------------------------
  //// POST to cart/clear.js returns the cart in JSON.
  //// It removes all the items in the cart, but does
  //// not clear the cart attributes nor the cart note.
  //// ---------------------------------------------------------
  //clear: function (callback) {
  //    var params = {
  //        type: 'POST',
  //        url: '/cart/clear.js',
  //        data: '',
  //        dataType: 'json',
  //        success: function (cart) {
  //            if ((typeof callback) === 'function') {
  //                callback(cart);
  //            }
  //            else {
  //                ECommerce.onCartUpdate(cart);
  //            }
  //        },
  //        error: function (XMLHttpRequest, textStatus) {
  //            ECommerce.onError(XMLHttpRequest, textStatus);
  //        }
  //    };
  //    $.ajax(params);
  //},

  //// ---------------------------------------------------------
  //// POST to cart/update.js returns the cart in JSON.
  //// ---------------------------------------------------------
  //updateCartFromForm: function (form_id, callback) {
  //    var params = {
  //        type: 'POST',
  //        url: '/cart/update.js',
  //        data: $('#' + form_id).serialize(),
  //        dataType: 'json',
  //        success: function (cart) {
  //            if ((typeof callback) === 'function') {
  //                callback(cart);
  //            }
  //            else {
  //                ECommerce.onCartUpdate(cart);
  //            }
  //        },
  //        error: function (XMLHttpRequest, textStatus) {
  //            ECommerce.onError(XMLHttpRequest, textStatus);
  //        }
  //    };
  //    $.ajax(params);
  //},

  //// ---------------------------------------------------------
  //// POST to cart/update.js returns the cart in JSON.
  //// To clear a particular attribute, set its value to an empty string.
  //// Receives attributes as a hash or array. Look at comments below.
  //// ---------------------------------------------------------
  //updateCartAttributes: function (attributes, callback) {
  //    var data = '';
  //    // If attributes is an array of the form:
  //    // [ { key: 'my key', value: 'my value' }, ... ]
  //    if ($.isArray(attributes)) {
  //        $.each(attributes, function (indexInArray, valueOfElement) {
  //            var key = eCommerceSDK.tools.attributeToString(valueOfElement.key);
  //            if (key !== '') {
  //                data += 'attributes[' + key + ']=' + eCommerceSDK.tools.attributeToString(valueOfElement.value) + '&';
  //            }
  //        });
  //    }
  //        // If attributes is a hash of the form:
  //        // { 'my key' : 'my value', ... }
  //    else if ((typeof attributes === 'object') && attributes !== null) {
  //        $.each(attributes, function (key, value) {
  //            data += 'attributes[' + eCommerceSDK.tools.attributeToString(key) + ']=' + attributeToString(value) + '&';
  //        });
  //    }
  //    var params = {
  //        type: 'POST',
  //        url: '/cart/update.js',
  //        data: data,
  //        dataType: 'json',
  //        success: function (cart) {
  //            if ((typeof callback) === 'function') {
  //                callback(cart);
  //            }
  //            else {
  //                ECommerce.onCartUpdate(cart);
  //            }
  //        },
  //        error: function (XMLHttpRequest, textStatus) {
  //            ECommerce.onError(XMLHttpRequest, textStatus);
  //        }
  //    };
  //    $.ajax(params);
  //},

  //// ---------------------------------------------------------
  //// POST to cart/update.js returns the cart in JSON.
  //// ---------------------------------------------------------
  //updateCartNote: function (note, callback) {
  //    var params = {
  //        type: 'POST',
  //        url: '/cart/update.js',
  //        data: 'note=' + eCommerceSDK.tools.attributeToString(note),
  //        dataType: 'json',
  //        success: function (cart) {
  //            if ((typeof callback) === 'function') {
  //                callback(cart);
  //            }
  //            else {
  //                ECommerce.onCartUpdate(cart);
  //            }
  //        },
  //        error: function (XMLHttpRequest, textStatus) {
  //            ECommerce.onError(XMLHttpRequest, textStatus);
  //        }
  //    };
  //    $.ajax(params);
  //},

  //// ---------------------------------------------------------
  //// GET cart/shipping_rates.js returns the cart in JSON.
  //// ---------------------------------------------------------
  //getCartShippingRatesForDestination: function (shipping_address, callback) {
  //    var params = {
  //        type: 'GET',
  //        url: '/cart/shipping_rates.json',
  //        data: ECommerce.param({ 'shipping_address': shipping_address }),
  //        dataType: 'json',
  //        success: function (response) {
  //            rates = response.shipping_rates
  //            if ((typeof callback) === 'function') {
  //                callback(rates, shipping_address);
  //            }
  //            else {
  //                ECommerce.onCartShippingRatesUpdate(rates, shipping_address);
  //            }
  //        },
  //        error: function (XMLHttpRequest, textStatus) {
  //            ECommerce.onError(XMLHttpRequest, textStatus);
  //        }
  //    }
  //    $.ajax(params);
  //}
};