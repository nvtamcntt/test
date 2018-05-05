module.controller('InforController', ['$scope', '$http', '$sce','SharedScopes', function ($scope, $http, $sce,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	// console.log(ParamList_R);
	SharedScopes.delete();

	$scope.t_back = ParamList_R['color'];

	$http({
			method: 'POST',
			url: host+'/php/select/information.php',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
		})
		.success(function(data, status, headers, config) {

			$scope.information = data[0].content;
		})
		.error(function (data, status, headers, config) {
			$scope.message = 'failed';
		});


	$scope.add_comment = function(index){
		 $scope.main_navigator.pushPage('manager/comment_new.html',{ animation : 'none' });
	};

	$scope.menuOpen = function() {
		$scope.tl.menu.toggleMenu();
	}
}]);
