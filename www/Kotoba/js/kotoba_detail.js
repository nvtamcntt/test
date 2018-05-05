module.controller('KotobaDetailController', ['$scope', '$http', '$sce','$rootScope','SharedScopes', function($scope, $http, $sce,$rootScope,SharedScopes) {
	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();
	var kotoba = ParamList_R['kotoba'];
	var lession = ParamList_R['lession'];
	var index = ParamList_R['index'];
	// //console.log(ParamList_R['list_kotoba']);
	var list = refresh_list(ParamList_R['list_kotoba']);

	$scope.list_kotoba = list;
	// $scope.view_number = kotoba.number;
	// $scope.view_kanji = kotoba.kanji;
	// $scope.view_nghia = kotoba.nghia;
	// $scope.view_hiragana = kotoba.hiragana;
	// $scope.view_hanviet = kotoba.hanviet;
	// $scope.view_example1 = kotoba.example1;
	// $scope.view_example2 = kotoba.example2;
	// $scope.view_example3 = kotoba.example3;
	// $scope.view_n_example1 = kotoba.n_example1;
	// $scope.view_n_example2 = kotoba.n_example2;
	// $scope.view_n_example3 = kotoba.n_example3;

	// $scope.view_trainghia = xuly_tu(kotoba.trainghia);
	// $scope.view_tuongtu = xuly_tu(kotoba.tuongtu);
	// $scope.view_hopnghia = xuly_tu(kotoba.hopnghia);
	// $scope.view_lienquan = xuly_tu(kotoba.lienquan);
	// $scope.view_id = kotoba.id;
	$scope.view_lession_name = kotoba.lession_name;
	
	function refresh_list (list){
		var trainghia = [];
		var tuongtu = [];
		var hopnghia = [];
		var lienquan = [];
		if (list)
		for (var i = 0; i < list.length; i++) {
			trainghia = xuly_tu(list[i].trainghia);
			list[i].trainghia = trainghia;
			tuongtu = xuly_tu(list[i].tuongtu);
			list[i].tuongtu = tuongtu;
			hopnghia = xuly_tu(list[i].hopnghia);
			list[i].hopnghia = hopnghia;
			lienquan = xuly_tu(list[i].lienquan);
			list[i].lienquan = lienquan;
			if (list[i].hanviet)
				list[i].hanviet = list[i].hanviet.toUpperCase();
		}
		return list;
	}
	function xuly_tu(lienquan){
		var array = [];
		var tem =[];
		if (lienquan){
			if (lienquan instanceof Array){
				array = lienquan;
			}else 
			array = lienquan.split("\n");
		}
		for (var i=0; i<array.length-1; i++){
			tem[i] = array[i];
		}
		if (tem.length == 0)
			return null;
		return tem;
	}

	/*Xử lý slide view*/
	/*----------------------------------------------------------*/
	$scope.prev = function() {
	  	carousel.prev();
	};
 
	$scope.next = function() {
	  	carousel.next();
	  	// carousel.setActiveCarouselItemIndex(6);
	};
	$scope.close = function() {
		// ParamList_W['lession'] = lession;
		// SharedScopes.set(ParamList_W);
		$scope.main_navigator.popPage();
	};

	function get_position(index){
		carousel.setActiveCarouselItemIndex(index);
	}
  	angular.element(document).ready(function () {
	    get_position(index);
	});
	ons.ready(function() {
	  	var carousel = document.addEventListener('postchange', function(event) {
	    	//console.log('Changed to ' + event.activeIndex)
	  	});
	});
	/*----------------------------------------------------------*/

}]);
