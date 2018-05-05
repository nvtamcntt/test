module.controller('UserPlanDetailController', ['$scope', '$http', '$sce','SharedScopes', function($scope, $http, $sce, SharedScopes) {

	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	// //console.log(ParamList_R.plan_list);
	$scope.plan_ok_show_flag=true;
	$scope.all_note=false;
	$scope.all_note_title="Read more";
	
	$scope.show_plan_list=ParamList_R.plan_list;
	
	$scope.capacity=ParamList_R.plan_list.capacity;
	$scope.charge_id=ParamList_R.plan_list.charge_id;
	$scope.conditions=ParamList_R.plan_list.conditions;
	$scope.id=ParamList_R.plan_list.id;
	$scope.match_flag=ParamList_R.plan_list.match_flag;
	$scope.money=ParamList_R.plan_list.money;
	// $scope.note=ParamList_R.plan_list.note;
	$scope.payment_method=ParamList_R.plan_list.payment_method;
	$scope.plan_name=ParamList_R.plan_list.plan_name;
	$scope.plan_partner=ParamList_R.plan_list.plan_partner;
	$scope.plan_period=ParamList_R.plan_list.plan_period;
	$scope.plan_tr_background_url=ParamList_R.plan_list.plan_tr_background_url;
	$scope.plan_user_name=ParamList_R.plan_list.plan_user_name;
	$scope.plan_user_tr_profile_url=ParamList_R.plan_list.plan_user_tr_profile_url;
	$scope.publishing_end_date=ParamList_R.plan_list.publishing_end_date;
	$scope.publishing_settings=ParamList_R.plan_list.publishing_settings;
	$scope.publishing_start_date=ParamList_R.plan_list.publishing_start_date;
	$scope.purpose=ParamList_R.plan_list.purpose;
	$scope.purpose_type_meal=ParamList_R.plan_list.purpose_type_meal;
	$scope.purpose_type_training=ParamList_R.plan_list.purpose_type_training;
	$scope.purpose_type_weight=ParamList_R.plan_list.purpose_type_weight;
	$scope.rec=ParamList_R.plan_list.rec;
	$scope.run_date=ParamList_R.plan_list.run_date;
	$scope.run_flag=ParamList_R.plan_list.run_flag;
	$scope.status=ParamList_R.plan_list.status;
	$scope.user_id=ParamList_R.plan_list.user_id;
	$scope.webpay_cus_id=ParamList_R.plan_list.webpay_cus_id;
	$scope.plan_user_area=ParamList_R.plan_list.plan_user_area;
	$scope.height;

	if($scope.plan_partner!=undefined || $scope.plan_partner.length!=0){
		if($scope.plan_partner.length<5){
			$scope.height=$scope.plan_partner.length;
		}else{
			$scope.height="over5";
		}
	}
	
	if(ParamList_R.plan_list.note.length>=150){
		$scope.note=ParamList_R.plan_list.note.slice(0,150)+'...';
	}else{
		$scope.note=ParamList_R.plan_list.note;
	}
	//console.log($scope.show_plan_list);
	if(ParamList_R.plan_list.plan_partner!=undefined){
		$scope.show_plan_list_partner_length=ParamList_R.plan_list.plan_partner.length;
	}else{
		$scope.show_plan_list_partner_length=0;
	}

	angular.forEach(ParamList_R.plan_list.plan_partner, function(temp) {//自分が申し込んでいるかチェック
		if(temp.plan_partner_user_id==id)$scope.plan_ok_show_flag=false;
		$scope.plan_message="既に申込済です";
	});
	if(ParamList_R.plan_list.capacity-$scope.show_plan_list_partner_length<=0){//定員チェック
		$scope.plan_ok_show_flag=false;
		$scope.plan_message="既に定員まで申込があります";
	}
	if(ParamList_R.plan_list.user_id==id){//自分で申し込んでいないかチェック
		$scope.plan_ok_show_flag=false;
		$scope.plan_message="自分のプランに申込はできません";
	}

	background_css=".profile-card {background-image: url("+ParamList_R.plan_list.plan_tr_background_url+")}";
	box = document.styleSheets;//css読み出し
	if(box[0]["cssRules"][0]["cssText"]!=background_css){//すでにcssに背景画像が設定されている場合は削除
		document.styleSheets[0].deleteRule(background_css,0);
	}
	document.styleSheets[0].insertRule(background_css,0);//背景画像表示用*/

	////console.log($scope.show_payment_method);
	$scope.plan_ok=function(){
		ParamList_W['plan_list']=ParamList_R.plan_list;
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage("plan/user_plan_detail_consent.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
	};

	$scope.read_more_note = function(){
		
		if($scope.note!=undefined && $scope.note!=""){
			var length= $scope.note.length;
			if($scope.all_note==false && length>=150){
				$scope.all_note=true;
				$scope.note=ParamList_R.plan_list.note;
				$scope.all_note_title="Read less";
			}else{
				$scope.all_note=false;
				$scope.note=ParamList_R.plan_list.note.slice(0,150)+'...';
				$scope.all_note_title="Read more";
			}
			
		}
	}

	$scope.popPage = function(){
		$scope.main_navigator.popPage();
	}

	$scope.other_plan = function(){
		// //console.log($scope.user_id);
		ParamList_W['user_id'] = $scope.user_id;
		ParamList_W['plan_user_tr_profile_url'] = $scope.plan_user_tr_profile_url;
		ParamList_W['plan_user_name'] = $scope.plan_user_name;
		ParamList_W['plan_user_area'] = $scope.plan_user_area;
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage("plan/user_plan_other_plan.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
	}

	$scope.click = function(temp_profile){
		if($scope.click_lock)return;
		$scope.click_lock=true;
		ParamList_W=[];
		// ParamList_W['trainer_list']=ParamList_R['trainer_list'];
		ParamList_W['trainer_id']=temp_profile;
		// //console.log(temp_profile);
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage('Trainer/trainer_detail/trainer_detail.html', { animation : 'slide' ,onTransitionEnd : function() {
            $scope.click_lock = false;
        }});
	};

	$scope.apply = function(){
		ParamList_W=[];
		ParamList_W=ParamList_R;
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage('plan/user_plan_detail_consent.html', { animation : 'slide' ,onTransitionEnd : function() {
            $scope.click_lock = false;
        }});
	}
}]);
