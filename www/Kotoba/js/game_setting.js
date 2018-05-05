var coin = 0;

module.controller('GameSettingController', ['$scope', '$http', '$sce','$rootScope','SharedScopes', function($scope, $http, $sce,$rootScope,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();

	var list_question = null;
	var quizt_type   = 1;
	$scope.area_sel_set = {
		lang: 'ja',
		theme: 'auto',
		display: 'bottom',
		group: true,
		buttons: [
			{
				text: 'Chọn',
				cssClass: 'set-btn',
				handler: 'set'
			}
		],
		onShow: function (event, inst) {
			var set_btn = $('.set-btn').parent();
			var dialog = $('.set-btn').parent().parent().parent();
			dialog.prepend(set_btn);
		}
	};

	ons.ready(function() {
		
	});
	$scope.list_check = function($index){
		if ($index == 1){
			$scope.check_type1 = true;
			$scope.check_type2 = false;
			$scope.check_type3 = false;
			$scope.check_type4 = false;
		}else if ($index == 2){
			$scope.check_type1 = false;
			$scope.check_type2 = true;
			$scope.check_type3 = false;
			$scope.check_type4 = false;
		}else if ($index == 3){
			$scope.check_type1 = false;
			$scope.check_type2 = false;
			$scope.check_type3 = true;
			$scope.check_type4 = false;
		}else if ($index == 4){
			$scope.check_type1 = false;
			$scope.check_type2 = false;
			$scope.check_type3 = false;
			$scope.check_type4 = true;
		}
		quizt_type = $index;

	}
	$scope.convert_listion
	$scope.start_game = function(){
		if (undefined == $scope.select_level)
			$scope.select_level = "N3 1";

		main_modal.show();
		var select_level = $scope.select_level;
		var select_level = select_level.split(" ");
		var level = select_level[0] == 'N3' ? 3 : 2;
		var lession = select_level[1];
		$http({
				method: 'POST',
				url: host+'/php/select/quizt_list.php', // 適宜変更する
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({session_id: localStorage.getItem('session_id'), 
					user_id: id,
					lession_id : lession,
					level : level,
					type : quizt_type
				})
		}).success(function(data, status, headers, config) {
			list_question = data;
			ParamList_W['list_question'] = list_question;
			ParamList_W['index_question'] = 0;
			SharedScopes.set(ParamList_W);
			$scope.login_navigator.pushPage("Kotoba/game_start.html", { animation : 'slide' ,onTransitionEnd : function() {
				main_modal.hide();
			}});	
			if (!data){
				$scope.is_show_error = true;
			}

		})
		.error(function(data, status, headers, config) {
			$scope.message = 'failed';
		});
		// main_modal.show();
		// ParamList_W['list_question'] = list_question;
		// ParamList_W['index_question'] = 0;
		// SharedScopes.set(ParamList_W);
		// $scope.login_navigator.pushPage("Kotoba/game_start.html", { animation : 'slide' ,onTransitionEnd : function() {
		// 	main_modal.hide();
		// }});		
	}
	$scope.back = function(){
		//console.log("back");
		$scope.login_navigator.resetToPage('UserHome/user_slide.html', { animation : 'fade' } );
	}
}]);
