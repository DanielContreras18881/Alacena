angular.module('alacena.directives',[])
/**
* Directiva para resetear un input
*/
.directive('resetField', ['$compile', '$timeout', function($compile, $timeout) {
    return {
    require: 'ngModel',
    scope: {},
    link: function(rootScope, el, attrs, ctrl) {

        // limit to input element of specific types
        var inputTypes = /text|search|tel|url|email|password/i;
        if (el[0].nodeName === "INPUT") {
            if (!inputTypes.test(attrs.type)) {
                throw new Error("Invalid input type for resetField: " + attrs.type);
            }
        } else if (el[0].nodeName !== "TEXTAREA") {
            throw new Error("resetField is limited to input and textarea elements");
        }

        // compiled reset icon template
        var template = $compile('<i ng-show="enabled" ng-mousedown="resetData()" class="icon ion-close-circled reset-field-icon"></i>')(rootScope);
        el.addClass("reset-field");
        el.after(template);

        rootScope.resetData = function() {
            ctrl.$setViewValue(null);
            ctrl.$render();
            $timeout(function() {
                el[0].focus();
            }, 0, false);
            rootScope.enabled = false;
        };

        el.bind('input', function() {
            rootScope.enabled = !ctrl.$isEmpty(el.val());
        })
        .bind('focus', function() {
            $timeout(function() { //Timeout just in case someone else is listening to focus and alters model
                rootScope.enabled = !ctrl.$isEmpty(el.val());
                rootScope.$apply();
            }, 0, false);
        })
       .bind('blur', function() {
            $timeout(function() {
                rootScope.enabled = false;
                rootScope.$apply();
            }, 0, false);
        })
      ;
    }
    };
}]);
