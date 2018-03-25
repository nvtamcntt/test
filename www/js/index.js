
	var varsion="1.0.0"
	//console.log(varsion);
	monaca.getDeviceId(function(id){
		device_id = id;
	});

	//var host = "https://www.sportrai.net";

	var host = "http://localhost";
	var module = ons.bootstrap('app', ['onsen','mobiscroll-select','mobiscroll-number','mobiscroll-datetime','mobiscroll-widget','mobiscroll-numpad'])
  	.run(['$anchorScroll', function($anchorScroll) {
		$anchorScroll.yOffset = 100;   // always scroll by 50 extra pixels
  	}]);
	//var module = ons.bootstrap();
	var id = "";
	var t_id = "";
	var device_id;


	var isRunning = false;

	//iosの場合にiso用のCSSを読み込み
	if(monaca.isIOS === true){
		var style = '<link rel="stylesheet" href="css/ios_style.css">';
		$('head link:last').after(style);
	}