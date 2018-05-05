module.controller('KotobaListController', ['$anchorScroll', '$location','$scope', '$http','$sce','$compile','$q','$rootScope','SharedScopes', function ($anchorScroll, $location,$scope, $http, $sce,$compile,$q,$rootScope,SharedScopes) {
	//console.log("id " + id);
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	var lession = ParamList_R['lession'];
	var level = ParamList_R['level'];
	// var kotoba_list = [];
	load_kotoba_list(lession);
  	$scope.gotoAnchor = function(index) {
        var newHash = 'anchor' + index;
        //console.log("new hask " + newHash);
        if ($location.hash() !== newHash) {
          $location.hash('anchor' + index);
        } else {
          $anchorScroll();
        }
      };
	function load_kotoba_list (lession){
		main_modal.show();
		$http({
			method: 'POST',
			url: host + '/php/select/kotoba_list .php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({
				session_id: localStorage.getItem('session_id'),
				user_id: id,
				lession_id: lession.id,
				level: level
			})
		})
		.success(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
			// kotoba_list = data;
			angular.forEach(data, function(temp) {
				var nghia = temp.nghia;
				try{
					var arr   = nghia.split(",");
					temp.nghia = arr[0];
				}catch(err){
					// //console.log(temp);
					// debugger;
				}
				
				if (temp.hiragana == " "){
					temp.hiragana = temp.kanji;
				}
			});
			$scope.kotoba_list = data;

			//console.log(data);
		}).error(function(data, status, headers, config) {
			if (data == "session_ng") {
				main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
				return;
			}
		});
	}
	$scope.load_kotoba_detail = function(kotoba, index){
		main_modal.show();
		ParamList_W['lession_id'] = lession.id;
		ParamList_W['lession'] = lession;
		ParamList_W['kotoba'] = kotoba;
		ParamList_W['index'] = index;

		ParamList_W['list_kotoba'] = $scope.kotoba_list;
		SharedScopes.set(ParamList_W);
		// //console.log(index);
		$scope.main_navigator.pushPage("Kotoba/kotoba_detail.html", { animation : 'slide' ,onTransitionEnd : function() {
			main_modal.hide();
		}});
	}

	// $scope.set_play_audio = function(kotoba){
	// 	var audio_id = kotoba.number;
	// 	document.getElementById(audio_id).play();
	// }
	$scope.set_play_audio = function(kotoba) {
        var audio = new Audio(kotoba.media_url);
        audio.play();
    };
	$scope.set_favorite = function(kotoba){
		console.log(id);
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
		ParamList_W['kotoba_id'] = kotoba.number;
		ParamList_W['level'] = level;
		localStorage.setItem('kotoba_id',kotoba.number );
		localStorage.setItem('level',level );
		SharedScopes.set(ParamList_W);
		ons.createDialog('Kotoba/dialog_favorit.html', { parentScope: $scope})
          .then(function(dialog) {
            this.dialog = dialog;
            dialog.show();
      	}.bind(this));
          $http({
				method: 'POST',
				url: host+'/php/select/favorite_list_of_user.php', // 適宜変更する
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({session_id: localStorage.getItem('session_id'), user_id: id})
		}).success(function(data, status, headers, config) {
			// main_modal.hide();
			$scope.list_favorit = data;
			//console.log($scope.list_favorit);
			angular.forEach($scope.list_favorit, function(temp){
				temp.check=false;
			});
			// if(data=="varsion_check_ng"){
			// 	ons.notification.alert({
			// 		message: 'アプリのアップデートが行われましたストアにてアップデートをお願いします。',
			// 		title: 'アップデート通知',
			// 		buttonLabel: 'OK',
			// 		animation: 'default', // もしくは'none'
			// 		callback: function() {
			// 			if(monaca.isAndroid === true){
			// 				$window.open("https://play.google.com/store/apps/details?id=com.sportrai&hl=ja","_system");
			// 			}else{
			// 				setTimeout(function() {
			// 					$window.open("https://itunes.apple.com/jp/app/supotore/id1188222609?mt=8","_system");
			// 				}, 0);
			// 			}
			// 		}
				// });
				// return;
			// }else if(data=="session_ng"){
			// 	main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
			// 	return;
			// }
		})
		.error(function(data, status, headers, config) {
			$scope.message = 'failed';
		});

		// var flag = !kotoba.goi_favorite ? "insert" : "delete";
		// $http({
		// 	method: 'POST',
		// 	url: host + '/php/insert/favorite.php', // 適宜変更する
		// 	headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
		// 	data: $.param({
		// 		session_id: localStorage.getItem('session_id'),
		// 		user_id: id,
		// 		goi_number: kotoba.number,
		// 		flag: flag
		// 	})
		// })
		// .success(function(data, status, headers, config) {
		// 	if (data == "session_ng") {
		// 		main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
		// 		return;
		// 	}
		// 	//console.log(data);
		// 	if (data == "session_ok"){
		// 		kotoba.goi_favorite = !kotoba.goi_favorite ;
		// 	}
		// }).error(function(data, status, headers, config) {
		// 	main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
		// });
	}
	$scope.back = function(){
		$scope.main_navigator.resetToPage("UserHome/user_home.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
	}
}]);
