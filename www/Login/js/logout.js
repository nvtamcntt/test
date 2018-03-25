module.controller('LogoutController', ['$scope', '$http','$timeout','$window','SharedScopes', function ($scope, $http,$timeout,$window,SharedScopes) {

	$scope.logout=function() {
		localStorage.clear();
		id=null;
		user_id = null;
		$scope.login_navigator.resetToPage('Login/login.html', { animation : 'fade' ,
		onTransitionEnd: function() {

		}});
	}
	}]);