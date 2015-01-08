angular.module('myApp')
        .directive('jqmBootstrap', function () {
            return function (scope, element, attrs) {
                $(element).parent().trigger('create');
            };
        })
        .directive('jqmDynamicList', function ($timeout) {
            return {
                restrict: 'A',
                link: function (scope, element, attr) {
                    var $ul = $(element).parent();
                    if (scope.$first === true) {
                        $ul.css('visibility', 'hidden');
                    }
                    if (scope.$last === true) {
                        $timeout(function () {
                            $ul.listview('refresh', true);
                            $ul.css('visibility', '');
                        });
                    }
                }
            }
        })
        .directive('jqmSlider', function ($timeout) {
            return function (scope, element, attrs) {
                $(element).slider({
                    create: function () {
                        $(element).parent().find('a').attr('href', 'javascript:return false');
                    }
                });
            };
        })
        .directive('imageHideable', function () {
            return function (scope, element, attrs) {
//                element.on('load', function(){
//                    element.show();
//                });
//                if($(element).parent().parent().hasClass('add-margin')){
//                    $(element).css('margin-bottom', '12px');
//                }
//                 if($(element).parent().parent().hasClass('remove-margin')){
//                    $(element).css('margin-bottom', '-1em');
//                }
            };
        })
        .directive('slideStop', function () {
            return function (scope, element, attrs) {
                $(element).on('slidestop', function () {
                    scope.$eval(attrs.slideStop);
                    scope.$digest();
                });
            };
        })
        .directive('ngTap', function () {
            return function (scope, element, attrs) {
                $(element).on('tap', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    scope.$apply(function () {
                        scope.$eval(attrs.ngTap);
                    });
                    return false;
                });
            };
        })
        .directive('ngTapLink', function ($location) {
            return function (scope, element, attrs) {
                $(element).on('tap', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    scope.$apply(function () {
                        $location.path(attrs.ngTapLink);
                    });
                    return false;
                });
            };
        })
        .directive('ngTapBack', function ($window) {
            return function (scope, element, attrs) {
                $(element).on('tap', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    $window.history.back();
                    return false;
                });
            };
        })
        .directive('ngRemove', function () {
            return function (scope, element, attrs) {
                $(element).on('remove', function (e) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngRemove);
                    });
                });
            };
        })
        .directive('slideableLi', function ($window) {
            return function (scope, element, attrs) {
                var $element = $(element);
                function resolveState(currentLeft) {
                    var breakPoint = scope.menuOpen ? -100 : -90;
                    var newOpenState = currentLeft < breakPoint ? true : false;
                    scope.menuOpen = newOpenState;
                    element.addClass('animate-left');
                    if (newOpenState) {
                        element[0].style.left = '-' + $element.width() + 'px';
                    } else {
                        element[0].style.left = '0px';
                    }
                }
                $(element).on('touchmove', function (e) {
                    var currentX = e.originalEvent.changedTouches[0].clientX;
                    var touchDiff = scope.lastX - currentX;
                    scope.lastX = currentX;
                    var currentLeft = Number(element[0].style.left.replace('px', ''));
                    var newLeft = currentLeft - touchDiff;
                    newLeft > 0 ? newLeft = 0 : null;
                    newLeft < -320 ? newLeft = -320 : null;
                    element[0].style.left = newLeft + 'px';
                });
                $(element).on('touchstart', function (e) {
                    scope.lastX = e.originalEvent.changedTouches[0].clientX;
                });
                $(element).on('touchend', function (e) {
                    resolveState(Number(element[0].style.left.replace('px', '')));
                });
                $(element).on('webkitTransitionEnd', function (e) {
                    if (scope.menuOpen) {
                        $(element).trigger('removed');
                        element.remove();
                    } else {
                        element.removeClass('animate-left');
                    }
                });
                $(element).on('transitionend', function (e) {
                    if (scope.menuOpen) {
                        $(element).trigger('removed');
                        element.remove();
                    } else {
                        element.removeClass('animate-left');
                    }
                });
                $(element).on('MStransitionend', function (e) {
                    if (scope.menuOpen) {
                        $(element).trigger('removed');
                        element.remove();
                    } else {
                        element.removeClass('animate-left');
                    }
                });
            };
        });

