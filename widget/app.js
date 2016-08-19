'use strict';
(function (angular, buildfire) {
  angular
    .module('eCommercePluginWidget', ['infinite-scroll', 'ngAnimate', 'ui.bootstrap'])
    .config(['$compileProvider', function ($compileProvider) {

      /**
       * To make href urls safe on mobile
       */
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);

    }])
    .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $rootScope.$broadcast("Carousel:LOADED");
        }
      };
    }])
    .directive("buildFireCarousel2", ["$rootScope", function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $rootScope.$broadcast("Carousel2:LOADED");
        }
      };
    }])
    .directive("buildFireCarousel3", ["$rootScope", function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $rootScope.$broadcast("Carousel3:LOADED");
        }
      };
    }])
    /*.filter('getImageUrl', ['Buildfire', function (Buildfire) {
      return function (url, width, height, type) {
        if (type == 'resize')
          return Buildfire.imageLib.resizeImage(url, {
            width: width,
            height: height
          });
        else
          return Buildfire.imageLib.cropImage(url, {
            width: width,
            height: height
          });
      }
    }])*/
    .directive("viewSwitcher", ["ViewStack", "$rootScope", '$compile', "$templateCache",
      function (ViewStack, $rootScope, $compile, $templateCache) {
        return {
          restrict: 'AE',
          link: function (scope, elem, attrs) {
            var views = 0;
            manageDisplay();
            $rootScope.$on('VIEW_CHANGED', function (e, type, view) {
              if (type === 'PUSH') {
                var newScope = $rootScope.$new();
                newScope.currentItemListLayout = "templates/" + view.template + ".html";

                var _newView = '<div  id="' + view.template + '" ><div class="slide content" data-back-img="{{backgroundImage}}" ng-if="currentItemListLayout" ng-include="currentItemListLayout"></div></div>';
                if (view.params && view.params.controller) {
                  _newView = '<div id="' + view.template + '" ><div class="slide content" data-back-img="{{backgroundImage}}" ng-if="currentItemListLayout" ng-include="currentItemListLayout" ng-controller="' + view.params.controller + '" ></div></div>';
                }
                var parTpl = $compile(_newView)(newScope);
                if (view.params && view.params.shouldUpdateTemplate) {
                  newScope.$on("ITEM_LIST_LAYOUT_CHANGED", function (evt, layout, needDigest) {
                    newScope.currentItemListLayout = "templates/" + layout + ".html";
                    if (needDigest) {
                      newScope.$digest();
                    }
                  });
                }
                $(elem).append(parTpl);
                views++;

              } else if (type === 'POP') {
                var _elToRemove = $(elem).find('#' + view.template),
                  _child = _elToRemove.children("div").eq(0);

                _child.addClass("ng-leave ng-leave-active");
                _child.one("webkitTransitionEnd transitionend oTransitionEnd", function (e) {
                  _elToRemove.remove();
                  views--;
                });

                //$(elem).find('#' + view.template).remove();
              }
              else if (type === 'POPALL') {
                console.log(view);
                angular.forEach(view, function (value, key) {
                  $(elem).find('#' + value.template).remove();
                });
                views = 0;
              }
              manageDisplay();
            });

            function manageDisplay() {
              if (views) {
                $(elem).removeClass("ng-hide");
              } else {
                $(elem).addClass("ng-hide");
              }
            }

          }
        };
      }])
    .directive('backImg', ["$rootScope", function ($rootScope) {
      return function (scope, element, attrs) {
        attrs.$observe('backImg', function (value) {
          var img = '';
          if (value) {
            buildfire.imageLib.local.cropImage(value, {
              width: $rootScope.deviceWidth,
              height: $rootScope.deviceHeight
            }, function (err, imgUrl) {
              if (imgUrl) {
                img = imgUrl;
                element.attr("style", 'background:url(' + img + ') !important ; background-size: cover !important;');
              } else {
                img = '';
                element.attr("style", 'background-color:white');
              }
              element.css({
                'background-size': 'cover'
              });
            });
            // img = $filter("cropImage")(value, $rootScope.deviceWidth, $rootScope.deviceHeight, true);
          }
          else {
            img = "";
            element.attr("style", 'background-color:white');
            element.css({
              'background-size': 'cover'
            });
          }
        });
      };
    }])
    .directive("customBindHtml", ["$compile", function ($compile) {
      return {
        scope: {
          html: '=',
          onClick: '&'
        },
        link: function (scope, elem, attrs) {

          scope.clicked = function (e) {
            var _el = $(e.target),
              anchor = _el;
            if (_el.prop("tagName").toLowerCase() === 'a') {
              anchor = _el.eq(0).attr("href");
            } else {
              anchor = _el.parents("a").eq(0).attr("href");
            }
            e.preventDefault();
            scope.onClick && scope.onClick({href: anchor || null});
          };

          var html = scope.html.replace(/<(a)([^>]+)>/g, "<$1 ng-click='clicked($event)'$2>");
          $(elem).append($compile(html)(scope));
        }
      }
    }])
    .directive("loadImage", function () {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

            attrs.$observe('finalSrc', function() {
                var _img = attrs.finalSrc;

                if (attrs.cropType == 'resize') {
                    buildfire.imageLib.local.resizeImage(_img, {
                        width: attrs.cropWidth,
                        height: attrs.cropHeight
                    }, function (err, imgUrl) {
                        _img = imgUrl;
                        replaceImg(_img);
                    });
                } else {
                    buildfire.imageLib.local.cropImage(_img, {
                        width: attrs.cropWidth,
                        height: attrs.cropHeight
                    }, function (err, imgUrl) {
                        _img = imgUrl;
                        replaceImg(_img);
                    });
                }
            });

            function replaceImg(finalSrc) {
                var elem = $("<img>");
                elem[0].onload = function () {
                    element.attr("src", finalSrc);
                    elem.remove();
                };
                elem.attr("src", finalSrc);
            }
        }
      };
    })
    .filter('moneyWithoutTrailingZeros', [function () {
      return function (money) {
        if (money)
          return (money / 100);
        else
          return money;
      };
    }])
    .run(['ViewStack', function (ViewStack) {
      buildfire.navigation.onBackButtonClick = function () {
        if (ViewStack.hasViews()) {
          ViewStack.pop();
        } else {
            buildfire.navigation._goBackOne();
        }
      };
    }]);
})(window.angular, window.buildfire);