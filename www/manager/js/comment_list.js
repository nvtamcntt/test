module.controller('edit_NoticeListController', ['$scope', '$http', '$sce','SharedScopes', function ($scope, $http, $sce,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	// console.log(ParamList_R);
	SharedScopes.delete();

	$scope.t_back = ParamList_R['color'];

	$http({
			method: 'POST',
			url: host+'/php/select/comment_list.php',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
		})
		.success(function(data, status, headers, config) {
			//console.log(data);
			angular.forEach(data, function(item){
				if (item.user_name == null)
					item.user_name  = "Ẩn danh";
			})
			$scope.notice_list = data;
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
