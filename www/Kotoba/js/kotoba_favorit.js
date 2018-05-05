module.controller('KotobaFavoritController', ['$scope', '$http', '$sce','$rootScope','SharedScopes', function($scope, $http, $sce,$rootScope,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	
	ons.ready(function() {
		if (!id){
			ons.notification.alert({
				message: 'Vui lòng đăng nhập để sử dụng tính năng ghi nhớ từ vựng!',
				title: 'Thông báo',
				buttonLabel: 'OK',
				animation: 'default', 
				callback: function() {
					ParamList_W['require_login'] = true;
					SharedScopes.set(ParamList_W);
					main_navigator.resetToPage('Login/login.html', { animation: 'slide' });
				}
			});
			return;
		}
		$http({
				method: 'POST',
				url: host+'/php/select/favorite_list_of_user.php', // 適宜変更する
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({session_id: localStorage.getItem('session_id'), user_id: id})
		}).success(function(data, status, headers, config) {
			// main_modal.hide();
			$scope.list_favorit = data;
			if (!data){
				$scope.is_show_error = true;
			}

		})
		.error(function(data, status, headers, config) {
			$scope.message = 'failed';
		});
	});
	/*----------------------------------------------------------*/
	$scope.open_list = function(favorit){
		
		ParamList_W['favorit'] = favorit;
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage("Kotoba/kotoba_favorit_list.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
	}
	$scope.remove_favorit = function(favorit){
		
		$http({
				method: 'POST',
				url: host+'/php/insert/favorite_remove.php', 
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({session_id: localStorage.getItem('session_id'), 
					user_id: id,
					favorit_id: favorit.id
				})
		}).success(function(data, status, headers, config) {
			var index = $scope.list_favorit.indexOf(favorit);
			$scope.list_favorit.splice(index, 1); 


		})
		.error(function(data, status, headers, config) {
			$scope.message = 'failed';
		});
		
		// ons.notification.confirm({
		//     messageHTML: 'Bạn muốn xóa dữ liệu',
		//     title: "",
		//     buttonLabels:["Ok","Cancel"],
		//     callback: function(idx) {
		//         switch (idx) {
		//             case 0:
  //           			var index = $scope.list_favorit.indexOf(favorit);
		// 				$scope.list_favorit.splice(index, 1); 
		//             	//console.log(index);
		//             	break;
		//             case 1:
		//             	break;
		//         }
		//     }
		// });
		 
		// $scope.list_favorit = data;
		// $scope.main_navigator.pushPage("Kotoba/kotoba_detail.html", { animation : 'slide' ,onTransitionEnd : function() {
		// }});
	}
}]);
