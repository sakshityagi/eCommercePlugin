describe('Unit : eCommercePluginDesign design.home.controller.js', function () {
    var $scope, DesignHome, $rootScope, q, $controller, DataStore, TAG_NAMES, STATUS_CODE, STATUS_MESSAGES, $compile;
    beforeEach(module('eCommercePluginDesign'));

    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _DataStore_, _TAG_NAMES_, _STATUS_CODE_, _STATUS_MESSAGES_, _$compile_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        DataStore = _DataStore_;
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        STATUS_MESSAGES = _STATUS_MESSAGES_;
        $compile= _$compile_;
    }));

    beforeEach(function () {
        inject(function ($injector, $q) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            DesignHome = $injector.get('$controller')('DesignHomeCtrl', {
                $scope: $scope,
                data: {
                    design: {
                        listLayout: "test",
                        backgroundImage: "test1"
                    }
                },
                Buildfire: {
                    imageLib: {
                        showDialog: function (options, callback) {
                            DesignHome._callback(null, {selectedFiles: ['test']});
                        }
                    },
                    components: {
                        images: {
                            thumbnail: function () {

                            }
                        }
                    },
                    datastore: {
                        get: function () { },
                        save: function () { }
                    }
                }
            });
            q = $q;
        });
        DesignHome.data = {
            "content": {
                "carouselImages": [],
                "description": '<p>&nbsp;<br></p>',
                "storeName": ""
            },
            "design": {
                "sectionListLayout": "test1",
                "itemListLayout": "test2",
                "itemDetailsBgImage": ""
            }
        };
    });
    describe('Units: test the method DesignHome.changeSectionListLayout', function () {
        var html = '<div id="background"></div>';
        var background = angular.element(document.body).append(html);

        it('it should pass if DesignHome.changeSectionListLayout is called', function () {
            var layout1="test";
            var tmrDelay = 1;
            DesignHome.changeSectionListLayout(layout1);
            DesignHome.data.design.itemListLayout = layout1;
        });
        it('it should pass if DesignHome.changeItemListLayout is called', function () {
            var layout1="test";
            DesignHome.changeItemListLayout(layout1);
            DesignHome.data.design.itemListLayout = layout1;
             DesignHome.changeItemListLayout();
        });

        it('it should pass if DesignHome.saveDataWithDelay is called', function () {
            var newObj = {};
            DesignHome.saveDataWithDelay(newObj)
        });

        it('it should pass if DesignHome.saveData is called', function () {
            var newObj = {};
            DesignHome.saveData(newObj,TAG_NAMES.SHOPIFY_INFO )
        });

    });
})
;