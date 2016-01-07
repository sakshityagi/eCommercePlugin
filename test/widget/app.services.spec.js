describe('Unit: eCommercePluginWidget: Services', function () {
    beforeEach(module('eCommercePluginWidget'));


  describe('Unit : Buildfire service', function () {
    var Buildfire;
    beforeEach(inject(
        function (_Buildfire_) {
          Buildfire = _Buildfire_;
        }));
    it('Buildfire should exists', function () {
      expect(Buildfire).toBeDefined();
    });
  });

  describe('Unit : DataStore Factory', function () {
    var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE, q, TAG_NAMES, $rootScope;
    beforeEach(module('eCommercePluginWidget', function ($provide) {
      $provide.service('Buildfire', function () {
        this.datastore = jasmine.createSpyObj('datastore', ['get', 'getById', 'insert', 'update', 'save']);
        this.datastore.get.and.callFake(function (_tagName, callback) {
          if (_tagName) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });
        this.datastore.getById.and.callFake(function (id, _tagName, callback) {
          if (id, _tagName) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });
        this.datastore.insert.and.callFake(function (item, _tagName, test, callback) {
          if (item, _tagName) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });
        this.datastore.update.and.callFake(function (id, _tagName, test, callback) {
          if (id, _tagName) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });
        this.datastore.save.and.callFake(function (item, _tagName, callback) {
          if (item, _tagName) {
            callback(null, 'Success');
          } else {
            callback('Error', null);
          }
        });
      });
    }));

      beforeEach(module('eCommercePluginWidget', function ($provide) {
          $provide.service('Buildfire', function () {
              this.datastore = jasmine.createSpyObj('datastore', ['get', 'getById', 'insert', 'update', 'save']);
              this.datastore.get.and.callFake(function (_tagName, callback) {
                  if (_tagName) {
                      callback(null, 'Success');
                  } else {
                      callback('Error', null);
                  }
              });
              this.datastore.getById.and.callFake(function (id, _tagName, callback) {
                  if (id, _tagName) {
                      callback(null, 'Success');
                  } else {
                      callback('Error', null);
                  }
              });
              this.datastore.insert.and.callFake(function (item, _tagName, test, callback) {
                  if (item, _tagName) {
                      callback(null, 'Success');
                  } else {
                      callback('Error', null);
                  }
              });
              this.datastore.update.and.callFake(function (id, _tagName, test, callback) {
                  if (id, _tagName) {
                      callback(null, 'Success');
                  } else {
                      callback('Error', null);
                  }
              });
              this.datastore.save.and.callFake(function (item, _tagName, callback) {
                  if (item, _tagName) {
                      callback(null, 'Success');
                  } else {
                      callback('Error', null);
                  }
              });
          });
      }));
    beforeEach(module('eCommercePluginWidget'));
    beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_, _TAG_NAMES_, _$rootScope_) {
      DataStore = _DataStore_;
      STATUS_CODE = _STATUS_CODE_;
      STATUS_MESSAGES = _STATUS_MESSAGES_;
      TAG_NAMES = _TAG_NAMES_;
      $rootScope = _$rootScope_;
      Buildfire = {
        datastore: {}
      };


    }));
  it('DataStore should exist and be an object', function () {
    expect(typeof DataStore).toEqual('object');
  });
  it('DataStore.get should exist and be a function', function () {
    expect(typeof DataStore.get).toEqual('function');
  });
  it('DataStore.getById should exist and be a function', function () {
    expect(typeof DataStore.getById).toEqual('function');
  });
  it('DataStore.insert should exist and be a function', function () {
    expect(typeof DataStore.insert).toEqual('function');
  });
  it('DataStore.update should exist and be a function', function () {
    expect(typeof DataStore.update).toEqual('function');
  });
  it('DataStore.save should exist and be a function', function () {
    expect(typeof DataStore.save).toEqual('function');
  });

    it('DataStore.get should return error', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.get(null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Error');
    });
    it('DataStore.get should return success', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.get(TAG_NAMES.SHOPIFY_INFO).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Success');
    });

    it('DataStore.getById should return error', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.getById( null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Error');
    });

    it('DataStore.getById should return success', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.getById(123, TAG_NAMES.SHOPIFY_INFO).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Success');
    });
    it('DataStore.insert should return error', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.insert( null,null, null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Error');
    });

    it('DataStore.insert should return success', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.insert( 123, TAG_NAMES.SHOPIFY_INFO, null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Success');
    });
    it('DataStore.update should return error', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.update( null,null, null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Error');
    });

    it('DataStore.update should return success', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.update( 123, TAG_NAMES.SHOPIFY_INFO, null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Success');
    });
    it('DataStore.save should return error', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.save( null,null, null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Error');
    });

    it('DataStore.save should return success', function () {
      var result = ''
          , success = function (response) {
            result = response;
          }
          , error = function (err) {
            result = err;
          };
      DataStore.save( 123, TAG_NAMES.SHOPIFY_INFO, null).then(success, error);
      $rootScope.$digest();
      expect(result).toEqual('Success');
    });
  })

});