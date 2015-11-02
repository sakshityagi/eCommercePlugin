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

        updateMasterItem(_data);

        function updateMasterItem(data) {
          DesignHome.masterData = angular.copy(data);
        }

        function isUnchanged(data) {
          return angular.equals(data, DesignHome.masterData);
        }

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
        var saveData = function (newObj, tag) {
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

        var saveDataWithDelay = function (newObj) {
          if (newObj) {
            if (isUnchanged(newObj)) {
              return;
            }
            if (tmrDelay) {
              clearTimeout(tmrDelay);
            }
            tmrDelay = setTimeout(function () {
              saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.YOUTUBE_INFO);
            }, 500);
          }
        };

        /*
         * watch for changes in data and trigger the saveDataWithDelay function on change
         * */
        $scope.$watch(function () {
          return DesignHome.data;
        }, saveDataWithDelay, true);

        init();
      }]);
})(window.angular);
