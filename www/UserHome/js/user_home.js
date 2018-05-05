module.controller('UserHomeController', ['$scope', '$filter', '$http', '$sce','$window', '$compile', '$timeout','$rootScope','$q', 'SharedScopes', function($scope, $filter, $http, $sce,$window, compile,$timeout,$rootScope,$q, SharedScopes) {

	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();

    
	$scope.menuOpen = function() {
		$scope.tl.menu.toggleMenu();
	}

	$scope.open_lession = function (lession){
		console.log(lession);
		ParamList_W['lession'] = lession;
		ParamList_W['level'] = 3;
		SharedScopes.set(ParamList_W);
		
		$scope.main_navigator.pushPage("Kotoba/kotoba_list.html", { animation : 'slide' ,onTransitionEnd : function() {
			main_modal.hide();
		}});
	}
	$scope.load_n3 = function (lession){
		console.log(lession);
		ParamList_W['lession'] = lession;
		ParamList_W['level'] = 3;
		SharedScopes.set(ParamList_W);
		// main_navigator.replacePage('Kotoba/load_n3.html',{ animation : 'none' });
		$scope.main_navigator.pushPage("Kotoba/load_n3.html", { animation : 'slide' ,onTransitionEnd : function() {
			main_modal.hide();
		}});
	}
	$scope.load_n2 = function (lession){
		console.log(lession);
		ParamList_W['lession'] = lession;
		ParamList_W['level'] = 2;
		SharedScopes.set(ParamList_W);
		
		$scope.main_navigator.pushPage("Kotoba/load_n2.html", { animation : 'slide' ,onTransitionEnd : function() {
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
