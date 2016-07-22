describe('Unit : eCommercePluginWidget Plugin widget.home.controller.js', function () {
  var WidgetHome, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q;
  beforeEach(module('eCommercePluginWidget'));
  var editor;
  beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _STATUS_CODE_, _LAYOUTS_, _STATUS_MESSAGES_, _Buildfire_) {
    $rootScope = _$rootScope_;
    q = _$q_;
    scope = $rootScope.$new();
    $controller = _$controller_;
    TAG_NAMES = _TAG_NAMES_;
    STATUS_CODE = _STATUS_CODE_;
    STATUS_MESSAGES = _STATUS_MESSAGES_;
    LAYOUTS = _LAYOUTS_;
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
      },
      spinner: {
        show: function () {
        }
      },
      imagelib: {
        cropImage: function (url, setting) {

        }
      }
    };
    ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog']);
    Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor', 'onAddItems']);

  }));

  beforeEach(function () {
    WidgetHome = $controller('WidgetHomeCtrl', {
      $scope: scope,
      $q: q,
      Buildfire: Buildfire,
      TAG_NAMES: TAG_NAMES,
      ActionItems: ActionItems,
      STATUS_CODE: STATUS_CODE,
      CONTENT_TYPE: CONTENT_TYPE,
      LAYOUTS: LAYOUTS
    });
  });

  describe('Units: units should be Defined', function () {
  });

  describe('$destroy', function () {
    it('should invoke when get $destroy', function () {
      $rootScope.$broadcast('$destroy');
    });
  });
  xdescribe('WidgetHome.cropImage()', function () {
    it('should invoke when get WidgetHome.cropImage() method called', function () {
      var img = 'https://www.google.com/images/srpr/logo11w.png';
      var setting = {
        height: 500,
        width: 500
      };

      var options = {};
      options.height = setting.height;
      options.width = setting.width;
      WidgetHome.cropImage(img, setting);
    });

    it('should invoke when URL is null for WidgetHome.cropImage() method called', function () {
      var img = null;
      var setting = {
        height: 500,
        width: 500
      };

      var options = {};
      options.height = setting.height;
      options.width = setting.width;
      WidgetHome.cropImage(img, setting);
    });
  });

  describe('WidgetHome.safeHtml(html)', function () {
    it('should invoke when WidgetHome.safeHtml() method called', function () {
      var html = '<div>HiTest</div>';
      WidgetHome.safeHtml(html);
    });
  });

  describe('WidgetHome.showDescription(description)', function () {
    it('should invoke when WidgetHome.showDescription() method called', function () {
      var description = '<div>HiTest</div>';
      WidgetHome.showDescription(description);
    });
  });

  describe(' WidgetHome.loadMore()', function () {
    it('should invoke when  WidgetHome.loadMore() method called and store name will be helloStore', function () {
      WidgetHome.data = {
        content: {
          storeName: "helloStore"
        }
      };
      WidgetHome.busy = true;
      WidgetHome.loadMore();
      WidgetHome.busy = false;
      WidgetHome.loadMore();
    });

    it('should invoke when  WidgetHome.loadMore() method called and store name will be null', function () {
      WidgetHome.data = {
        content: {
          storeName: null
        }
      };
      WidgetHome.busy = true;
      WidgetHome.loadMore();
      WidgetHome.busy = false;
      WidgetHome.loadMore();
    });
  });

  describe(' WidgetHome.showItems(handle)', function () {
    it('should invoke when  WidgetHome.showItems() method called ', function () {
      var handle = 'testHandle';
      WidgetHome.data = {
        content: {
          storeName: "helloStore"
        },
        design: {
          itemListLayout: "testLayout"
        }
      };
      WidgetHome.showItems(handle)
    });
  });
  describe('Carousel:LOADED', function () {
    var html = '<div id="carousel"></div>';
    angular.element(document.body).append(html);
    it('should invoke when get Carousel:LOADED', function () {
      WidgetHome.data = {
        content: {
          storeName: "helloStore",
          carouselImages: "'https://www.google.com/images/srpr/logo11w.png'"

        },
        design: {
          itemListLayout: "testLayout"
        }
      }
    });

  });

  describe('Carousel:LOADED', function () {
    var html = '<div id="carousel"></div>';
    angular.element(document.body).append(html);
    it('should invoke when get Carousel:LOADED with carousal images', function () {
      WidgetHome.data = {
        content: {
          storeName: "helloStore",
          carouselImages: "'https://www.google.com/images/srpr/logo11w.png'"

        },
        design: {
          itemListLayout: "testLayout"
        }
      };
      $rootScope.$broadcast('Carousel:LOADED');
    });

    it('should invoke when get Carousel:LOADED without carousal images', function () {
      WidgetHome.data = {
        content: {
          storeName: "helloStore",
          carouselImages: ""

        },
        design: {
          itemListLayout: "testLayout"
        }
      };
      $rootScope.$broadcast('Carousel:LOADED');
    });


  });
  describe('WidgetHome.goToCart', function () {
    it('should invoke when WidgetHome.goToCart() called', function () {
      WidgetHome.goToCart();
    });
  });

});