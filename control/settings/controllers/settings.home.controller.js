'use strict';
(function (angular) {
    angular
        .module('eCommercePluginSettings')
        .controller('SettingsCtrl', ['$scope','TAG_NAMES',
            function ($scope,TAG_NAMES) {
                var SettingsHome = this;
                SettingsHome.data = null
                SettingsHome.currency=[{
                name:"Euro",
                    symbol: "&euro;"
                },
                {
                    name:"Yuan and Yen",
                    symbol: "&#165;"
                },
                {
                    name:"Yuan and Yen",
                    sysmbol:"&#165;"
                },
                {
                    name:"Duetsche Mark",
                    symbol:"DM"
                },
                {
                    name:"Franc",
                    symbol:"&#8355;"
                },
                {
                    name:"Pound",
                    symbol:"&#163;"
                },
                {
                    name:"Lira",
                    symbol:"&#8356;"
                },
                {
                    name:"Rouble",
                    symbol:"&#x20bd;"
                },
                {
                    name:"Switz Franc",
                    symbol:"SFr"
                }]

                var _data = {
                    "content": {
                        "carouselImages": [],
                        "description": '<p>&nbsp;<br></p>',
                        "storeName": "",
                        currency:""
                    },
                    "design": {
                        "sectionListLayout": "",
                        "itemListLayout": "",
                        "itemDetailsBgImage": ""
                    }
                };
                SettingsHome.masterData=[];
                updateMasterItem(_data);

                function updateMasterItem(data) {
                    SettingsHome.masterData = angular.copy(data);
                }
                function isUnchanged(data) {
                    return angular.equals(data, SettingsHome.masterData);
                }

                var init = function () {
                    buildfire.datastore.get(TAG_NAMES.SHOPIFY_INFO,function(err,data){
                        if(err)
                            console.error('Error while getting data', err);
                        else {
                            SettingsHome.data = data.data;
                            console.log("Settings",SettingsHome.data)
                            updateMasterItem(SettingsHome.data);
                            if (tmrDelay)clearTimeout(tmrDelay);
                        }
                    });
                };
                SettingsHome.changeCurrency = function(currency){
                    SettingsHome.data.content.currency = currency;
                }
                var saveData = function (newObj, tag) {
                    if (typeof newObj === 'undefined') {
                        return;
                    }
                    buildfire.datastore.save(newObj, tag,function(err,data){
                        if(err)
                            console.error('Error while saving data : ', err);
                        else {
                            console.info('Saved data result: ', data);
                            updateMasterItem(newObj);
                        }
                    });
                };
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
                            saveData(JSON.parse(angular.toJson(newObj)), TAG_NAMES.SHOPIFY_INFO);
                        }, 500);
                    }
                };
                $scope.$watch(function () {
                    return SettingsHome.data;
                }, saveDataWithDelay, true);

                init();


            }]);
})(window.angular);
