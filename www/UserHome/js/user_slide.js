module.controller('UserSideFooterController', ['$scope', '$http', '$sce', '$compile','$window','$rootScope','SharedScopes','$timeout', function($scope, $http, $sce, $compile,$window,$rootScope,SharedScopes,$timeout) {

	var ParamList_R = [];
	var ParamList_W = [];
	$scope.login = false;
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	console.log(ParamList_R['username']);
	if (ParamList_R['username'] != undefined){
		$scope.username = ParamList_R['username'];
		$scope.login = true;
	}
	else {
		$scope.username = "Bạn tôi";
		$scope.login = false;
	} 
	// console.log($scope.username);
	$scope.menu_click = function($event){
		tl.menu.closeMenu();
		var num = $($event.target).attr('data-num');
		// console.log("num ",  num);
		if(num<7){
			$('#globalNavi li').removeClass('current');
			switch(Number(num)){
				case 1:
					num = 1;
				break;
				case 2:
					num = 2;
				break;
				case 3:
					num = 3;
				break;
				case 4:
					num = 4;
				break;
				case 5:
					num = 5;
				break;
				// case 6:
				// 	num = 6;
				// break;
				case 0:
					num = 0;
				break;
			}
			$('#globalNavi li:nth-of-type(' + num + ')').addClass('current');
		}
	}
	
	$scope.registration = function (){
		ParamList_W['is_click'] = true;
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.resetToPage("Login/login.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
		// $scope.main_navigator.pushPage("Login/register.html", { animation : 'slide' ,onTransitionEnd : function() {
		// }});
	}

	$scope.tuvung = function(){
		// ParamList_W['is_exit'] = true;
		// SharedScopes.set(ParamList_W);
		main_navigator.resetToPage('UserHome/user_home.html', { animation : 'none' ,onTransitionEnd : function() {
			// main_modal.hide();
		}});
	}
	$scope.search = function(){
		main_navigator.resetToPage('Kotoba/kotoba_search.html', { animation : 'none' ,onTransitionEnd : function() {
			// main_modal.hide();
		}});
	}

	$scope.favarit = function(){
		// ParamList_W['is_exit'] = true;
		// SharedScopes.set(ParamList_W);
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
		}else {
			main_navigator.resetToPage('Kotoba/kotoba_favorit.html', { animation : 'none' ,onTransitionEnd : function() {
			// main_modal.hide();
			}});
		}

	}

	$scope.comment_list = function(){
		main_navigator.resetToPage('manager/comment_list.html', { animation : 'none' ,onTransitionEnd : function() {
			// main_modal.hide();
		}});
	}
	
	$scope.infor_app = function(){
		main_navigator.resetToPage('manager/information.html', { animation : 'none' ,onTransitionEnd : function() {
			// main_modal.hide();
		}});
	}
	// $scope.admob = function(){
	// 	main_navigator.resetToPage('manager/admob.html', { animation : 'none' ,onTransitionEnd : function() {
	// 		// main_modal.hide();
	// 	}});
	// }
	$scope.logout = function(){
		localStorage.setItem('session_id',"");
		localStorage.setItem('id',"" );
		localStorage.setItem('pass',"" );
		id = "";
		user_id = "";
		login_navigator.resetToPage('UserHome/user_slide.html', { animation : 'none' ,onTransitionEnd : function() {
			// main_modal.hide();
		}});
	}


	$scope.game_setting_direct = function(){

		// login_navigator.resetToPage('Kotoba/game_start.html', { animation : 'none' ,onTransitionEnd : function() {
		// 	// main_modal.hide();
		// }});

		login_navigator.resetToPage('Kotoba/game_setting.html', { animation : 'none' ,onTransitionEnd : function() {
			// main_modal.hide();
		}});
	}

}]);