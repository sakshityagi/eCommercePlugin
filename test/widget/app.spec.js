describe('Unit: eCommercePluginWidget widget app', function () {
  describe('Unit: app routes', function () {
    beforeEach(module('eCommercePluginWidget'));
    var location, route, rootScope, compile, scope;
    beforeEach(inject(function (_$rootScope_, _$compile_, $rootScope) {
     // route = _$route_;
      rootScope = _$rootScope_;
        compile= _$compile_;
        scope = $rootScope.$new();
        directiveElem = getCompiledElement();
    }));

    describe('Home route', function () {
      beforeEach(inject(
          function ($httpBackend) {
            $httpBackend.expectGET('/')
                .respond(200);
            $httpBackend.expectGET('/')
                .respond(200);
          }));
      it('should load the home page on successful load of location path /', function () {

      });

    });

      function getCompiledElement(){
          var element = angular.element('<div id="carousel" build-fire-carousel="></div>');
          var compiledElement = compile(element)(scope);
          scope.$digest();
          return compiledElement;
      }
      it('should call if build-fire-carousel is defined', function () {
          expect(directiveElem.find('build-fire-carousel')).toBeDefined();
      });
      it('should call if build-fire-carousel2 is defined', function () {
          expect(directiveElem.find('build-fire-carousel2')).toBeDefined();
      });
      it('should call if build-fire-carousel3 is defined', function () {
          expect(directiveElem.find('build-fire-carousel3')).toBeDefined();
      });
  });
});