describe('Unit : eCommercePluginWidget Plugin widget.home.controller.js', function () {
    var WidgetCheckout, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q, ViewStack, $sce;
    beforeEach(module('eCommercePluginWidget'));
    var editor;
    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _STATUS_CODE_, _LAYOUTS_, _STATUS_MESSAGES_, _Buildfire_, _ViewStack_, _$sce_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        STATUS_MESSAGES = _STATUS_MESSAGES_;
        LAYOUTS = _LAYOUTS_;
        ViewStack = _ViewStack_;
        $sce = _$sce_;
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
                cropImage: function(url,setting){

                }
            }
        };
        ActionItems = jasmine.createSpyObj('ActionItems', ['showDialog']);
        Buildfire.components.carousel = jasmine.createSpyObj('Buildfire.components.carousel', ['editor', 'onAddItems']);

    }));
    beforeEach(function () {
        WidgetCheckout = $controller('WidgetCheckoutCtrl', {
            $scope: scope,
            $q: q,
            Buildfire: Buildfire,
            TAG_NAMES: TAG_NAMES,
            ActionItems: ActionItems,
            STATUS_CODE: STATUS_CODE,
            CONTENT_TYPE: CONTENT_TYPE,
            LAYOUTS: LAYOUTS,
            $sce : $sce
        });
    });



    describe('Call checkout controller', function () {
        it('should invoke when checkout controller called', function () {
            WidgetCheckout.currentView = ViewStack.getCurrentView();
            WidgetCheckout.currentView= {
                params: {
                    url: "https://PERHire.myshopify.com/cart"
                }
            };
         });
    });

    describe('Call WidgetCheckout.safeUrl', function () {
        it('should invoke when WidgetCheckout.safeUrl() called', function () {
            var url= "https://PERHire.myshopify.com/cart";
            WidgetCheckout.safeUrl(url);
        });
    });

});