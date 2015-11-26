'use strict';

(function (angular) {
  angular
    .module('eCommercePluginWidget')
    .controller('WidgetMasterCtrl', ['$scope', '$rootScope', 'Buildfire', 'ViewStack','LAYOUTS',
      function ($scope, $rootScope, Buildfire, ViewStack, LAYOUTS) {
        //$scope.currentItemListLayout = LAYOUTS.itemListLayout[0].name;
        console.log("OYE KIDDAN YAR, MASTER", $scope.currentItemListLayout);

        $scope.$on("ITEM_LIST_LAYOUT_CHANGED", function(evt, layout, needDigest) {
          $scope.currentItemListLayout = "templates/" + layout + ".html";
          if(needDigest) {
            $scope.$digest();
          }
        });
      }]);
})(window.angular);