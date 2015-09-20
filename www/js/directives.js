angular.module('alacena.directives',[])
/**
* Directiva para resetear un input
*/
.directive('resetField', ['$compile', '$timeout', function($compile, $timeout,logdata) {
    return {
    require: 'ngModel',
    scope: {},
    link: function(rootScope, el, attrs, ctrl) {

        // limit to input element of specific types
        var inputTypes = /text|search|tel|url|email|password/i;
        if (el[0].nodeName === "INPUT") {
            if (!inputTypes.test(attrs.type)) {
                logdata.messageError('directives:resetField:error=Invalid input type for resetField:'+ attrs.type);
                throw new Error("Invalid input type for resetField: " + attrs.type);
            }
        } else if (el[0].nodeName !== "TEXTAREA") {
            logdata.messageError('directives:resetField:error=resetField is limited to input and textarea elements');
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
            logdata.messageLog('directives:resetField:resetData');
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
}])

.directive('detectGestures', function($ionicGesture,$ionicSideMenuDelegate,$rootScope) {
  return {
    restrict :  'A',

    link : function(scope, elem, attrs) {
      var gestureType = attrs.gestureType;

		var onSwipeLeft = function(){
			  //$ionicSideMenuDelegate.toggleLeft();
        $rootScope.optionsOpen = !$rootScope.optionsOpen;
        if($ionicSideMenuDelegate.isOpen()){
			     $ionicSideMenuDelegate.toggleLeft();
        }
        $rootScope.$evalAsync();
		};
		var onSwipeRight = function(){
        if(!$rootScope.optionsOpen){
          $ionicSideMenuDelegate.toggleLeft();
        }else{
          $rootScope.optionsOpen = !$rootScope.optionsOpen;
        }
        $rootScope.$evalAsync();
		};

      switch(gestureType) {
        case 'swiperight':
          $ionicGesture.on('swiperight', onSwipeRight, elem);
          break;
        case 'swipeleft':
          $ionicGesture.on('swipeleft', onSwipeLeft, elem);
          break;
      }

    }
  }
})

;
