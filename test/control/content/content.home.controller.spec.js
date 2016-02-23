describe('Unit : eCommerce Plugin content.home.controller.js', function () {
  var ContentHome, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, q, ECommerceSDK, DataStore;
  beforeEach(module('eCommercePluginContent'));
  var editor;
  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _STATUS_CODE_, _LAYOUTS_, _STATUS_MESSAGES_, _ECommerceSDK_, _DataStore_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    ECommerceSDK = _ECommerceSDK_;
    LAYOUTS = _LAYOUTS_;
    DataStore = _DataStore_;
    // Utils = __Utils__;
    Buildfire = {
      components: {
        carousel: {
          editor: function (name) {
            return {}
          },
          viewer: function (name) {
            return {}
          }
        }
      }
    };
    ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog']);
    Utils = jasmine.createSpyObj('Utils', ['validLongLats']);
    Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor', 'onAddItems']);

  }));

  beforeEach(function () {
    ContentHome = $controller('ContentHomeCtrl', {
      $scope: scope,
      $q: q,
      Buildfire: Buildfire,
      TAG_NAMES: TAG_NAMES,
      ActionItems: ActionItems,
      STATUS_CODE: STATUS_CODE,
      LAYOUTS: LAYOUTS,
      Utils: Utils
    });
  });

  describe('Units: units should be Defined', function () {
    it('it should pass if ContentHome is defined', function () {
      expect(ContentHome).not.toBeUndefined();
    });
    it('it should pass if Buildfire is defined', function () {
      expect(Buildfire).not.toBeUndefined();
    });
    it('it should pass if TAG_NAMES is defined', function () {
      expect(TAG_NAMES).not.toBeUndefined();
    });
    it('it should pass if STATUS_CODE is defined', function () {
      expect(STATUS_CODE).not.toBeUndefined();
    });
  });

  describe('Units: test the method ContentHome.clearData', function () {
    it('it should pass if ContentHome.clearData is called', function () {
      ContentHome.data = {content: {}};
      ContentHome.storeName = false;
      ContentHome.data.content.storeName = "test";
      ContentHome.clearData();
      expect(ContentHome.data.content.storeName).toBeNull()
    });

  });

  describe('Units: test the method  ContentHome.verifyStore', function () {
    it('it should pass if  ContentHome.verifyStore is defiled', function () {
      expect(ContentHome.verifyStore).not.toBeUndefined();
    });
    it('it should pass if  ContentHome.verifyStore is called', function () {
      ContentHome.verifyStore();
      //spyOn(DataStore, 'get').and.callThrough();
      spyOn(ECommerceSDK, 'validateStoreName').and.callFake(function () {
        return {
          then: function (callback) {
            return callback(result);
          }
        };
        ContentHome.storeVerifySuccess = true;
      });
    });

  });

  describe('Units: spy the service  DataStore', function () {
    it('it should pass if  DataStore service called', function () {
      spyOn(DataStore, 'get').and.callFake(function () {
        return {
          then: function (callback) {
            return callback(result);
          }
        };
      });
    });

  });

  describe('Units: ContentHome.gotToShopify', function () {
    it('it should pass if  ContentHome.gotToShopify called', function () {
      ContentHome.gotToShopify();
    });

  });
});