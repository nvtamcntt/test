module.controller('NewConmmentController', ['$scope', '$http', '$sce','SharedScopes', function ($scope, $http, $sce,SharedScopes) {
	var ParamList_W = [];

	$scope.add_comment=function(){
		$http({
			method: 'POST',
			url: host+'/php/insert/comment_insert.php',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({user_id: id,  
                        content: $scope.content})
		})
		.success(function(data, status, headers, config) {
			main_navigator.resetToPage('manager/comment_list.html', { animation : 'none' ,onTransitionEnd : function() {
			// main_modal.hide();
			}});
		})
		.error(function (data, status, headers, config) {
			$scope.message = 'failed';
		})
	}

}]);
