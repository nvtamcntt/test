module.controller('KotobaFavoritController', ['$scope', '$http', '$sce','$rootScope','SharedScopes', function($scope, $http, $sce,$rootScope,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	
	ons.ready(function() {
		$http({
			method: 'POST',
			url: host + '/php/select/kotoba_favorit.php', 
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({
				session_id: localStorage.getItem('session_id'),
				user_id: id
			})
		})
		.success(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
			angular.forEach(data, function(temp) {
				var nghia = temp.nghia;
				var arr   = nghia.split(",");
				temp.nghia = arr[0];
				// console.log(arr);
			});
			$scope.kotoba_list = data;
			if (data){
				$scope.is_show_error = false;
			}else {
				$scope.is_show_error = true;
			}
		}).error(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
		});
	});
	/*----------------------------------------------------------*/
	$scope.set_favorite = function(kotoba){
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
		var flag = !kotoba.goi_favorite ? "insert" : "delete";
		$http({
			method: 'POST',
			url: host + '/php/insert/favorite.php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({
				session_id: localStorage.getItem('session_id'),
				user_id: id,
				goi_number: kotoba.number,
				flag: flag
			})
		})
		.success(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
			console.log(data);
			if (data == "session_ok"){
				kotoba.goi_favorite = !kotoba.goi_favorite ;
			}
		}).error(function(data, status, headers, config) {
			main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
		});
	}
	$scope.load_kotoba_detail = function(kotoba, index){
		ParamList_W['kotoba'] = kotoba;
		ParamList_W['index'] = index;

		ParamList_W['list_kotoba'] = $scope.kotoba_list;
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage("Kotoba/kotoba_detail.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
	}
}]);
