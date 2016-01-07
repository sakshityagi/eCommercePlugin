'use strict';

(function (angular) {
  angular
    .module('eCommercePluginDesign')
    .controller('DesignHomeCtrl', ['$scope', 'LAYOUTS', 'DataStore', 'TAG_NAMES',
      function ($scope, LAYOUTS, DataStore, TAG_NAMES) {
        var DesignHome = this;
        var _data = {
          "content": {
            "carouselImages": [],
            "description": '<p>&nbsp;<br></p>',
            "storeName": ""
          },
          "design": {
            "sectionListLayout": LAYOUTS.sectionListLayout[0].name,
            "itemListLayout": LAYOUTS.itemListLayout[0].name,
            "itemDetailsBgImage": ""
          }
        };
        DesignHome.masterData = null;
        DesignHome.layouts = LAYOUTS;
        DesignHome.data = angular.copy(_data);

        /*On section list layout click event*/
        DesignHome.changeSectionListLayout = function (layoutName) {
          DesignHome.data.design.sectionListLayout = layoutName;
          if (tmrDelay)clearTimeout(tmrDelay);
        };

        /*On item list layout click event*/
        DesignHome.changeItemListLayout = function (layoutName) {
          DesignHome.data.design.itemListLayout = layoutName;
          if (tmrDelay)clearTimeout(tmrDelay);
        };

        function updateMasterItem(data) {
          DesignHome.masterData = angular.copy(data);
        }

        function isUnchanged(data) {
          return angular.equals(data, DesignHome.masterData);
        }

        var background = new buildfire.components.images.thumbnail("#background");

        background.onChange = function (url) {
          DesignHome.data.design.itemDetailsBgImage = url;
          if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
          }
        };

        background.onDelete = function (url) {
          DesignHome.data.design.itemDetailsBgImage = "";
          if (!$scope.$$phase && !$scope.$root.$$phase) {
            $scope.$apply();
          }
        };

        var init = function () {
          var success = function (result) {
              DesignHome.data = result.data;
              if (DesignHome.data && !DesignHome.data.design) {
                DesignHome.data.design = {};
              }
              if (!DesignHome.data.design.sectionListLayout) {
                DesignHome.data.design.sectionListLayout = DesignHome.layouts.sectionListLayout[0].name;
              }
              if (!DesignHome.data.design.itemListLayout) {
                DesignHome.data.design.itemListLayout = DesignHome.layouts.itemListLayout[0].name;
              }
              updateMasterItem(DesignHome.data);
              if (DesignHome.data.design.itemDetailsBgImage) {
                background.loadbackground(DesignHome.data.design.itemDetailsBgImage);
              }
              if (tmrDelay)clearTimeout(tmrDelay);
            }
            , error = function (err) {
              console.error('Error while getting data', err);
              if (tmrDelay)clearTimeout(tmrDelay);
            };
          DataStore.get(TAG_NAMES.SHOPIFY_INFO).then(success, error);
        };

        /*
         * Call the datastore to save the data object
         */
        DesignHome.saveData = function (newObj, tag) {
          if (typeof newObj === 'undefined') {
            return;
          }
          var success = function (result) {
              console.info('Saved data result: ', result);
              updateMasterItem(newObj);
            }
            , error = function (err) {
              console.error('Error while saving data : ', err);
            };
          DataStore.save(newObj, tag).then(success, error);
        };

        /*
         * create an artificial delay so api isnt called on every character entered
         * */
        var tmrDelay = null;

        DesignHome.saveDataWithDelay = function (newObj) {
          if (newObj) {
            if (isUnchanged(newObj)) {
              return;
            }
            if (tmrDelay) {
              clearTimeout(tmrDelay);
            }
            tmrDelay = setTimeout(function () {
              DesignHome.saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.SHOPIFY_INFO);
            }, 500);
          }
        };

        /*
         * watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch(function () {
          return DesignHome.data;
        }, DesignHome.saveDataWithDelay, true);

        updateMasterItem(_data);

        init();
      }]);
})(window.angular);
