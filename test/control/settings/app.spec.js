describe('Unit: eCommercePluginSettings settings app', function () {
  describe('Unit: app routes', function () {
      beforeEach(module('eCommercePluginSettings'));
      var location, route, rootScope, routeProvider;
      beforeEach(inject(function (_$location_, _$route_, _$rootScope_) {
          location = _$location_;
          route = _$route_;
          rootScope = _$rootScope_;
      }));

      describe('Home route', function () {
          beforeEach(inject(
              function ($httpBackend) {
                  $httpBackend.expectGET('templates/home.html')
                      .respond(200);
                  $httpBackend.expectGET('/')
                      .respond(200);
              }));
      });
  });
});