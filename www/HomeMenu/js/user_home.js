module.controller('UserHomeController', ['$scope', '$filter', '$http', '$sce','$window', '$compile', '$timeout','$rootScope','$q', 'SharedScopes', function($scope, $filter, $http, $sce,$window, compile,$timeout,$rootScope,$q, SharedScopes) {
	//var s = io.connect('ws://ec2-54-64-253-194.ap-northeast-1.compute.amazonaws.com:9000/'); //ローカル
	////console.log(s);
	//var s = new WebSocket('ws://ec2-54-64-253-194.ap-northeast-1.compute.amazonaws.com:9000/');
	//$scope.testmessage="aaa";
    //接続先の指定
	////console.log(koyomi.getHolidays(2017));

    /*var url = "ws://ec2-54-64-253-194.ap-northeast-1.compute.amazonaws.com:9000/"; //websocketサーバのURL。

	var socket = io.connect(url);
    socket.on('connect', function() {
        socket.on('text',function(text){
        	//console.log("aaa");
            alert(text);
        });
    });*/

    //接続
	/*var socket = io.connect(url);
	//console.log(socket);
    socket.on('connect', function(socket) {
        //console.log('connect!');
        var data = { "a": { "b": { "c": "d" }}};
		socket.json.emit('msg push', data);
    });
// サーバーからのテキストを受けてコンソールに表示
    socket.on('text',function(text){
        //console.log(text); // 'socket.io OK!!'がコンソールに表示される
    });*/


    //angular.element(document).ready(function () {
		// ソケット通信テスト
	//$scope.soketTest();
    //});
    // ソケット通信テスト
    //$scope.soketTest = function() {
        //var url = "ws://【さくらVPSのドメインまたはIP】:3000/"; //websocketサーバのURL。

	//接続
        //var socket = io.connect(url);
        //socket.on('connect', function() {
        //    //console.log('connect!');
        //});
	// サーバーからのテキストを受けてコンソールに表示
        //socket.on('text',function(text){
        //    //console.log(text); // 'socket.io OK!!'がコンソールに表示される
    	//});
    //};

	/*s.on("connect", function () {
		//console.log("aaa");
	});  // 接続時
	s.on("disconnect", function (client) {
		//console.log(client);
		//console.log("aaa");
	});  // 切断時
	s.on("S_to_C_message", function (data) {
		//console.log(data);
		//console.log("aaa");
		addMessage(data.value);
	});
	s.emit("C_to_S_message", {value:msg}); //サーバへ送信

	function addMessage (value,color,size) {
		//console.log(value);
		var msg = value.replace( /[!@$%<>'"&|]/g, '' ); //タグ記号とかいくつか削除
		$scope.msg_list=value;
	};
	$scope.sendMessage=function() {
		//console.log("sendMessage");
		var msg = $scope.testmessage; //取得
		//console.log(msg);
		s.on("connect", function () {
			//console.log("aaa");
		});  // 接続時

		$scope.testmessage="";

	};

	$scope.sendBroadcast=function() {
		//console.log("sendBroadcast");
		var msg = $scope.testmessage; //取得
		//console.log(msg);
		//$("#message").val(""); //空白にする
		$scope.testmessage="";
		socket.emit("C_to_S_broadcast", {value:msg}); // サーバへ送信
	};*/






	var ParamList_R = [];
	var ParamList_W = [];
	ParamList_R = SharedScopes.get();
	SharedScopes.delete();

	//体重グラフ
	var timeFormat = 'MM/DD';
	var Graph_start_point_date;
	var weight_data;
	var Latest_input_date;
	var weight_data_carousel;
	var animation_flag={animateScale:true};//最初だけアニメーション有り
	var view="month";

	var weight_graph_data = [];
	var weight_graph_max_min = [];
	var body_fat_percentage_graph_data = [];
	var body_fat_percentage_graph_max_min = [];
	var bmi_data = [];
	var bmi_max_min = [];
	var height=0;

	var ParamList_W = [];
	// 表示前
	var now = new Date();
	var maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	var all_data=[];
	var data = [];
	var r1;
	var r2;
	var r4;
	var r5;
	var r6;
	if($scope.profile_url==undefined)$scope.profile_url="images/prof3.png";

	weight_load();

	////console.log(host);

	function weight_load (){
		r1=$http({
			method: 'POST',
			url: host + '/php/select/weight_list.php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({ session_id: localStorage.getItem('session_id'), user_id: id, session_user_id: id })
		})
		.success(function(data, status, headers, config) {
			////console.log(data);
			height = data[1][0].height;
	        if(height==0){//身長未入力時はBMIを手入力にする
	        	$scope.auto_input_weight = false;
	        	$scope.input_weight = true;
	        }else{
	        	$scope.auto_input_weight = true;
	        	$scope.input_weight = false;
	        }

	        weight_data=data;
	        if(data[0]==null){
	        	$scope.weight_graph=true;
	        	return;
	        }
			for (var i = 0; i < weight_data[0].length; i++) {//グラフの実績値を入力
				weight_graph_data.push({ x: new Date(weight_data[0][i].date), y: weight_data[0][i].weight });
				weight_graph_max_min.push(weight_data[0][i].weight);

				if(weight_data[0][i].body_fat_percentage!="0"){
					body_fat_percentage_graph_data.push({ x: new Date(weight_data[0][i].date), y: weight_data[0][i].body_fat_percentage });
					body_fat_percentage_graph_max_min.push(weight_data[0][i].body_fat_percentage);
				}
				if(weight_data[0][i].bmi!="0"){
					bmi_data.push({ x: new Date(weight_data[0][i].date), y: weight_data[0][i].bmi });
					bmi_max_min.push(weight_data[0][i].bmi);
				}

			}
			date_label=data[0].length-1;//カルーセルで表示しているデータの座標
			$scope.weight_data_carousel =data[0];//カルーセルデータ
			Graph_Create(view, new Date(),data);//グラフ出力(初回のみ)
			animation_flag=false;

			////console.log(weight_data[0][date_label]);
			////console.log(weight_data[1][0]);

			$scope.date=new Date(weight_data[0][date_label].date);

			$scope.weight=weight_data[0][date_label].weight==null ? 0 : weight_data[0][date_label].weight;
			$scope.bmi=weight_data[0][date_label].bmi==null ? 0 : weight_data[0][date_label].bmi;
			$scope.body_fat_percentage=weight_data[0][date_label].body_fat_percentage==null ? 0 : weight_data[0][date_label].body_fat_percentage;


			$scope.goal_bmi=weight_data[1][0].goal_bmi==null ? 0 : weight_data[1][0].goal_bmi;
			$scope.goal_body_fat_percentage=weight_data[1][0].goal_body_fat_percentage==null ? 0 : weight_data[1][0].goal_body_fat_percentage;
			$scope.goal_weight=weight_data[1][0].goal_weight==null ? 0 : weight_data[1][0].goal_weight;

			$scope.initial_bmi=weight_data[1][0].initial_bmi==null ? 0 : weight_data[1][0].initial_bmi;
			$scope.initial_body_fat_percentage=weight_data[1][0].initial_body_fat_percentage==null ? 0 : weight_data[1][0].initial_body_fat_percentage;
			$scope.initial_weight=weight_data[1][0].initial_weight==null ? 0 : weight_data[1][0].initial_weight;

			$scope.goal_bmi_top=weight_data[1][0].goal_bmi-weight_data[0][date_label].bmi;
			$scope.goal_body_fat_percentage_top=weight_data[1][0].goal_body_fat_percentage-weight_data[0][date_label].body_fat_percentage;
			$scope.goal_weight_top=weight_data[1][0].goal_weight - weight_data[0][date_label].weight;

			$scope.initial_bmi_top=weight_data[0][date_label].bmi - weight_data[1][0].initial_bmi;
			$scope.initial_body_fat_percentage_top=weight_data[0][date_label].body_fat_percentage - weight_data[1][0].initial_body_fat_percentage;
			$scope.initial_weight_top=weight_data[0][date_label].weight - weight_data[1][0].initial_weight;


			////console.log($scope.initial_weight_top);
			$scope.weight_list_item=true;
			$scope.body_fat_percentage_list_item=false;
			$scope.bmi_list_item=false;

			$scope.weight_list_show=true;
			$scope.weight_input_show=false;


			if($scope.goal_weight_top<0){
				$scope.goal_weight_up_down=true;
			}else{
				$scope.goal_weight_up_down=false;
			}
			if($scope.initial_weight_top<0){
				$scope.initial_weight_up_down=true;
			}else{
				$scope.initial_weight_up_down=false;
			}
			if($scope.goal_body_fat_percentage_top<0){
				$scope.goal_body_fat_percentage_up_down=true;
			}else{
				$scope.goal_body_fat_percentage_up_down=false;
			}
			if($scope.initial_body_fat_percentaget_top<0){
				$scope.initial_body_fat_percentage_up_down=true;
			}else{
				$scope.initial_body_fat_percentage_up_down=false;
			}
			if($scope.goal_bmi_top<0){
				$scope.goal_bmi_up_down=true;
			}else{
				$scope.goal_bmi_up_down=false;
			}
			if($scope.initial_bmi_top<0){
				$scope.initial_bmi_up_down=true;
			}else{
				$scope.initial_bmi_up_down=false;
			}




			$scope.weight_list_form_class="c_umain";
			$scope.weight_input_form_class="c_gray";

			$scope.week_show_class="b_white c_black";
			$scope.month_show_class="c_white";
			$scope.custom_show_class="c_white";

			Graph_Carousel.on('postchange', function(event2){//カルーセルを動かすたびに動く設定
				//グラフで表示しているデータの座標再取得
				$timeout(function(){
					if(event2.activeIndex==0){
						$scope.weight_list_item=true;
						$scope.body_fat_percentage_list_item=false;
						$scope.bmi_list_item=false;
					}
					else if(event2.activeIndex==1){
						$scope.body_fat_percentage_list_item=true;
						$scope.weight_list_item=false;
						$scope.bmi_list_item=false;
					}
					else if(event2.activeIndex==2){
						$scope.bmi_list_item=true;
						$scope.body_fat_percentage_list_item=false;
						$scope.weight_list_item=false;
					}
				});

			});

			/*setImmediate(function() {//カルーセル描画後
				myCarousel.refresh();//カルーセルリフレッシュ
				myCarousel.last();//カルーセル初期位置をラストにもっていく
				myCarousel.on('postchange', function(event){//カルーセルを動かすたびに動く設定
					date_label=event.activeIndex;//カルーセルで表示しているデータの座標再取得
					key = new Date(weight_data[0][date_label].date);//カルーセルで表示しているデータの座標から日付取得
					if(!(Graph_start_point_date < key && key < Latest_input_date)){//グラフ表示範囲内にカルーセルで表示されている日付はあるか
						Latest_input_date=key;//表示されていなければ、表示範囲を変更する
					}
					Graph_Create(view, Latest_input_date,weight_data);//グラフ再描画
				});
			});*/
		})
.error(function(data, status, headers, config) {
	$scope.message = 'failed';
});
}

function Graph_Create(view, view_date,weight_data,view_start_date) {
		//animation_flag;
		Latest_input_date = view_date;//グラフ表示一番右の日付
		if(view=="custom"){
			Graph_start_point_date = view_start_date;
			temp=Latest_input_date-Graph_start_point_date;
			// console.log(temp);
			date_unit="day";//下のラベルの表示
			if((7 * 1000 * 60 * 60 * 24 * 2)<temp){
				date_unit="week";//下のラベルの表示
			}
			if((31 * 1000 * 60 * 60 * 24 * 2)<temp){
				date_unit="month";//下のラベルの表示
			}
			////console.log(date_unit);
		}else if(view=="month"){
			date_unit="week";//下のラベルの表示
			Graph_start_point_date = new Date(Latest_input_date.getTime() - (31 * 1000 * 60 * 60 * 24));//グラフ表示一番左の日付(31日前)
		}else{
			date_unit="day";//下のラベルの表示
			Graph_start_point_date = new Date(Latest_input_date.getTime() - (7 * 1000 * 60 * 60 * 24));//グラフ表示一番左の日付(7日前)
		}

		Latest_input_date=Latest_input_date.getFullYear()+"/"+(Latest_input_date.getMonth()+1)+"/"+Latest_input_date.getDate()+" 23:59";
		Graph_start_point_date=Graph_start_point_date.getFullYear()+"/"+(Graph_start_point_date.getMonth()+1)+"/"+Graph_start_point_date.getDate()+" 00:00";

		Graph_Item(
		 weight_graph_max_min,//上下表示調整用
		 weight_data[1][0].goal_weight,//目標値(単位も制御)
		 weight_graph_data,//実績値
		 Latest_input_date,//グラフ右の日付
		 Graph_start_point_date,//グラフ左の日付
		 date_unit,//月表示か週表示か
		 "canvas_weight"//体重表示(単位も制御)
		 );

		Graph_Item(
			body_fat_percentage_graph_max_min,
			weight_data[1][0].goal_body_fat_percentage,
			body_fat_percentage_graph_data,
			Latest_input_date,
			Graph_start_point_date,
			date_unit,
		 "canvas_body_fat_percentage");//体脂肪率

		Graph_Item(
			bmi_max_min,
			weight_data[1][0].goal_bmi,
			bmi_data,
			Latest_input_date,
			Graph_start_point_date,
			date_unit,
		 "canvas_bmi");//BMI

	}

	function Graph_Item(graph_max_min, goal_item,graph_item_data,last_date,start_date,date_unit,canvas_var) {
		max_item = Math.max.apply(null, graph_max_min) + 2;//グラフ実績値最上値
		min_item = Math.min.apply(null, graph_max_min) - 2;//グラフ実績値最低値

		min_item = min_item==Infinity ? -2 : min_item;
		max_item = max_item==-Infinity ? 2 : max_item;

		//グラフ最上値最低値を目的値と比較
		if(goal_item==0){
			goal_item=null;//目標値未入力時目標ラインを出さないための処理
		}else{
			if (max_item < parseFloat(goal_item) + 2  && goal_item!=null) max_item = parseFloat(goal_item) + 2;
			if (min_item > goal_item - 2 && goal_item!=null) min_item = goal_item - 2;
		}

		if(canvas_var=="canvas_weight"){
			canvas_unit="kg";
		}else if(canvas_var=="canvas_body_fat_percentage"){
			canvas_unit="%";
		}else{
			canvas_unit="";
		}
		Chart.defaults.global.tooltips.displayColors = false;
		graph_item_data = $filter('orderBy')(graph_item_data, '-x', 'true');
		for(var k=0;k<graph_item_data.length;k++){
			graph_item_data[k].x = moment(graph_item_data[k].x).format("YYYY/MM/DD");
		}
        // console.log(graph_item_data);
        for(var i=0;i<graph_item_data.length-1;i++){
        	for(var j=i+1;j<graph_item_data.length;j++){
        		if(moment(graph_item_data[i].x).format("YYYY-MM-DD") == moment(graph_item_data[j].x).format("YYYY-MM-DD")){
        			graph_item_data.splice(i,1);
        		}
        	}
        }
        for(var i=0;i<graph_item_data.length-1;i++){
        	for(var j=i+1;j<graph_item_data.length;j++){
        		if(moment(graph_item_data[i].x).format("YYYY-MM-DD") == moment(graph_item_data[j].x).format("YYYY-MM-DD")){
        			graph_item_data.splice(i,1);
        		}
        	}
        }
        for(var i=0;i<graph_item_data.length-1;i++){
        	for(var j=i+1;j<graph_item_data.length;j++){
        		if(moment(graph_item_data[i].x).format("YYYY-MM-DD") == moment(graph_item_data[j].x).format("YYYY-MM-DD")){
        			graph_item_data.splice(i,1);
        		}
        	}
        }

        var config = {
        	type: 'line',

        	data: {
        		datasets: [{
        			label: "実績値",
        			borderColor: "#fff",
        			borderWidth: "1",
        			fill: false,
        			lineTension: 0,
        			pointRadius: 2,
        			data: graph_item_data,
        		}, {
        			label: "目標値",
        			borderColor: "#00A0EA",
        			fill: false,
        			lineTension: 0,
        			pointRadius: 0,
        			data: [{ x: last_date, y: goal_item }, { x: start_date, y: goal_item }],
        		}, {
        			label: "下限値",
        			borderColor: "rgba(220,220,220,0.75)",
        			fill: false,
        			pointRadius: 0,
					}, /*{
						label: "縦値",
						borderColor: "rgba(220,220,0,0.75)",
						fill: false,
						// Skip first and last points
						pointRadius: 0,
						data: [{ x:weight_data[0][date_label].date, y: max_item }, { x:weight_data[0][date_label].date, y: min_item }],
					},*/
					]
				},
				options: {
					animation : animation_flag,
					defaultFontColor: "#fff",

					legend: {
						display: false,
						labels: {
							fontColor: 'rgb(255, 255, 255)'
						}
					},
					responsive: false,
					title: {
						display: false,
						text: 'Chart.js Line Chart - Skip Points'
					},
					tooltips: {
						display: false,
						mode: 'index',
						callbacks: {
							label: function(tooltipItems, graph_item_data) {
								return graph_item_data.datasets[tooltipItems.datasetIndex].label +': ' + tooltipItems.yLabel + ' Kg';
							}
						}
					//backgroundColor: 'rgba（220,0,0,0.8）',
				},
				hover: {
					display: false,
					mode: 'index'
				},
				scales: {
					xAxes: [{
						display: true,
						position: 'bottom',
						format: "YYYY-MM-DD",
						type: "time",
						time: {
							unit: date_unit,
							displayFormats: {
								month: 'M' + "/" + 'D',
								week: 'M' + "/" + 'D',
								day: 'M' + "/" + 'D'
							},
							min: start_date,
							max: last_date,
						},
						ticks: {
							fontColor: 'rgb(255, 255, 255)',
						},
						gridLines: {
							display: false,
							color: "rgba(220,220,220,0)", // only want the grid lines for one axis to show up
						},
						scaleLabel: {
							display: false,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						fontColor: 'rgb(255, 255, 255)',
						scaleLabel: {
							display: false,
							labelString: 'Value'
						},
						gridLines: {
							display: true,
							color: 'rgba(220,220,220,0.25)', // only want the grid lines for one axis to show up
							drawBorder: true,
						},
						ticks: {
							suggestedMin: min_item,
							fontColor: 'rgb(255, 255, 255)',
							suggestedMax: max_item,
							display: true,
							position: 'right',
							userCallback: function(value, index, values) {
								return value.toString() + canvas_unit;
							}
						}
					}]
				}
			}
		};

		var canvas = document.getElementById(canvas_var);
		canvas.width = $(window).width()*0.85;
		canvas.height = $(window).width()*0.85;
		var ctx = canvas.getContext("2d");
		window.myLine = new Chart(ctx, config);
	}


	$scope.weight_color = function(temp_weight_list,icon_flag,goal){
		if(goal){
			if((temp_weight_list.weight-$scope.goal_weight)<0){
				if(icon_flag){
					return "icon-icon-22 c_red";
				}else{
					return "c_red";
				}
			}else{
				if(icon_flag){
					return "icon-icon-23 c_blue";
				}else{
					return "c_blue";
				}
			}
		}else{
			if(($scope.initial_weight-temp_weight_list.weight)<0){
				if(icon_flag){
					return "icon-icon-22 c_red";
				}else{
					return "c_red";
				}
			}else{
				if(icon_flag){
					return "icon-icon-23 c_blue";
				}else{
					return "c_blue";
				}
			}
		}
	};


	$scope.GraphcarouselNext = function() {
		Graph_Carousel.next();
	};

	$scope.GraphcarouselPrev = function() {
		Graph_Carousel.prev();
	};

	// マイトレーナー

	var TrainerId=[];
	var profile_list=[];
	var trainer_list=[];

	mytrainer_load();

	function mytrainer_load () {
		r2=$http({
			method: 'POST',
			url: host+'/php/select/trainer_list.php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({user_id: id ,session_id: localStorage.getItem('session_id')})
		})
		.success(function(data, status, headers, config) {
			////console.log(data);
			trainer_list=data;
			$scope.trainer_list = data;

			var trainer_view_list=[];//表示されるリスト
			temporary_count=0;
			error_flag=false;
			if (trainer_list != undefined) {
				for(i=0;i<trainer_list.length;i++){
					////console.log(trainer_list[i]);
					if(trainer_list[i].match_flag.indexOf("2") != -1 ){
						//if(trainer_list[i].status=="active" || trainer_list[i].status=="trialing" || trainer_list[i].status==null){
							trainer_view_list[temporary_count]=trainer_list[i];
							temporary_count++;
							if(trainer_list[i].dialog_show_flag==0){
								$http({
									method: 'POST',
									url: host+'/php/insert/trainer_match_dialog_show_flag_on.php',
									headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
									data: $.param({session_id: localStorage.getItem('session_id'),user_id: trainer_list[i].trainer_id, flag: "2",session_user_id:id})
								})
								.success(function(data, status, headers, config) {
								////console.log(data);
							});
								ons.notification.alert({
									message: trainer_list[i].name+'さんへのパートナー申請が承認されました。',
									title: 'アラートメッセージ',
									buttonLabel: 'OK',
								animation: 'default', // もしくは'none'
								callback: function() {

								}
							});
							//}
						}else{
							error_flag=true;
						}
					}
				}
			}
			if(error_flag){
				// ons.notification.alert({
				// 	message: 'クレジットカードエラーにつき表示されていないトレーナーがいます。',
				// 	title: 'アラートメッセージ',
				// 	buttonLabel: 'OK',
				// 	animation: 'default', // もしくは'none'
				// 	callback: function() {
				// 	// ボタンがタップされた
				// 	}
				// });
				//$scope.card_error_flag=true;
			}


			update(trainer_view_list);
		})
		.error(function (data, status, headers, config) {
			$scope.message = 'failed';
		});
	}

	function update(t_list){
		////console.log(t_list);
		for (var i =0; i<t_list.length; i++)
		{
			var obj = {};
			//配列をobj化
			for(key in t_list[i]){
				obj[key] = t_list[i][key];
			}

			if(obj.profile_url!=null){
				obj["profile_url"] =  obj.profile_url;
			}else{
				obj["profile_url"] =  "images/non_image.png";
			}
			if(obj.partner_count==null){
				obj.partner_count=0;
			}else{
				obj.partner_count = Number(obj.partner_count);
			}
			obj["name"] = String(obj.name);
			obj["text"] = obj.profile_text;

			if(obj.match_flag==2){
				obj["p_f"] = "b_umain";
			}else if(obj.match_flag==1){
				obj["p_f"] = "b_umain shadow";
			}else {
				obj["p_f"] = "b_gray";
			}
			obj["l_f"] = t_list[i].favo_id!=null ? "b_umain" : "b_gray";
			obj["id"] = t_list[i].trainer_id;
			TrainerId[i] = t_list[i].trainer_id;

			profile_list.unshift(obj);
		}
		////console.log("profile",profile_list);
		$scope.profile_list=profile_list;
		var i = 0;
		$timeout(function () {
			$("ons-carousel-item.home_mytrainer").each( function() {
				var height = (i*70)+"px";
				$(this).css({
					width: "70px",
					position: "absolute",
					height: "auto",
					top: "0px",
					visibility: "visible",
					left: height,
					transition: "none",
					transform: "translate3d(0px, 0px, 0px)",
				});
				i++;
			});
		});
	}

	//マイトレ履歴
	///mytrain_load();

	/*function mytrain_load (){
	    r3=$http({
	        method: 'POST',
	        url: host+'/php/select/training_list.php',
	        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
	        data: $.param({session_id: localStorage.getItem('session_id'),search: 'history', user_id: id})
	    })
	    .success(function(data, status, headers, config) {
	        //console.log(data);
	        MyTrainList = [];
	        if(data!=null){
		        for (var i =0; i<data.length; i++) {
		        	if(data[i].trainer_comment.length>=1 ){
			            var MyTrain = [];
			            MyTrain.id = data[i].id;
			            MyTrain.profile_url = data[i].profile_url;
			            MyTrain.menu = data[i].title;
			            MyTrain.name = data[i].name;
			            MyTrain.end_date = data[i].date;
			            MyTrain.movie_count = data[i].movie_count;
			            if(data[i].thumb != "") {
			                MyTrain.thumb = data[i].thumb;
			            } else {
			                MyTrain.thumb = 'images/non_image.png';
			            }
		                var set_counta = 0;
		                MyTrain.menu_set = [];
		                for(var l =0 ;l<data[i].menu_set.length;l++){
		                	if(set_counta < 4){
		                		MyTrain.menu_set[l] = data[i].menu_set[l];
		                		MyTrain.menu_set[l].title = !data[i].menu_set[l].movie_title ?data[i].menu_set[l].origin_title:data[i].menu_set[l].movie_title;
		            	    	set_counta++;
		            	    }
		                }
			            MyTrainList.push(MyTrain);
		            }
		        }
	    	}
	        $scope.mytrain_list = MyTrainList;

			var i = 0;
	        $timeout(function () {
	        	$("ons-carousel-item.home_mytrain").each( function() {
	        		var height = (i*245)+"px";
	        		$(this).css({
	        			width: "245px",
	        			position: "absolute",
	        			height: "auto",
	        			top: "0px",
	        			visibility: "visible",
	        			left: height,
	        			transition: "none",
	        			transform: "translate3d(0px, 0px, 0px)",
	        		});
	        		i++;
	        	});
	        });
	    })
	    .error(function (data, status, headers, config) {
	        $scope.message = 'failed';
	    });
	}*/


	ons.ready(function() {
		ons.createDialog('tutoria_dialog.html', {parentScope: $scope}).then(function(dialog5) {
		});
	});

	//食事一覧
	food_load();

	function food_load (){
		r4=$http({
			method: 'POST',
				url: host+'/php/select/new_user_tl.php', // 適宜変更する
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({session_id: localStorage.getItem('session_id'), user_id: id ,session_user_id:id,varsion:varsion})
			})
		.success(function(data, status, headers, config) {
			////console.log(varsion);
			////console.log(data);
			if(data=="varsion_check_ng"){
				ons.notification.alert({
					message: 'アプリのアップデートが行われましたストアにてアップデートをお願いします。',
					title: 'アップデート通知',
					buttonLabel: 'OK',
					animation: 'default', // もしくは'none'
					callback: function() {
						if(monaca.isAndroid === true){
							$window.open("https://play.google.com/store/apps/details?id=com.sportrai&hl=ja","_system");
						}else{
							setTimeout(function() {
								$window.open("https://itunes.apple.com/jp/app/supotore/id1188222609?mt=8","_system");
							}, 0);
						}
						main_navigator.resetToPage('userTL/timeline.html');
					}
				});
				return;
			}else if(data=="session_ng"){
				main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
				return;
			}
			if(data[1].tutoria_flag==0) tutoria_dialog.show();


			localStorage.setItem('profile_url',data[1].profile_url);
			localStorage.setItem('name',data[1].name);

			$scope.profile_url=data[1].profile_url;
			output_list(data);

			//$timeout(function () {

			//});

		})
		.error(function(data, status, headers, config) {
			$scope.message = 'failed';
			////console.log(data);
			////console.log(status);
			////console.log(config);
		});
	}


	function output_list(data){
		all_data=data;
		$scope.TL=[];
		$scope.food_tl=[];
		weight_date=[];
		$scope.mytrain_list = [];
		angular.forEach(data[0], function(temp) {
			if(temp.tl_id_key=="food"){
				//総カロリー
				////console.log(temp);
				counta=0;
				angular.forEach(temp.meal_trainer_comment, function(temp2) {
					if(temp2.comment_flag=="1" ||( temp2.meal_trainer_comment_res_flag=="0" && temp2.meal_trainer_comment_res_user_id!=id)) counta++;
				});
				temp.comment=counta;
				//$scope.comment_tl.push(temp);
				if(counta>=1 ){
					var cal = 0;
					for(var i =0;i<temp.meal_item.length;i++){
						cal = cal + Number(temp.meal_item[i].calorie);
					}
					temp.cal = cal;
					//コメント件数
					//temp.comment = temp.meal_trainer_comment.length;
					var food_img = !temp.image[0] ? 'images/non_image.png':temp.image[0];
					temp.top_image = {
						"width": "105px",
						"height": "80px",
						"background": "url("+food_img+")",
						"background-size": "cover",
						"background-repeat": "no-repeat",
						"background-position": "center"
					}
					$scope.food_tl.push(temp);
				}
			}else if(temp.tl_id_key=="menu_e") {
		        //for (var i =0; i<data.length; i++) {
		        	counta=0;
		        ////console.log(temp);
		        angular.forEach(temp.trainer_comment, function(temp2) {
		        	if(temp2.comment_flag=="1" ||( temp2.run_training_trainer_comment_res_flag=="0" && temp2.run_training_trainer_comment_res_user_id!=id)) counta++;
		        });
		        temp.comment=counta;
				//$scope.comment_tl.push(temp);
				if(counta>=1 ){
		        ////console.log(temp);
		        	//if(temp.trainer_comment.length>=1 ){
		        		var MyTrain = [];
		        		MyTrain.id = temp.id;
		        		MyTrain.profile_url = temp.profile_url;
		        		MyTrain.menu = temp.title;
		        		MyTrain.name = temp.name;
		        		MyTrain.end_date = temp.date;
		        		MyTrain.movie_count = temp.movie_count;
		        		MyTrain.counta = counta;
		        		if(temp.thumb != "") {
		        			MyTrain.thumb = temp.thumb;
		        		} else {
		        			MyTrain.thumb = 'images/non_image.png';
		        		}
		        		var set_counta = 0;
		        		MyTrain.menu_set = [];
		        		for(var l =0 ;l<temp.menu_set.length;l++){
		        			if(set_counta < 4){
		        				MyTrain.menu_set[l] = temp.menu_set[l];
		        				MyTrain.menu_set[l].title = !temp.menu_set[l].movie_title ?temp.menu_set[l].origin_title:temp.menu_set[l].movie_title;
		        				set_counta++;
		        			}
		        		}
		        		$scope.mytrain_list.push(MyTrain);
	            //}
		            //}
		        }
		    }
		});

		////console.log($scope.food_tl);
		////console.log($scope.mytrain_list);
		////console.log($scope.food_tl);

		$timeout(function () {
			var i = 0;
			$("ons-carousel-item.home_mytrain").each( function() {
				var height = (i*245)+"px";
				$(this).css({
					width: "245px",
					position: "absolute",
					height: "auto",
					top: "0px",
					visibility: "visible",
					left: height,
					transition: "none",
					transform: "translate3d(0px, 0px, 0px)",
				});
				i++;
			});
			var i = 0;
			$("ons-carousel-item.home_food").each( function() {
				var height = (i*135)+"px";
				$(this).css({
					width: "135px",
					position: "absolute",
					height: "auto",
					top: "0px",
					visibility: "visible",
					left: height,
					transition: "none",
					transform: "translate3d(0px, 0px, 0px)",
				});
				i++;
			});
		});
	}




	//食事グラフ　（1週間)
	var carbohydrate_balance = 0.50; //炭水化物バランス
	var lipid_balance = 0.30; //脂質バランス
	var protein_balance = 0.20; //タンパク質バランス

	var carbohydrate_basis = 0; //炭水化物ベース
	var lipid_basis = 0; //脂質ベース
	var protein_basis = 0; //タンパク質ベース

	var fu_sex; //性別
	var fu_day; //年齢
	var fu_pal; //PAL（運動レベル）

	var calorie = 0; //表示用カロリー
	var carbohydrate = 0; //表示用炭水化物
	var lipid = 0; //表示用脂質
	var protein = 0; //表示用タンパク質
	var nutrients_list = [];//グラフや表の出力用リスト
	var nutrients_list2 = [];//グラフや表の出力用リスト
	var count = 0;
	var cal_graph_data = [];//カロリーグラフ
	var data_list=[];
	var data_comment;
	var view_flag="month";

	var cal = {
		"man": {
			"PAL1": { "0_5m": 550, "6_8m": 650, "9_11m": 700, "1_2y": 950, "3_5y": 1.45, "6_7y": 1350, "8_9y": 1600, "10_11y": 1950, "12_14y": 2300, "15_17y": 2500, "18_29y": 2300, "30_49y": 2300, "50_69y": 2100, "70y": 1850 },
			"PAL2": { "0_5m": 550, "6_8m": 650, "9_11m": 700, "1_2y": 950, "3_5y": 1300, "6_7y": 1550, "8_9y": 1850, "10_11y": 2250, "12_14y": 2600, "15_17y": 2850, "18_29y": 2650, "30_49y": 2650, "50_69y": 2450, "70y": 2200 },
			"PAL3": { "0_5m": 550, "6_8m": 650, "9_11m": 700, "1_2y": 950, "3_5y": 1300, "6_7y": 1750, "8_9y": 2100, "10_11y": 2500, "12_14y": 2900, "15_17y": 3150, "18_29y": 3050, "30_49y": 3050, "50_69y": 2800, "70y": 2500 }
		},
		"woman": {
			"PAL1": { "0_5m": 500, "6_8m": 600, "9_11m": 650, "1_2y": 900, "3_5y": 1250, "6_7y": 1250, "8_9y": 1500, "10_11y": 1850, "12_14y": 2150, "15_17y": 2050, "18_29y": 1650, "30_49y": 1750, "50_69y": 1650, "70y": 1500 },
			"PAL2": { "0_5m": 500, "6_8m": 600, "9_11m": 650, "1_2y": 900, "3_5y": 1250, "6_7y": 1450, "8_9y": 1700, "10_11y": 2100, "12_14y": 2400, "15_17y": 2300, "18_29y": 1950, "30_49y": 2000, "50_69y": 1900, "70y": 1750 },
			"PAL3": { "0_5m": 500, "6_8m": 600, "9_11m": 650, "1_2y": 900, "3_5y": 1250, "6_7y": 1650, "8_9y": 1900, "10_11y": 2350, "12_14y": 2700, "15_17y": 2550, "18_29y": 2200, "30_49y": 2300, "50_69y": 2200, "70y": 2000 }
		}
		}; //厚生労働省版、目安カロリー出すやつ

		var PAL_magnification = {
			"PAL1": { "1_2y": 1.35, "3_5y": 1.45, "6_7y": 1.35, "8_9y": 1.40, "10_11y": 1.45, "12_14y": 1.45, "15_17y": 1.55, "18_29y": 1.50, "30_49y": 1.50, "50_69y": 1.50, "70y": 1.45 },
			"PAL2": { "1_2y": 1.35, "3_5y": 1.45, "6_7y": 1.55, "8_9y": 1.60, "10_11y": 1.65, "12_14y": 1.65, "15_17y": 1.75, "18_29y": 1.75, "30_49y": 1.75, "50_69y": 1.75, "70y": 1.75 },
			"PAL3": { "1_2y": 1.35, "3_5y": 1.45, "6_7y": 1.75, "8_9y": 1.80, "10_11y": 1.85, "12_14y": 1.85, "15_17y": 1.95, "18_29y": 2.00, "30_49y": 2.00, "50_69y": 2.00, "70y": 1.95 }
		}; //身体活動レベルからの倍率

		r5=$http({
			method: 'POST',
				url: host + '/php/select/meal_list.php', // 適宜変更する
				headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
				data: $.param({ session_id: localStorage.getItem('session_id'), user_id: id, session_user_id: id })
			})
		.success(function(data, status, headers, config) {
			data_list=data[0];
				////console.log(data);
	//*****カロリーから炭水化物、脂質、タンパク質の適正量を出すfunction*****
	function graph_balance(fu_sex, fu_pal, fu_day) {
		if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 1) { //0歳については厚生労働省基準で
			cal_basis = cal[fu_sex][fu_pal][fu_day];
		} else {
			if (fu_sex == "man") {
				sex = 0.5473 * 1;
			} else {
				sex = 0.5473 * 2;
			}
			cal_basis = Math.round(((0.1238 + (0.0481 * parseFloat(data[1][0].now_weight)) + (0.0234 * parseFloat(data[1][0].height)) - (0.0138 * 20) - sex) * 1000 / 4.186) * PAL_magnification[fu_pal][fu_day] * 10) / 10;
		}
		carbohydrate_basis = Math.round(cal_basis * carbohydrate_balance * 10 / 4) / 10;
		lipid_basis = Math.round(cal_basis * lipid_balance * 10 / 9) / 10;
		protein_basis = Math.round(cal_basis * protein_balance * 10 / 4) / 10;
	}

	//*****カロリーから炭水化物、脂質、タンパク質の適正量を出すための処理*****
		//*****性別*****
		if (data[1][0].sex == "男") {
			fu_sex = "man";
		} else {
			fu_sex = "woman";
		}

		//*****年齢*****
		if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 0.5) {
			fu_day = "0_5m";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 0.75) {
			fu_day = "6_8m";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 1) {
			fu_day = "9_11m";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 3) {
			fu_day = "1_2y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 6) {
			fu_day = "3_5y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 8) {
			fu_day = "6_7y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 10) {
			fu_day = "8_9y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 12) {
			fu_day = "10_11y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 15) {
			fu_day = "12_14y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 18) {
			fu_day = "15_17y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 30) {
			fu_day = "18_29y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 50) {
			fu_day = "30_49y";
		} else if ((new Date().getTime() - new Date(data[1][0].birthday).getTime()) / (1000 * 60 * 60 * 24 * 365) < 70) {
			fu_day = "50_69y";
		} else {
			fu_day = "70y";
		}

		//*****PAL(運動レベル)*****
		if (data[1][0].PAL == "0") {
			fu_pal = "PAL1";
		} else if (data[1][0].PAL == "1") {
			fu_pal = "PAL2";
		} else {
			fu_pal = "PAL3";
		}

		//*****ファンクションへ*****
		graph_balance(fu_sex, fu_pal, fu_day);

	//*****グラフ表示用に取得データ変更*****
	old_ssdate=new Date("1970/01/01");
	t_calorie=0;
	counta=0;

	for (var i = 0; i < data[0].length; i++) {
		if(data[0][i].meal_item.length!=0){
			if (data[0][i].meal_item[0].calorie != null) {
				for (var j = 0; j < data[0][i].meal_item.length; j++) {
					calorie += parseFloat(data[0][i].meal_item[j].calorie);
					carbohydrate += parseFloat(data[0][i].meal_item[j].carbohydrate);
					lipid += parseFloat(data[0][i].meal_item[j].lipid);
					protein += parseFloat(data[0][i].meal_item[j].protein);
				}
				ssdate=new Date(new Date(new Date(data[0][i].date).toLocaleDateString()).getTime());
							nutrients_list[count] = [ssdate, calorie, carbohydrate, lipid, protein];//レーザーチャート用データ

							if(old_ssdate.getTime()!=ssdate.getTime() && counta!=0){//グラフの各データを一日ごとにするための処理
								cal_graph_data.push({ x: old_ssdate, y: t_calorie });//グラフ用データ
								t_calorie=0;
							}else{
								counta++;
							}
							t_calorie+=calorie;
							old_ssdate=ssdate;

							//cal_graph_data.push({ x: ssdate, y: calorie });//グラフ用データ
							ssdate.total_calorie=calorie;//一食ごとのカロリーを配列に突っ込む
							data_list[i].total_calorie=calorie;
							calorie = 0; //カロリー
							carbohydrate = 0; //炭水化物
							lipid = 0; //脂質
							protein = 0; //タンパク質
							count++;
						}
					}
				}
				cal_graph_data.push({ x: old_ssdate, y: t_calorie });//グラフの各データを一日ごとにするための処理の続き
				////console.log(cal_graph_data);

				meal_date_y = new Date().getFullYear();
				meal_date_m = new Date().getMonth() + 1;
				meal_date_d = new Date().getDate();

				meal_date_y_be = new Date(new Date().getTime() - (6 * 1000 * 60 * 60 * 24)).getFullYear();
				meal_date_m_be = new Date(new Date().getTime() - (6 * 1000 * 60 * 60 * 24)).getMonth() + 1;
				meal_date_d_be = new Date(new Date().getTime() - (6 * 1000 * 60 * 60 * 24)).getDate();

				mydatetime = String(meal_date_y)+"/"+String(meal_date_m)+"/"+String(meal_date_d)+" 23:59";
				mydatetime2 = String(meal_date_y_be)+"/"+String(meal_date_m_be)+"/"+String(meal_date_d_be)+" 00:00";
				table_range_list=table_range(new Date(mydatetime2),new Date(mydatetime));
				////console.log(mydatetime);
				////console.log(mydatetime2);
				input_list(new Date(mydatetime2),new Date(mydatetime));//リストの範囲選択と出力
				radar(table_range_list[0],table_range_list[1],table_range_list[2],table_range_list[3],7);
				line("week",table_range_list[4], table_range_list[5]);


		//*****初期表示*****
			//input_carousel("week");


		})
.error(function(data, status, headers, config) {
	$scope.message = 'failed';
});



	//*****カルーセル用処理*****

	function input_carousel(view,input_date,input_before_date) {
		if(view=="custom"){
			$scope.meal_carousel_show=false;
			$scope.before=new Date(input_before_date);
			$scope.after=new Date(input_date);

		}else{
			$scope.meal_carousel_show=true;
				////console.log(nutrients_list);
				top_date=new Date(new Date(nutrients_list[0][0]).toLocaleDateString()).getTime();
				bottom_date=new Date(new Date().toLocaleDateString()).getTime();
				var i=0;
				if(view=="today"){
					date_range=1;
				}else if(view=="week"){
					top_date=top_date - (7-(((bottom_date-(top_date))/86400000)%7))*86400000;
					date_range=7;
				}else if(view=="month"){
					top_date=top_date - (31-(((bottom_date-top_date)/86400000)%31))*86400000;
					date_range=31;
				}
				nutrients_list2=[];
				view_carousel=[];
				while (top_date <= bottom_date){
					history_top_date=top_date;
					if(view=="today"){
						view_carousel[i]=new Date(top_date).toLocaleDateString();//表示用
					}else{
						view_carousel[i]=( new Date(top_date-(86400000*(date_range))).toLocaleDateString() + "~" + new Date(top_date).toLocaleDateString());//表示用
					}
					nutrients_list2[i]=new Date(top_date);//計算用
					top_date=top_date+(86400000*date_range);
					i++;
				}
				////console.log(view_carousel);
				if(view!="today"){
					view_carousel.shift() ;
					nutrients_list2.shift() ;
				}
				$scope.data_carousel = view_carousel;//カルーセルデータ

			}
		}


	//*****食事リスト*****
	function input_list(top_date,last_date) {
		//top_date= new Date(list_last_date.getTime()-(86400000*(range-1)));
		//last_date= new Date(list_last_date);
		$scope.meal_list=[];
		meal_view_list=[];
		count=0;
		//imagelength=0;
		for(i=0; i < data_list.length;i++){
			if( top_date <= new Date(new Date(data_list[i].date).toLocaleDateString())
				&& new Date(new Date(data_list[i].date).toLocaleDateString())<= last_date){
				/*//console.log(data_list);
				imagelength=data_list[i].image.length;
				while(imagelength!=4){
					data_list[i].image.push('images/food4.png');
					imagelength++;
				}*/
				meal_view_list[count]=data_list[i];
				count++;
			}
		}
		count=0;
		////console.log(meal_view_list);
		$scope.meal_list=meal_view_list;
	}
	//*****表出力範囲設定*****
	function table_range(top_date,last_date){//(表示日数,後ろの日付)

		calorie=0;
		carbohydrate=0;
		lipid=0;
		protein=0;
		//top_date= new Date(table_date.getTime()-(86400000*(range-1)));
		//last_date= new Date(table_date);

		for(i=0; i < nutrients_list.length;i++){
			if( top_date <= new Date(nutrients_list[i][0])
				&& new Date(nutrients_list[i][0])<= last_date){

				calorie += parseFloat(nutrients_list[i][1]);
			carbohydrate +=  parseFloat(nutrients_list[i][2]);
			lipid +=  parseFloat(nutrients_list[i][3]);
			protein += parseFloat(nutrients_list[i][4]);
				/*calorie += Math.round(parseFloat(nutrients_list[i][1])*10)/10;
				carbohydrate +=  Math.round(parseFloat(nutrients_list[i][2])*10)/10;
				lipid +=  Math.round(parseFloat(nutrients_list[i][3])*10)/10;
				protein +=  Math.round(parseFloat(nutrients_list[i][4])*10)/10;*/
			}
		}
		return [calorie,carbohydrate,lipid,protein,top_date,last_date];
	}
	//*****レーザーチャート出力*****
	function radar(calorie,carbohydrate,lipid,protein,range,lastdate) {
		var radar_carbohydrate= (carbohydrate / (Math.round(parseInt(range)*carbohydrate_basis*10)/10)) * 100;
		var radar_lipid= (lipid / (Math.round(parseInt(range)*lipid_basis*10)/10)) * 100;
		var radar_protein= (protein / (Math.round(parseInt(range)*protein_basis*10)/10)) * 100;

		var config = {
			type: 'radar',
			data: {
				labels: ["脂質", "炭水化物", "タンパク"],
				datasets: [{
					label: "My First dataset",
					backgroundColor: "rgba(50,150,255,0.5)",
					pointRadius: 0,
					//borderColor: "#888",
					//pointBackgroundColor: "#888",
					data: [
					radar_lipid,
					radar_carbohydrate,
					radar_protein
					]
				}]
			},
			options: {
				legend: {
					display: false,
					labels: {
						fontColor: 'rgb(255, 255, 255)'
					}
				},
				responsive: false,
				title: {
					display: false,
					text: 'Chart.js Radar Chart'
				},
				tooltips: {
					display: false,
					mode: 'index',
					backgroundColor: 'rgba（220,0,0,0.8）',
				},
				hover: {
					display: false,
					mode: 'index'
				},
				scale: {
					ticks: {
						beginAtZero: true,
						stepSize: 20, // 目盛の間隔
						color: 'rgba(204,204,204,1)', // only want the grid lines for one axis to show up
						display: false,
						max: 100, //最大値
					},
					gridLines: {
						display: true,
						color: 'rgba(204,204,204,1)', // only want the grid lines for one axis to show up
						drawBorder: true,
					},
					angleLines: {
						display: true,
						color: 'rgba(204,204,204,1)', // only want the grid lines for one axis to show up
						drawBorder: true,
					}
				}

			}
		};


		var myRadar = document.getElementById("radar_canvas");
		myRadar.width = $(window).width()-20;
		myRadar.height = $(window).width();
		var ctx = myRadar.getContext("2d");
		window.myRadar = new Chart(document.getElementById("radar_canvas"), config);
	}
	//*****グラフ出力*****
	function line(view, top_date,bottom_date) {
		date_unit="day";//下のラベルの表示
		var configline = {
			type: 'line',
			data: {
				//labels: ["January", "February", "March", "April", "May", "June", "July"],
				/*labels: [ // Date Objects
					newDate(-6),
					newDate(-5),
					newDate(-4),
					newDate(-3),
					newDate(-2),
					newDate(-1),
					newDate(0)
					],*/
					datasets: [{
						label: "実績値",
						borderColor: "#00A0EA",
						borderWidth: "1",
						fill: false,
						lineTension: 0,
						//pointBackgroundColor:"#fff",
						pointRadius: 0,
						data: cal_graph_data,

					}, {
						label: "目標値",
						borderColor: "rgba(0,220,220,0.75)",
						fill: false,
						// Skip first and last points
						pointRadius: 0,
						//data: [{ x: Latest_input_date, y: weight_data[1][0].goal_weight }, { x: Graph_start_point_date, y: weight_data[1][0].goal_weight }],
					},/* {
						label: "下限値",
						borderColor: "rgba(220,220,220,0.75)",
						fill: false,
						// Skip first and last points
						pointRadius: 0,
						//data: [{ x: 1, y: 53 }, { x: 31, y: 53 }],
					}, {
						label: "縦値",
						borderColor: "rgba(220,220,0,0.75)",
						fill: false,
						// Skip first and last points
						pointRadius: 0,
						//data: [{ x:weight_data[0][date_label].date, y: max_weight }, { x:weight_data[0][date_label].date, y: min_weight }],
					},
					{
						label: "初期値",
						borderColor: "rgba(220,220,0,0.75)",
						fill: false,
						// Skip first and last points
						pointRadius: 0,
						data[0]: [{x:1,y:60}, {x:31,y:60}],
					}*/
					]
				},
				options: {
					animation: { animateScale: true },
					defaultFontColor: "#000",
					legend: {
						display: false,
						labels: {
							fontColor: 'rgb(255, 255, 255)'
						}
					},
					responsive: false,
					title: {
						display: false,
						text: 'Chart.js Line Chart - Skip Points'
					},
					tooltips: {
						display: false,
						mode: 'index',
						backgroundColor: 'rgba（220,0,0,0.8）',
					},
					hover: {
						display: false,
						mode: 'index'
					},
					scales: {
						xAxes: [{
							display: true,
							position: 'bottom',
							format: "YYYY-MM-DD",
							type: "time",
							time: {
								unit: date_unit,
							//unit: unit,
							displayFormats: {
								month: 'M' + "/" + 'D',
								week: 'M' + "/" + 'D',
								day: 'M' + "/" + 'D'
							},
							//tooltipFormat: 'll'
							//format: timeFormat,
							// round: 'day'
							//tooltipFormat: 'll HH:mm'
							min: top_date,
							max: bottom_date,
						},
						fontColor: 'rgb(255, 255, 255)',
						ticks: {
							min: top_date,
							max: bottom_date,
							stepSize: 5,
							userCallback: function(value, index, values) {
								return "1/" + value.toString();
							}
						},
						gridLines: {
							display: false,
							color: "rgba(220,220,220,0)", // only want the grid lines for one axis to show up
						},
						scaleLabel: {
							display: false,
							labelString: 'Month'
						}
					}],
					yAxes: [{
						display: true,
						fontColor: 'rgb(255, 255, 255)',
						scaleLabel: {
							display: false,
							labelString: 'Value'
						},
						gridLines: {
							display: true,
							color: '#ccc', // only want the grid lines for one axis to show up
							drawBorder: true,
							/*color: ['rgba(220,220,220,0.25)', 'rgba(220,220,220,0.25)', 'rgba(220,220,220,0.25)', 'rgba(220,220,220,0.25)', 'rgba(220,220,220,0.25)', 'rgba(220,220,220,0.25)', 'rgba(220,220,220,0.25)', '#fff']*/
						},
						ticks: {
							suggestedMin: 0,
							suggestedMax: 2000,
							display: true,
							position: 'right',
							userCallback: function(value, index, values) {
								return value.toString();
							}
						}
					}]
				}
			}
		};

		var line_canvas = document.getElementById("line_canvas");
		line_canvas.width = $(window).width()-20;
		line_canvas.height = $(window).width();
		var ctx = line_canvas.getContext("2d");
		window.myLine = new Chart(ctx, configline);

	}

	//お知らせ一覧
	notice_road();
	function notice_road (){
		r6=$http({
			method: 'POST',
			url: host+'/php/select/notice.php',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({flag:"home"})
		})
		.success(function(data, status, headers, config) {
			////console.log(data);
			$scope.notice_list = data;
		})
		.error(function (data, status, headers, config) {
			$scope.message = 'failed';
		});

	}

	function getPromise() {
		var deferred = $q.defer();

		////console.log(deferred);

		var allImage = $("img");
		////console.log(allImage);
		var allImageCount = allImage.length;
		////console.log(allImageCount);
		var completeImageCount = 0;

		deferred.notify("resolveObj");


		for(var i = 0; i < allImageCount; i++){
			////console.log("allImageCount");
			$(allImage[i]).bind("load", function(){
				completeImageCount ++;
				////console.log(allImageCount);
				////console.log(completeImageCount);
				if (allImageCount == completeImageCount){
					////console.log("画像読み込み完了！");
					deferred.resolve("resolveObj");
					//return "a";
				}
			});
			//deferred.reject("resolveObj");
		}

		$("img").attr({
		    //"src":"http://dummyimage.com/2000x2000/000/fff"
		}).one("load", function() {
		    ////console.log("load complete : " + (+new Date()));
		}).each(function() {
			if(this.complete) $(this).load();
		});



		return deferred.promise;
	};
	var img_read = getPromise();
	$q.all([r1, r2, r4, r5, r6,img_read]).then(function(result) {
      ////console.log("va");
      $rootScope.$broadcast('bottom_botton_ok');
  });

	$scope.notice_click = function(index){
		ParamList_W['notice'] = $scope.notice_list[index];
		ParamList_W['color'] = "b_umain";
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage('TL/notice/notice_detail.html');
	};

	$scope.trainer_list_c = function(){
		$rootScope.$broadcast('change_page','base_trainer_list');
    	//$('#globalFooter li').removeClass('current');
    	$('#globalNavi li').removeClass('current');
		//$('#globalFooter li:nth-of-type(4)').addClass('current');
		$('#globalNavi li:nth-of-type(4)').addClass('current');
		ParamList_W['flag'] = "trainer";
		SharedScopes.set(ParamList_W);
		main_navigator.pushPage('Trainer/trainer_list/trainer_list.html');
	};

	$scope.trainer_detail_c = function(index){
		$rootScope.$broadcast('change_page','base_trainer_list');
    	//$('#globalFooter li').removeClass('current');
    	$('#globalNavi li').removeClass('current');
		//$('#globalFooter li:nth-of-type(4)').addClass('current');
		$('#globalNavi li:nth-of-type(4)').addClass('current');
		ParamList_W=[];
		ParamList_W['trainer_list']=$scope.trainer_list;
		ParamList_W['trainer_id']=index;
		////console.log($scope.trainer_list);
		////console.log(index);
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage('Trainer/trainer_detail/trainer_detail.html', { animation : 'slide'});
	};

	$scope.mytrain_list_c = function(){
		$rootScope.$broadcast('change_page','base_mytraining');
    	//$('#globalFooter li').removeClass('current');
    	$('#globalNavi li').removeClass('current');
		//$('#globalFooter li:nth-of-type(2)').addClass('current');
		$('#globalNavi li:nth-of-type(3)').addClass('current');
		ParamList_W['all_data']=all_data;
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage('MyTraining/mytraining_his_list/mytraining_his_training_list.html');
	};

	$scope.mytrain_detail_c = function(index){
		$rootScope.$broadcast('change_page','base_mytraining');
    	//$('#globalFooter li').removeClass('current');
    	$('#globalNavi li').removeClass('current');
		//$('#globalFooter li:nth-of-type(2)').addClass('current');
		$('#globalNavi li:nth-of-type(3)').addClass('current');
		ParamList_W.menu_id = index;
		ParamList_W['all_data']=all_data;
		SharedScopes.set(ParamList_W);
		$scope.main_navigator.pushPage('MyTraining/mytraining_his_list/mytraining_his_training_detail.html');
	};

	$scope.food_list_c = function(){
		$rootScope.$broadcast('change_page','base_management');
    	//$('#globalFooter li').removeClass('current');
    	$('#globalNavi li').removeClass('current');
		//$('#globalFooter li:nth-of-type(1)').addClass('current');
		$('#globalNavi li:nth-of-type(5)').addClass('current');
		$scope.main_navigator.pushPage('TL/meal/meal_list.html');
	};

	$scope.food_detail_c = function(index){
		$rootScope.$broadcast('change_page','base_management');
    	//$('#globalFooter li').removeClass('current');
    	$('#globalNavi li').removeClass('current');
		//$('#globalFooter li:nth-of-type(1)').addClass('current');
		$('#globalNavi li:nth-of-type(5)').addClass('current');
		ParamList_W['data_list'] = $scope.food_tl[index];
		ParamList_W['all_data']=all_data;
		SharedScopes.set(ParamList_W);
		main_navigator.pushPage('TL/meal/meal_detail.html');
		// infor_dialog.show();
	};

	$scope.tutoria_carousel_Next = function() {
		tutoria_carousel.next();
	};

	$scope.tutoria_carousel_Back = function() {
		tutoria_carousel.back();
	};

	$scope.tutoria_end = function() {
		$http({
			method: 'POST',
			url: host + '/php/insert/tutoria_flag.php', // 適宜変更する
			headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
			data: $.param({ session_id: localStorage.getItem('session_id'), user_id: id })
		})
		.success(function(data, status, headers, config) {
			////console.log(data);
			if(data=="session_ng"){
				main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
				return;
			}
			// console.log(data);
			tutoria_dialog.hide();
			infor_dialog.show();
			//$scope.main_navigator.pushPage('Profile/profile_first.html');
			 // main_navigator.pushPage('Profile/profile_edit.html', {
    //         animation : 'slide',
    //         onTransitionEnd: function() {
    //           $scope.isPushing = false;
    //         }
        // });
			//$scope.main_navigator.pushPage('Profile/profile_edit.html.html');
			//$scope.main_navigator.pushPage('Profile/profile_edit.html');

		})
		.error(function (data, status, headers, config) {
			$scope.message = 'failed';
		});
	};


	/*$scope.$on('update_food_for_home', function(update_undo,element) {
//		//console.log("update food");
		food_load();
	});*/

	$scope.$on('trainer_comment_list', function(a,data_temp) {
		////console.log(data_temp);
		output_list(data_temp);
		//user_list_filter($scope.user_list);

	});
	$scope.goMessageBox = function(index){

		$scope.main_navigator.pushPage('TL/notice/messageBox.html', {animation: 'slide'});
	};
	// ons.ready(function() {
	// 	ons.createDialog('tutoria_dialog1.html', {parentScope: $scope}).then(function(dialog5) {
	// 	});
	// });
}]);
