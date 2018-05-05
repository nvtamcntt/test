module.controller('LoadN3Controller', ['$scope', '$filter', '$http', '$sce','$window', '$compile', '$timeout','$rootScope','$q', 'SharedScopes', function($scope, $filter, $http, $sce,$window, compile,$timeout,$rootScope,$q, SharedScopes) {

	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();

    
	$scope.menuOpen = function() {
		$scope.tl.menu.toggleMenu();
	}

	$scope.open_lession_list = function (lession){
		//console.log(lession);
		ParamList_W['lession'] = lession;
		ParamList_W['level'] = 3;
		SharedScopes.set(ParamList_W);
		
		$scope.main_navigator.pushPage("Kotoba/kotoba_list.html", { animation : 'slide' ,onTransitionEnd : function() {
			main_modal.hide();
		}});
	}

	ons.ready(function() {
		$http({
			method: 'POST',
			url: host + '/php/select/lession_list.php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({
				session_id: localStorage.getItem('session_id'),
				user_id: id,
				level : 3
			})
		})
		.success(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
			$scope.lession_list = data;
		}).error(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
		});
	});
}]);
