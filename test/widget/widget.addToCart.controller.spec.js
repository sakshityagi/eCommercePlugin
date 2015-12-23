describe('Unit : eCommercePluginWidget Plugin widget.addToCart.controller.js', function () {
    var WidgetAddToCart, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q, ViewStack, $sce;
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
        WidgetAddToCart = $controller('WidgetAddToCartCtrl', {
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



    describe('Call WidgetAddToCart.safeHtml', function () {
        it('should invoke when WidgetAddToCart.safeHtml() called', function () {
            var url= "https://PERHire.myshopify.com/cart";
            WidgetAddToCart.safeHtml(url);
            WidgetAddToCart.currentAddedItemInCart={
                Variant:{
                    id:"01"
                }
            }
            WidgetAddToCart.data={
                content:{
                    storeName:"helloStore",
                    carouselImages :"'https://www.google.com/images/srpr/logo11w.png'"

                },
                design:{
                    itemListLayout:"testLayout"
                }
            }
            ViewStack.push(WidgetAddToCart.data.design.itemListLayout);
            WidgetAddToCart.proceedToCart();
           WidgetAddToCart.cancelClick();
          });
    });

    describe('Call WidgetCheckout.selectVariant', function () {
        it('should invoke when WidgetCheckout.selectVariant() called', function () {
            var variant= "test";
            WidgetAddToCart.selectVariant(variant);

        });
    });

    describe('Call WidgetCheckout.goToCart', function () {
        it('should invoke when WidgetCheckout.goToCart() called', function () {
            var variant= "test";
            WidgetAddToCart.currentAddedItemInCart={
                Variant:{
                    id:"01"
                }
            }
            WidgetAddToCart.goToCart();
        });
    });

    describe('Carousel:LOADED', function () {
        var html = '<div id="carousel3"></div>';
        angular.element(document.body).append(html);
        it('should invoke when get Carousel:LOADED with carousal images', function () {
            WidgetAddToCart.data={
                content:{
                    storeName:"helloStore",
                    carouselImages :"'https://www.google.com/images/srpr/logo11w.png'"

                },
                design:{
                    itemListLayout:"testLayout"
                }
            }
            $rootScope.$broadcast('Carousel3:LOADED');
        });


    });

    describe('$destroy', function () {
        it('should invoke when get $destroy', function () {
            $rootScope.$broadcast('$destroy');
        });
    });

});