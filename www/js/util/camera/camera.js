var imagehtml = '<img id="selectedPhoto" width="320" height="480">';
var isAdd = false;

module.controller('CameraController',['$scope','$sce', function($scope, $sce) {
    $scope.onclickcamera = function() {
        var options = {
          destinationType: Camera.DestinationType.FILE_URI,
          saveToPhotoAlbum: true,
          targetWidth: 800,
          targetHeight: 800
        };
                
        navigator.camera.getPicture (onSuccess, onFail, options);
      
        $scope.hoge = $sce.trustAsHtml(imagehtml);
        //ここでしか追加出来ない
        // 成功した際に呼ばれるコールバック関数
        function onSuccess (imageData) {
          $scope.hoge = $sce.trustAsHtml(imagehtml);
          var image = document.createElement("img");
          $(image).attr("src", imageData);
          $("#selectedPhoto").attr("src", imageData);
        }
      
        // 失敗した場合に呼ばれるコールバック関数
        function onFail (message) {
            alert ('エラーです: ' + message);
            $scope.hoge = $sce.trustAsHtml(""); 
        }
    };
    
    $scope.onclickimage = function() {
        console.log("hoge");
        $scope.hoge = $sce.trustAsHtml(imagehtml);
        navigator.camera.getPicture(function(imageURI){
          $("#selectedPhoto").attr("src", imageURI);
        }, function(msg){
          //alert("Error : " + msg);
        }, {
            
          quality:50,
          destinationType:Camera.DestinationType.FILE_URI,
          sourceType:Camera.PictureSourceType.SAVEDPHOTOALBUM,
        });    
    };
}]);