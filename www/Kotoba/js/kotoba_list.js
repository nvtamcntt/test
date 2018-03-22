module.controller('KotobaListController', ['$scope', '$http','$sce','$compile','$q','$rootScope','SharedScopes', function ($scope, $http, $sce,$compile,$q,$rootScope,SharedScopes) {

	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	var lession = ParamList_R['lession'];
	var kotoba_list = [];
	load_kotoba_list(lession.id);
	function load_kotoba_list (lession_id){
		$http({
			method: 'POST',
			url: host + '/php/select/kotoba_list .php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({
				session_id: localStorage.getItem('session_id'),
				user_id: id,
				lession_id: lession_id
			})
		})
		.success(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
			kotoba_list = data;
			angular.forEach(data, function(temp) {
				var nghia = temp.nghia;
				var arr   = nghia.split(",");
				temp.nghia = arr[0];
				// console.log(arr);
			});
			$scope.kotoba_list = data;
			// console.log(data);
		}).error(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
		});
	}
	$scope.load_kotoba_detail = function(kotoba, index){
		ParamList_W['lession_id'] = lession.id;
		ParamList_W['lession'] = lession;
		ParamList_W['kotoba'] = kotoba;
		ParamList_W['index'] = index;

		ParamList_W['list_kotoba'] = $scope.kotoba_list;
		SharedScopes.set(ParamList_W);
		console.log(index);
		$scope.main_navigator.pushPage("Kotoba/kotoba_detail.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
	}

	$scope.search = function(kotoba){
		// ParamList_W['lession_id'] = lession.id;
		// ParamList_W['lession'] = lession;
		// ParamList_W['kotoba'] = kotoba;
		// ParamList_W['list_kotoba'] = $scope.kotoba_list;
		// SharedScopes.set(ParamList_W);
		
		// $scope.main_navigator.pushPage("Kotoba/kotoba_detail.html", { animation : 'slide' ,onTransitionEnd : function() {
		// }});
	}
	$scope.back = function(){
		$scope.main_navigator.resetToPage("UserHome/user_home.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
	}
}]);
