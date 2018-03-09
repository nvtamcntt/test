module.controller('UserSideFooterController', ['$scope', '$http', '$sce', '$compile','$window','$rootScope','SharedScopes','$timeout', function($scope, $http, $sce, $compile,$window,$rootScope,SharedScopes,$timeout) {

	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	$scope.click_lock=false;

	$scope.user_home_base=true;
	$scope.mytraining_base=false;
	$scope.trainer_list_base=false;
	$scope.timeline_base=false;
	$scope.timeline_base2=false;
	$scope.management_base=false;
	$scope.management_base2=false;
	$scope.base_timeline_icon_show=true;

	ons.ready(function() {
		ons.createDialog('TL/option/user_create_dialog2.html', {parentScope: $scope}).then(function(dialog3) {
		});
	});

	user_read();
	$http({
		method: 'POST',
		url: host+'/php/select/partner_free_flag.php', // 適宜変更する
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
		data: $.param({session_id: localStorage.getItem('session_id'),user_id: id})
	})
	.success(function(data, status, headers, config) {
		//console.log(data);
		if(data=="session_ng"){
			main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
			return;
		}
		$scope.partner_free_flag=data[0].partner_free_flag;
	})
	.error(function (data, status, headers, config) {
		//console.log(data);
		//console.log(status);
		//console.log(config);
	});

	$scope.footer = function(footerflag) {
		footer_c(footerflag);

	}

	function footer_c(footerflag){
		//console.log(footerflag);
		if(footerflag=="base_mytraining"){
			$scope.mytraining_base=true;
			$scope.user_home_base=false;
			$scope.trainer_list_base=false;
			$scope.timeline_base=false;
			$scope.timeline_base2=false;
			$scope.management_base=false;
			$scope.management_base2=false;
		}else if(footerflag=="base_user_home"){
			$scope.mytraining_base=false;
			$scope.user_home_base=true;
			$scope.trainer_list_base=false;
			$scope.timeline_base=false;
			$scope.timeline_base2=false;
			$scope.management_base=false;
			$scope.management_base2=false;
		}else if(footerflag=="base_trainer_list"){
			$scope.mytraining_base=false;
			$scope.user_home_base=false;
			$scope.trainer_list_base=true;
			$scope.timeline_base=false;
			$scope.timeline_base2=false;
			$scope.management_base=false;
			$scope.management_base2=false;
		}else if(footerflag=="base_timeline"){
			$scope.mytraining_base=false;
			$scope.user_home_base=false;
			$scope.trainer_list_base=false;
			$scope.timeline_base=false;
			$scope.timeline_base2=true;
			$scope.management_base=false;
			$scope.management_base2=false;
			//$scope.base_timeline_icon_show=false;
		}else if(footerflag=="base_management"){
			$scope.mytraining_base=false;
			$scope.user_home_base=false;
			$scope.trainer_list_base=false;
			$scope.timeline_base=false;
			$scope.timeline_base2=false;
			$scope.management_base=false;
			$scope.management_base2=true;
			//$scope.base_timeline_icon_show=false;
		}
	};


	$scope.menuOpen = function() {
		$scope.tl.menu.toggleMenu();
		user_read();
	}

	$scope.noticelist = function(index){
		ParamList_W['color'] = "b_umain";
		SharedScopes.set(ParamList_W);
		if($scope.click_lock)return;
		$scope.click_lock=true;

		$scope.main_navigator.pushPage('TL/notice/notice_list.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	};



	$scope.acr_open = function($event){
		$($event.target).next().slideToggle();
		$($event.target).parent().toggleClass('open');
		$($event.target).toggleClass('open');
	}


	$scope.menu_click = function($event){
		tl.menu.closeMenu();
		var num = $($event.target).attr('data-num');
		if(num<7){
			$('#globalNavi li').removeClass('current');
			switch(Number(num)){
				case 1:
				num = 2;
				break;
				case 2:
				num = 3;
				break;
				case 3:
				num = 1;
				break;
			}
			$('#globalNavi li:nth-of-type(' + num + ')').addClass('current');
		}
	}

	$scope.account_change=function() {
		localStorage.setItem('login_flag',"trainer" );
		$scope.login_navigator.resetToPage('Login/login.html', { animation : 'fade' } );
	}


	$scope.logout=function() {
		//var isOpen = localStorage.getItem("isTLOpen");
		localStorage.clear();
		//localStorage.setItem("isTLOpen", isOpen);//初回起動の判定
		$scope.login_navigator.resetToPage('Login/login.html', { animation : 'fade' ,
			onTransitionEnd: function() {
				$('#login_display').show();
			//console.log("logout show");
		}});
	}

	$scope.logout_dlg=function() {
		ons.notification.confirm({
			message: '本当にログアウトしてもよろしいですか？',
			title: "ログアウト確認",
			buttonLabels:["OK","Cancel"],
			callback: function(idx) {
				switch (idx) {
					case 0:
					$scope.logout();
					break;
				}
			}
		});
	}



	$scope.account_check=function() {
		if(localStorage.getItem('trainer_flag')=="ok"){
			ons.notification.confirm({
				message: 'トレーナーアカウントに切り替えますか？',
				title: "アカウント切り替え確認",
				buttonLabels:["OK","Cancel"],
				callback: function(idx) {
					switch (idx) {
						case 0:
						$scope.account_change();
						break;
					}
				}
			});
		}else {
			ons.notification.confirm({
				message: 'トレーナーアカウントを制作しますか？',
				title: "アカウント制作確認",
				buttonLabels:["OK","Cancel"],
				callback: function(idx) {
					switch (idx) {
						case 0:
						$scope.account_create();
						break;
					}
				}
			});
		}
	}


	$scope.delete_check = function(){
		ons.notification.confirm({
			message: 'アカウントを消去しますか？（この操作は元に戻せません。）',
			title: "アカウント消去確認",
			buttonLabels:["OK","Cancel"],
			callback: function(idx) {
				switch (idx) {
					case 0:
					$scope.delete_check2();
					break;
				}
			}
		});
	}

	$scope.delete_check2 = function(){
		ons.notification.confirm({
			message: '一度消去すると二度と戻せませんが、本当にアカウントを消去してもよろしいですか？',
			title: "アカウント消去再確認",
			buttonLabels:["OK","Cancel"],
			callback: function(idx) {
				switch (idx) {
					case 0:
					$scope.account_delete();
					break;
				}
			}
		});
	}

	$scope.account_delete=function() {
		//console.log("id:"+id);
		$http({
			method: 'POST',
			url: host+'/php/insert/user_delete.php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({session_id: localStorage.getItem('session_id'),user_id: id})
		})
		.success(function(data, status, headers, config) {
			if(data=="session_ng"){
				main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
				return;
			}
			//console.log("account_delte");
			localStorage.clear();
			$scope.login_navigator.resetToPage('Login/login.html', { animation : 'fade' ,
				onTransitionEnd: function() {
					$('#login_display').show();
				//console.log("logout show");
			}});
		})
		.error(function (data, status, headers, config) {
			//console.log("DB接続失敗");
		});
	}

	$scope.account_create = function(){

		ons.notification.confirm({
			message: 'トレーナーアカウントに切り替えをすると氏名、居住地域、性別、プロフィール、その他本アプリケーションに掲載したトレーナーに関する情報が全てのユーザに公開されますがよろしいですか？',
			title: "アカウント制作確認",
			buttonLabels:["OK","Cancel"],
			callback: function(idx) {
				switch (idx) {
					case 0:
					$scope.account_create2();
					break;
				}
			}
		});

		usercreateDialog.show();
		// ons.notification.confirm({
		// 	messageHTML: 'トレーナーアカウントに切り替えをすると氏名、居住地域、性別、プロフィール、その他本アプリケーションに掲載したトレーナーに関する情報が全てのユーザに公開されますがよろしいですか？',
		// 	title: "アカウント制作確認",
		// 	buttonLabels:["OK","Cansel"],
		// 	callback: function(idx) {
		// 		switch (idx) {
		// 			case 0:
		// 					$scope.account_create2();
		// 			break;
		// 		}
		// 	}
		// });

	}

	$scope.account_create2 = function(){
		$http({
			method: 'POST',
			url: host+'/php/insert/trainer_flag_on.php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({session_id: localStorage.getItem('session_id'),user_id: id})
		})
		.success(function(data, status, headers, config) {
			if(data=="session_ng"){
				main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
				return;
			}
			//console.log(data);
			$http({
				method: 'POST',
				url: host+'/php/insert/default_data_insert.php', // 適宜変更する
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({flag: "trainer", user_id: id})
			})
			.success(function(data, status, headers, config) {
				localStorage.setItem('login_flag',"trainer" );
				$scope.login_navigator.resetToPage('Login/login.html', { animation : 'fade' } );
			})
			.error(function (data, status, headers, config) {
				//console.log("DB接続失敗");
			});
		})
		.error(function (data, status, headers, config) {
			//console.log("DB接続失敗");
		});
	}

	$scope.terms_of_service = function(){
		$scope.login_navigator.pushPage('TL/terms_of_service/terms_of_service_list.html', { animation : 'slide' });
	}


	var circle_open_flag=false;
	$scope.circle_open = function($event){
		if(circle_open_flag) {
			$scope.management_base=false;
			circle_open_flag=false;
			//$($event.target).parent().removeClass('current');
			$('#globalFooter .circle, #globalFooter .circle div').removeAttr('style');
		}else {
			$scope.timeline_base=false;
			circle_open_timeline_flag=false;
			$scope.timeline_base2=false;
			$('#globalFooter .circle_timeline, #globalFooter .circle_timeline div').removeAttr('style');
			circle_open_flag=true;
			var w = $(window).width();
			var h = w;
			var mt = 1 * (w/1.8);
			var ml = 1 * (w/1.45);
			$($event.target).parent().find('.circle').css({
				'width': w * 0.95 + 'px',
				'height': w * 0.95 + 'px',
				'border-radius': w + 'px',
				'marginTop': -1 * mt + 'px',
				'marginLeft': -1 * ml + 'px'
			});

			//つぶやく
			var x = ml - (0.9 * ml);
			var y = mt - (Math.tan(30/180 * Math.PI) * x);
			$('#globalFooter li .circle .tweet').css({
				'top': y + 'px',
				'left': x + 'px'
			});

			//食事管理
			var x = ml - (0.76 * ml);
			var y = mt - (Math.tan(56/180 * Math.PI) * x);
			$('#globalFooter li .circle .meal').css({
				'top': y + 'px',
				'left': x + 'px'
			});

			//体重管理
			var x = ml - (0.5 * ml);
			var y = mt - (Math.tan(51/180 * Math.PI) * x);
			$('#globalFooter li .circle .weight').css({
				'top': y + 'px',
				'left': x + 'px'
			});
			$scope.management_base=true;
			//$($event.target).parent().addClass('current');
		}
	}

	var circle_open_timeline_flag=false;

	$scope.circle_open_timeline = function($event){
		//$scope.base_timeline_icon_show=true;
		//console.log("aaaa");
		//$scope.timeline_base2=false;
		if(circle_open_timeline_flag) {
			$scope.timeline_base=false;
			circle_open_timeline_flag=false;
			$scope.timeline_base2=false;
			$('#globalFooter .circle_timeline, #globalFooter .circle_timeline div').removeAttr('style');
		}else {
			$scope.management_base=false;
			circle_open_flag=false;
			$('#globalFooter .circle, #globalFooter .circle div').removeAttr('style');

			$scope.timeline_base=true;
			circle_open_timeline_flag=true;
			var w = $(window).width();
			var h = w;
			var mt = 1 * (w/1.8);
			var ml = 1 * (w/3.4);
			$($event.target).parent().find('.circle_timeline').css({
				'width': w * 0.95 + 'px',
				'height': w * 0.95 + 'px',
				'border-radius': w + 'px',
				'marginTop': -1 * mt + 'px',
				'marginLeft': -0.9 * ml + 'px'
			});
			var x = ml - (0.76 * ml);
			var y = mt - (Math.tan(80/180 * Math.PI) * x);
			$('#globalFooter li .circle_timeline .timeline').css({
				'top': y + 'px',
				'right': x + 'px'
			});

			var x = ml - (0.5 * ml);
			var y = mt - (Math.tan(56/180 * Math.PI) * x);
			$('#globalFooter li .circle_timeline .calendar').css({
				'top': y + 'px',
				'right': x-172 + 'px'
			});
		}
	}


	$scope.plan = function(){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		main_navigator.resetToPage('plan/user_plan_home.html', { animation : 'slide' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	};


	$scope.profile_main = function(){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		main_navigator.resetToPage('Profile/profile_main.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	};

	$scope.card_entry = function(){
		ParamList_W['color'] = "b_umain";
		SharedScopes.set(ParamList_W);
		if($scope.click_lock)return;
		$scope.click_lock=true;
		//console.log("aaa");
		$scope.main_navigator.pushPage('card/card_entry.html', { animation : 'slide' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	};

	$scope.tutorial = function(){
		ParamList_W['color'] = "b_umain";
		SharedScopes.set(ParamList_W);
		if($scope.click_lock)return;
		$scope.click_lock=true;
		$scope.main_navigator.pushPage('TL/tutorial/tutorial_list.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	};


	$scope.MyTraining = function(){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		main_modal.show();
		main_navigator.resetToPage('MyTraining/mytraining_list/mytraining_training_list.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	}


	$scope.user_home = function(){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		main_modal.show();
		main_navigator.resetToPage('UserHome/user_home.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	}


	$scope.trainer_list = function(){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		main_modal.show();
		main_navigator.resetToPage('Trainer/trainer_list/trainer_list.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	}

	$scope.tweet = function(event){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		$('#globalFooter li').removeClass('current');
		$('#globalFooter .circle, #globalFooter .circle div').removeAttr('style');
		//$('#globalFooter li:nth-of-type(3)').addClass('current');
		ParamList_W.flag = "new";
		SharedScopes.set(ParamList_W);
		main_modal.show();
		$scope.main_navigator.resetToPage('userTL/timeline.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	}

	$scope.meal = function(event){
		//event.stopPropagation();
		if($scope.click_lock)return;
		$scope.click_lock=true;
		//$('#globalFooter li').removeClass('current');
		//$('#globalFooter .circle, #globalFooter .circle div').removeAttr('style');
		//$('#globalFooter li:nth-of-type(3)').addClass('current');

		var getPages=$scope.main_navigator.getPages().length;
		for(var i=0; i<getPages.length; i++){
			//console.log($scope.main_navigator.getPages()[i].page);
			if(getPages[i].page=="TL/meal/meal_list.html"){
				$rootScope.$broadcast('meal_list_edit');
				$scope.click_lock=false;
				return;
				break;
			}else{
				$scope.main_navigator.getPages()[i].destroy();
			}
		}
		ParamList_W.flag = "new";
		SharedScopes.set(ParamList_W);
		main_modal.show();

		//NOTE 食事管理を2回開くと色が変わるバグ
		//数字入力画面のページを2回開くと入力ダイヤルが出ずにキーボードが出てくる
		$scope.main_navigator.resetToPage('TL/tutorial/tutorial_list.html', { animation : 'none'});
		//END NOTE
		$scope.main_navigator.resetToPage('TL/meal/meal_list.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
			//console.log($scope.click_lock);
		}});
	}

	$scope.weight = function(event){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		//$('#globalFooter li').removeClass('current');
		//$('#globalFooter .circle, #globalFooter .circle div').removeAttr('style');
		//$('#globalFooter li:nth-of-type(3)').addClass('current');

		var getPages=$scope.main_navigator.getPages().length;
		for(var i=0; i<getPages.length; i++){
			if(getPages[i].page=="TL/weight_new/weight_list.html"){
				$rootScope.$broadcast('weight_list_broadcast');
				$scope.click_lock=false;
				return;
				break;
			}else{
				$scope.main_navigator.getPages()[i].destroy();
			}
		}
		ParamList_W.flag = "new";
		SharedScopes.set(ParamList_W);
		main_modal.show();
		//NOTE 食事管理を2回開くと色が変わるバグ。　
		//数字入力画面のページを2回開くと入力ダイヤルが出ずにキーボードが出てくる
		$scope.main_navigator.resetToPage('TL/tutorial/tutorial_list.html', { animation : 'none'});
		//END NOTE
		$scope.main_navigator.resetToPage('TL/weight_new/weight_list.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
			$rootScope.$broadcast('weight_list_broadcast');
		}});
	}

	$scope.chat_list = function(){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		main_modal.show();
		main_navigator.resetToPage('Chat_new/chat_list.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	}

	$scope.timeline = function(event){
		if(event!=undefined){
			event.stopPropagation();
		};
		circle_open_timeline_flag=false;
		$scope.timeline_base2=true;
		if($scope.click_lock)return;
		$scope.click_lock=true;
		//$('#globalFooter ul li').removeClass('current');
		$('#globalFooter .circle_timeline, #globalFooter .circle_timeline div').removeAttr('style');
		//$('#globalFooter li:nth-of-type(1)').addClass('current');
		//$scope.timeline_base=true;
		//console.log($scope.timeline_base);
		ParamList_W.flag = "new";
		// SharedScopes.set(ParamList_W);
		main_modal.show();
		$scope.main_navigator.resetToPage('userTL/timeline.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	}

	$scope.calendar = function(event){
		event.stopPropagation();
		circle_open_timeline_flag=false;
		if($scope.click_lock)return;
		$scope.click_lock=true;
		//$('#globalFooter ul li').removeClass('current');
		$('#globalFooter .circle_timeline, #globalFooter .circle_timeline div').removeAttr('style');
		//$('#globalFooter li:nth-of-type(3)').addClass('current');

		ParamList_W.flag = "new";
		// SharedScopes.set(ParamList_W);
		main_modal.show();
		$scope.main_navigator.resetToPage('userTL/calendar.html', { animation : 'none' ,onTransitionEnd : function() {
			$scope.click_lock=false;
		}});
	}

	$scope.$on('change_page', function(a,change_page_footerflag) {
		//console.log(change_page_footerflag);
		footer_c(change_page_footerflag);
	});


	$scope.$on('bottom_botton_ok', function() {
		main_modal.hide();
	});
	function user_read (){
		$http({
			method: 'POST',
		url: host+'/php/select/user_read_flg.php', // 適宜変更する
		headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
		data: $.param({session_id: localStorage.getItem('session_id'), user_id: id})
	})
		.success(function(data, status, headers, config) {
		//console.log(data);
		if(data=="session_ng"){
			main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
			return;
		}
		if(data!=null){
			$rootScope.user_not_read = true;
		}
		if(data==null){
			$rootScope.user_not_read = false;
		}
	})
		.error(function (data, status, headers, config) {
		});
	}
}]);