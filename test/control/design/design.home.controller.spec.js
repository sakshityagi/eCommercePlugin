escribe('Unit : eCommercePluginDesign design.home.controller.js', function () {
    var $scope, DesignHome, $rootScope, q, $controller, DataStore,TAG_NAMES;
    beforeEach(module('eCommercePluginDesign'));


    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _DataStore_, _TAG_NAMES) {
        $rootScope = _$rootScope_;
        q = _$q_;
        $scope = $rootScope.$new();
        $controller = _$controller_;
        DataStore = _DataStore_;
        TAG_NAMES = _TAG_NAMES;
}));

    beforeEach(function () {

        inject(function ($injector, $q) {
            $rootScope = $injector.get('$rootScope');
            $scope = $rootScope.$new();
            DesignHome = $injector.get('$controller')('DesignHomeCtrl', {
                $scope: $scope,
                data: {
                    design: {
                        sectionListLayout: 'test',
                        itemListLayout: 'test1',
                        itemDetailsBgImage: 'test2'
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
    });
});