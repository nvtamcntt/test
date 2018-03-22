
	var varsion="2.3.5"
	//console.log(varsion);
	monaca.getDeviceId(function(id){
		device_id = id;
	});

	//var host = "https://www.sportrai.net";

	var host = "http://localhost";
	var module = ons.bootstrap('app', ['onsen','mobiscroll-select','mobiscroll-number','mobiscroll-datetime','mobiscroll-widget','mobiscroll-numpad']);

	//var module = ons.bootstrap();
	var id = "";
	var t_id = "";
	var device_id;
	var keep_menu = "";
	var save_menu = "";
	//localStorage.removeItem("his_menu");
	//localStorage.removeItem("his_movie");
	//console.log(his_menu_list);
	var his_menu_list = [];
	var his_movie_list = [];
	//var tl_config_list = ["0","1","2","3","4","5","6","7"];
	var tl_config_list = ["0","1","2"];
	//var trtl_config_list = ["0","1","2","3","4","5","6"];
	var trtl_config_list = ["0","1","2","3","4"];
	localStorage.setItem('search_word', "");
	localStorage.setItem('search_keyword_flag', "");
	localStorage.setItem('tr_search_word', "");
	localStorage.setItem('tr_search_keyword_flag', "");
	if(localStorage.getItem("his_menu") == null) {
		//console.log("his_menu_listの中身が無い");
		localStorage.setItem('his_menu', JSON.stringify(his_menu_list));
	} else {
		his_menu_list = JSON.parse(localStorage.getItem('his_menu'));
	}
	if(localStorage.getItem("his_movie") == null) {
		console.log("his_movie_listの中身が無い");
		localStorage.setItem('his_movie', JSON.stringify(his_movie_list));
	} else {
		his_movie_list = JSON.parse(localStorage.getItem('his_movie'));
	}

	/*if(localStorage.getItem("tl_config") == null) {
		console.log("tl_configの中身が無い");
		localStorage.setItem('tl_config', JSON.stringify(tl_config_list));
	} else {
		tl_config_list = JSON.parse(localStorage.getItem('tl_config'));
	}

	if(localStorage.getItem("trtl_config") == null) {
		console.log("trtl_configの中身が無い");
		localStorage.setItem('trtl_config', JSON.stringify(trtl_config_list));
	} else {
		trtl_config_list = JSON.parse(localStorage.getItem('trtl_config'));
	}*/

	//console.log(tl_config_list);
	//console.log(trtl_config_list);

	//console.log(his_movie_list);
	//console.log(his_menu_list);

	var isRunning = false;

	//iosの場合にiso用のCSSを読み込み
	if(monaca.isIOS === true){
		var style = '<link rel="stylesheet" href="css/ios_style.css">';
		$('head link:last').after(style);
	}