// This is a JavaScript file

module.controller('MemberRegistrationController', ['$scope', '$http','SharedScopes','$timeout', function ($scope, $http,SharedScopes,$timeout) {
    var prof_photos = [];
    $scope.prof_photos = [];
    var back_photos = [];
    $scope.back_photos = [];
    $scope.prof_imagesUrl=null;
    $scope.back_imagesUrl=null;

    $scope.sex_sel="男";
    $scope.trainer_flag_sel="0";

    var ParamList_R = [];
    var ParamList_W = [];

    var update = function() {
        ParamList_R = SharedScopes.get();
        SharedScopes.delete();
        if(ParamList_R['area']!=undefined ){
            $scope.area = ParamList_R['area'];
        }
    };
    update();
    setInterval(function() {
      $scope.$apply(update);
    }, 1000);

    //$scope.sex_sel = "男";

    $scope.sex_sel_set = {
        theme: 'auto',
        lang: 'ja',
        display: 'bottom',
        buttons: [
            {
                text: 'Chọn',
                cssClass: 'set-btn',
                handler: 'set'
            }
        ],
        onShow: function (event, inst) {
            var set_btn = $('.set-btn').parent();
            var dialog = $('.set-btn').parent().parent().parent();
            dialog.prepend(set_btn);
        },
    };


    $scope.member_registration_ck = function() {


        var mail =$("#me_mail").val();
        $http({
            method: 'POST',
            url: host+'/php/select/id_check.php', // 適宜変更する
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            data: $.param({mail:mail})
        })
        .success(function(data, status, headers, config) {
            console.log(data);
            var error_flag=false;

            //pass
            if($("#me_pass").val()==""){
                $scope.required_pass_error="Mật khẩu là bắt buộc";
                error_flag=true;
            }else{
                $scope.required_pass_error="";
            }
            if ($("#me_pass").val().match(/[^A-Za-z0-9]+/)) {
                $scope.alphanumeric_pass_error="Mật khẩu chỉ được dùng số và chữ";
                error_flag=true;
            }else{
                $scope.alphanumeric_pass_error="";
            }
            if($("#me_pass").val().length<4){
                $scope.length_pass_error="Mật khẩu phải quá 4 kí tự";
                error_flag=true;
            }else{
                $scope.length_pass_error="";
            }

            //名前
            if($("#me_name").val()==""){
                $scope.required_name_error="Tên người dùng là bắt buộc nhập";
                error_flag=true;
            }else{
                $scope.required_name_error="";
            }

            //mail
            if($("#me_mail").val()==""){
                $scope.required_mail_error="Email người dùng là bắt buộc";
                error_flag=true;
            }else{
                $scope.required_mail_error="";
            }
            console.log(mail);
            if(!(mail === "" || mail === null || mail === undefined)){
                if(!mail.match(/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/)){
                    $scope.correct_mail_error="Không chính xác định dạng email";
                    error_flag=true;
                }else{
                    $scope.correct_mail_error="";
                }

                if(data){
                    $scope.alphanumeric_mail_error="Địa chỉ email đã tồn tại";
                    error_flag=true;
                }else{
                    $scope.alphanumeric_mail_error="";
                }
            }

            //console.log($scope.sex_sel);
            //console.log($scope.area_sel);
            $me_name= $("#me_name").val(),
            $me_mail= $("#me_mail").val(),
            $me_sex= $scope.trainer_flag_sel,
            $me_flag = data ? 1:0;
            if (!error_flag){
                $http({
                    method: 'POST',
                    url: host+'/php/insert/member_registration_insert.php',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    data: $.param({me_pass: $("#me_pass").val(), 
                        me_name: $me_name,
                        me_mail: $me_mail,
                        me_sex: $me_sex,
                        me_flag : $me_flag

                    })
                })
                .success(function(data, status, headers, config) {
                    // console.log(data);
                    console.log("loi" , data);
                    main_navigator.pushPage('Login/login.html');
                })
                .error(function (data, status, headers, config) {
                     $scope.message = data;
                });
            }

        })
        .error(function (data, status, headers, config) {
            $scope.message = 'failed';
        });
    }
    $scope.popPage = function(){
        main_navigator.popPage();
    }
}]);
