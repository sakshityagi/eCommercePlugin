describe('Unit : eCommercePluginWidget Plugin widget.home.controller.js', function () {
    var WidgetItems, scope, $rootScope, $controller, Buildfire, ActionItems, TAG_NAMES, STATUS_CODE, LAYOUTS, STATUS_MESSAGES, CONTENT_TYPE, q, ViewStack;
    beforeEach(module('eCommercePluginWidget'));
    var editor;
    beforeEach(inject(function (_$rootScope_, _$q_, _$controller_, _TAG_NAMES_, _STATUS_CODE_, _LAYOUTS_, _STATUS_MESSAGES_, _Buildfire_, _ViewStack_) {
        $rootScope = _$rootScope_;
        q = _$q_;
        scope = $rootScope.$new();
        $controller = _$controller_;
        TAG_NAMES = _TAG_NAMES_;
        STATUS_CODE = _STATUS_CODE_;
        STATUS_MESSAGES = _STATUS_MESSAGES_;
        LAYOUTS = _LAYOUTS_;
        ViewStack = _ViewStack_;
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
        WidgetItems = $controller('WidgetItemsCtrl', {
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

    describe('WidgetItems.convertHtml(html)', function () {
        it('should invoke when WidgetItems.convertHtml() method called', function () {
            var html = '<div>HiTest</div>'
            WidgetItems.convertHtml(html);
        });
    });


    describe(' WidgetItems.loadMore()', function () {
        it('should invoke when  WidgetItems.loadMore() method called and store name will be helloStore', function () {
            WidgetItems.data={
                content:{
                    storeName:"helloStore"
                }
            }
            WidgetItems.currentView = ViewStack.getCurrentView();
            WidgetItems.currentView={
                params:{
                    handle:"HelloStore"
                }
            }
            spyOn(ViewStack, 'getCurrentView').and.callFake(function() {
                return {
                    then: function(callback) { return callback(result); }
                };
            });
            console.log("................................",WidgetItems.currentView )
            WidgetItems.loadMore();
        });

        it('should invoke when  WidgetItems.loadMore() method called and store name will not be helloStore', function () {
            WidgetItems.data={
                content:{
                    storeName:"helloStore"
                }
            }
            WidgetItems.currentView = ViewStack.getCurrentView();
            WidgetItems.currentView={
                params:{
                    handle:null
                }
            }
            spyOn(ViewStack, 'getCurrentView').and.callFake(function() {
                return {
                    then: function(callback) { return callback(result); }
                };
            });
            console.log("................................",WidgetItems.currentView )
            WidgetItems.loadMore();
        });
    });

    describe(' WidgetItems.showItem()', function () {
    it('should invoke when   WidgetItems.showItem() method called', function () {
        WidgetItems.showItem();
    });
   });

    describe(' WidgetItems.addToCart()', function () {
        it('should invoke when   WidgetItems.addToCart() method called', function () {
            WidgetItems.addToCart();
        });
    });

    describe(' WidgetItems.changeItemView()', function () {
        it('should invoke when   WidgetItems.changeItemView() method called', function () {
            WidgetItems.data={
                design:{
                    itemListLayout:"testListLayout"
                }
            }
            var itemLayout= "itemLayoutList";
         WidgetItems.changeItemView(itemLayout);
        });
    });

    describe(' WidgetItems.changeItemView()', function () {
        it('should invoke when   WidgetItems.changeItemView() method called', function () {
            WidgetItems.data={
                design:{
                    itemListLayout:"testListLayout"
                }
            }
            var itemLayout= "itemLayoutGrid";
            WidgetItems.changeItemView(itemLayout);
        });
    });

    describe('Carousel:LOADED', function () {
        var html = '<div id="carousel"></div>';
        angular.element(document.body).append(html);
        it('should invoke when get Carousel:LOADED', function () {
            WidgetItems.data={
                content:{
                    storeName:"helloStore",
                    carouselImages :"'https://www.google.com/images/srpr/logo11w.png'"

                },
                design:{
                    itemListLayout:"testLayout"
                }
            }
        });

    });

    describe('Carousel:LOADED', function () {
        var html = '<div id="carousel"></div>';
        angular.element(document.body).append(html);
        it('should invoke when get Carousel:LOADED with carousal images', function () {
            WidgetItems.data={
                content:{
                    storeName:"helloStore",
                    carouselImages :"'https://www.google.com/images/srpr/logo11w.png'"

                },
                design:{
                    itemListLayout:"testLayout"
                }
            }
            $rootScope.$broadcast('Carousel:LOADED');
        });

        it('should invoke when get Carousel:LOADED without carousal images', function () {
            WidgetItems.data={
                content:{
                    storeName:"helloStore",
                    carouselImages :""

                },
                design:{
                    itemListLayout:"testLayout"
                }
            }
            $rootScope.$broadcast('Carousel:LOADED');
        });


    });
    describe('WidgetItems.goToCart', function () {
        it('should invoke when WidgetItems.goToCart() called', function () {
            WidgetItems.goToCart();
        });
    });

});