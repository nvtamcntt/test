module.controller('DialogFavoritController', ['$scope', '$http', '$sce','$rootScope','SharedScopes', function($scope, $http, $sce,$rootScope,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	// var kotoba = ParamList_R['kotoba'];
	// var lession = ParamList_R['lession'];
	// var index = ParamList_R['index'];
	// //console.log(ParamList_R['list_kotoba']);
	// var list = refresh_list(ParamList_R['list_kotoba']);

	// $scope.list_kotoba = list;

	// $scope.view_lession_name = kotoba.lession_name;
	var kotoba_id = ParamList_R['kotoba_id'];
	var level     = ParamList_R['level'];


	//#############################################################
	$scope.add_to_favorit = function(favorit){
		// //console.log("create_favorit", favorit);
		dialog_favorit.hide();
		// //console.log(favorit);
		$http({
				method: 'POST',
				url: host + '/php/insert/favorite_list_of_user_insert.php', // 適宜変更する
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({
					session_id: localStorage.getItem('session_id'),
					user_id: id,
					kotoba_id: kotoba_id,
					level: level,
					add_new: 0,
					id_favorit : favorit.id
				})
			})
			.success(function(data, status, headers, config) {
				if (data == "session_ng") {
					main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
					return;
				}
			}).error(function(data, status, headers, config) {
				if (data == "session_ng") {
					main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
					return;
				}
			});
	}
	//########################Calcel################################
	$scope.cancel = function(favorit){
		dialog_favorit_add.hide();
	}
	//#######################OK####################################
	$scope.ok = function (){
		kotoba_id = localStorage.getItem('kotoba_id');
		level = localStorage.getItem('level');
		if ($scope.favorit_input == undefined){
			$scope.favorit_input = "Mặc định";
		}
		//console.log($scope.favorit_input);
			$http({
				method: 'POST',
				url: host + '/php/insert/favorite_list_of_user_insert.php', // 適宜変更する
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({
					session_id: localStorage.getItem('session_id'),
					user_id: id,
					kotoba_id: kotoba_id,
					level: level,
					add_new: 1,
					title_favorit : $scope.favorit_input
				})
			})
			.success(function(data, status, headers, config) {
				if (data == "session_ng") {
					main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
					return;
				}

				dialog_favorit_add.hide();
			}).error(function(data, status, headers, config) {
				if (data == "session_ng") {
					main_navigator.resetToPage('Login/sesson_ng.html', { animation: 'slide' });
					return;
				}
			});
		// }
	}
	//############################Show dialog#############################
	$scope.create_favorit = function(){
		// //console.log("create_favorit");
		ons.createDialog('Kotoba/dialog_favorit_add.html', {  parentScope: $scope})
	      .then(function(dialog1) {
	        dialog1.show();
      	});
		dialog_favorit.hide();
	}

	/*Xử lý slide view*/
	/*----------------------------------------------------------*/
	/*----------------------------------------------------------*/

}]);
