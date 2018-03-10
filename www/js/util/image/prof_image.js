var profhtml = '<img id="Photo" width="140" height="140">';
module.controller('ProfCameraController',['$scope', '$http', '$sce', function($scope,$http, $sce) {
    $scope.clickcameraprof = function() {
        var options = {
        	destinationType: Camera.DestinationType.FILE_URI,
        	saveToPhotoAlbum: true,
        	targetWidth: 800,
        	targetHeight: 800
        };

        navigator.camera.getPicture (onSuccess, onFail, options);

        $scope.hoge = $sce.trustAsHtml(profhtml);
        //ここでしか追加出来ない
        // 成功した際に呼ばれるコールバック関数
        function onSuccess (imageData) {
        	$scope.hoge = $sce.trustAsHtml(profhtml);
        	var image = document.createElement("img");
        	$(image).attr("src", imageData);
        	$("#Photo").attr("src", imageData);
        }

        // 失敗した場合に呼ばれるコールバック関数
        function onFail (message) {
            alert ('エラーです: ' + message);
            $scope.hoge = $sce.trustAsHtml("");
        }
    };

    $scope.onclickimageprof = function() {
    	$scope.hoge = $sce.trustAsHtml(profhtml);
        navigator.camera.getPicture(function(imageURI){
        	$("#Photo").attr("src", imageURI);
        	//var fb = $('#Photo').serialize();
            //fd = new FormData($form[0]);
        	//upload(fb);
        	window.resolveLocalFileSystemURL(imageURI, resolveOnSuccess, resOnError);
        }, function(msg){
            //$scope.hoge = $sce.trustAsHtml(null);
        }, {
        	quality:50,
        	destinationType:Camera.DestinationType.FILE_URI,
        	sourceType:Camera.PictureSourceType.SAVEDPHOTOALBUM,
        });
    };

    //File_URIをFILEに変換（詳細は不明だ!!（http://blog.asial.co.jp/1271）
	function resolveOnSuccess(entry) {
		console.log("entry");
        //upload(entry.file);
        entry.file( function(file) {
            var reader = new FileReader();
            reader.onloadend = function(evt) {
                var formData = new FormData();
                formData.append("userfile", new Blob([evt.target.result],{"type":file.type}), "uesrfile.png");
                upload2(formData);
            };
            reader.readAsArrayBuffer( file );
        }, resOnError );


    }

    function resOnError(error) {
        alert(error.code);
    }

    function upload2(fd) {
            fd.append( 'session_id', localStorage.getItem('session_id'));
            $.ajax(
            host+'/php/insert/photo_test.php',
                {
                type: 'post',
                processData: false,
                contentType: false,
                data: fd,
                dataType: "text",
                success: function(data) {
                    alert( data );
                    console.log(data);
					if(data=="session_ng"){
						main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
						return;
					}
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    alert( "ERROR" );
                    alert( textStatus );
                    alert( errorThrown );
                }
            });
            return false;
        }
    /*
    Angularだと何故か動かない・・・（泣）
    function upload (fd){
    	console.log("upload");
    	$http({
          method: 'POST',
          url: host+'/php/insert/photo_test.php', // 適宜変更する
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
          data: fd,
        })
        .success(function(data, status, headers, config) {
					if(data=="session_ng"){
						main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
						return;
					}
            console.log("succesed:"+data);
            console.log("succesec:");
            console.log(config);
        })
        .error(function (data, status, headers, config) {
          console.log("failed:"+data);
        });
    }
    */
    /*
    #Photoがinputフォームであれば可能なはず・・・（テストはしてない）
    $scope.phupload = function () {
    	console.log("upload");
    	$http({
          method: 'POST',
          url: host+'/php/insert/photo_test.php', // 適宜変更する
          headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    	  processData: false,
          data: $('#Photo').serialize()
        })
        .success(function(data, status, headers, config) {
					if(data=="session_ng"){
						main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
						return;
					}
            console.log("succesed:"+data);
            console.log("succesec:");
            console.log(config);
        })
        .error(function (data, status, headers, config) {
          console.log("failed:"+data);
        });
    }
    */
}]);