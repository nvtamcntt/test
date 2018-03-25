// This is a JavaScript file

module.controller('LoginController', ['$scope', '$http','$timeout','$window','SharedScopes', function ($scope, $http,$timeout,$window,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	var is_click = false ;
	var require_login = false;
	is_click = ParamList_R['is_click'];
	require_login = ParamList_R['require_login'];
	var c_id = localStorage.getItem('id');
	var c_pass = localStorage.getItem('pass');
	$scope.id_error = "";
	console.log("gia tri id " + c_id);
	console.log("gia tri pass " + c_pass);
	
	login(c_id,c_pass,"auto");
	// if( c_id !=null && c_id != "" && c_pass != null && c_pass != ""){
	// 	console.log("auto");
	// 	login(c_id,c_pass,"auto");
	// }
	// else {
	// 	$scope.login_navigator.resetToPage('UserHome/user_slide.html', { animation : 'fade' } );	
	// }

	function login (c_id,c_pass,mode){
		if (is_click){
			c_id = document.getElementById("id").value;
			c_pass = document.getElementById("pass").value;
		}else if (require_login){
			require_login = false;
			return;
		}
		// console.log("gia tri sau khi loat " + c_id);
		// console.log("gia tri sau khi loat " + c_pass);
		$http({
			method: 'POST',
			url: host+'/php/select/login.php',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({account_id: c_id, pass: c_pass})
		})
		.success(function(data, status, headers, config) {
			console.log(data);
			if(data=="login_ng"){
				if (!is_click){
					$scope.id_error="";
					$scope.login_navigator.resetToPage('UserHome/user_slide.html', { animation : 'fade' } );	
				}else {
					if (mode == "auto"){
						$scope.id_error= ""
					}else
					$scope.id_error="Đăng nhập không thành công!";
				}
				return
			}else if(data){
				$scope.id_error = "";
				localStorage.setItem('session_id',data[0].session_id );
				localStorage.setItem('id',c_id );
				localStorage.setItem('pass',c_pass );
				id=data[0].user_id;

				// ParamList_R = SharedScopes.get();
				// SharedScopes.delete();
				ParamList_W['username'] = data[0].username;;
				SharedScopes.set(ParamList_W);
				$scope.login_navigator.resetToPage('UserHome/user_slide.html', { animation : 'fade' } );
				// }else{
					// $('body').attr('id','user');
					// $scope.login_navigator.resetToPage('UserHome/user_slide.html', { animation : 'slide' } );
				// }
				//navigator.splashscreen.hide();
			}
			// else {
			// 	$scope.login_navigator.resetToPage('UserHome/user_slide.html', { animation : 'fade' } );	
			// }
			
			var login_id = localStorage.getItem('user_id');
			//console.log(login_id)
		})
		.error(function (data, status, headers, config) {
			//console.log("DB接続失敗");
		});
	}

	$scope.loginck = function() {
		var c_id = document.getElementById("id").value;
		var c_pass = document.getElementById("pass").value;
		login(c_id,c_pass,"click");
	}
	$scope.registration = function() {
		$scope.main_navigator.pushPage('Login/register.html', { animation : 'slide' } );
	}
	$scope.popPage = function(){
        $scope.main_navigator.pushPage('UserHome/user_home.html', { animation : 'slide' } );
    }
}]);
