module.controller('UserSideFooterController', ['$scope', '$http', '$sce', '$compile','$window','$rootScope','SharedScopes','$timeout', function($scope, $http, $sce, $compile,$window,$rootScope,SharedScopes,$timeout) {

	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	
}]);