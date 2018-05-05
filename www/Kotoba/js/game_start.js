module.controller('GameStartController', ['$scope', '$http', '$sce','$rootScope','SharedScopes', function($scope, $http, $sce,$rootScope,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();

	var list_question  = ParamList_R['list_question'];
	var index_question = ParamList_R['index_question'];
	var is_thefirst    = false;
	$scope.question    = list_question[index_question][0];
	$scope.show_coin   = coin;
	$scope.show_index  = index_question;
	//console.log($scope.question);

	$scope.check_correct_question = function ($index){

		$scope.question_check  = 0;
		$scope.indexs = $index;
		// set lai radio
		if ($index == 1) document.getElementById("radio11").checked = 'checked';
		if ($index == 2) document.getElementById("radio22").checked = 'checked';
		if ($index == 3) document.getElementById("radio33").checked = 'checked';
		if ($index == 4) document.getElementById("radio44").checked = 'checked';

		var click_result = $scope.question.answer_one;
		if ($index == 1) click_result = $scope.question.answer_one;
		if ($index == 2) click_result = $scope.question.answer_two;
		if ($index == 3) click_result = $scope.question.answer_there;
		if ($index == 4) click_result = $scope.question.answer_for;

		if ($scope.question.answer_correct == click_result){
			$scope.question_check = 2 ; // correct
			if (!is_thefirst){
			is_thefirst = true;
			coin = coin + $scope.question.question_coin;
			$scope.show_coin = coin;
		}
		}
		else {
			$scope.question_check = 1 ;
		}
		is_thefirst  = true;
	}
	$scope.next_question = function(){
		ParamList_W['list_question'] = list_question;
		ParamList_W['index_question'] = index_question+1;
		SharedScopes.set(ParamList_W);
		$scope.login_navigator.resetToPage("Kotoba/game_start.html", { animation : 'slide' ,onTransitionEnd : function() {
		}});
	}
	$scope.back = function(){
		$scope.login_navigator.resetToPage('Kotoba/game_setting.html', { animation : 'fade' } );
	}
	$scope.play_audio = function(question) {
        var audio = new Audio(question.media_url);
        audio.play();
    };
}]);
