// This is a JavaScript file
var TitleList=[];
var NameList=[];
var UrlList=[];
var GenreList=[];
var PurposeList=[];
module.controller('TrainingController', ['$scope', '$http', function ($scope, $http) {
    $http({
      method: 'POST',
      url: host+'/php/select/movie_list.php', // 適宜変更する
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      data: $.param({session_id: localStorage.getItem('session_id'),user_id: "1",test: "ttest"})
    })
    .success(function(data, status, headers, config) {
					if(data=="session_ng"){
						main_navigator.resetToPage('Login/sesson_ng.html', { animation : 'slide' });
						return;
					}
        console.log("data:"+data);
        for (var i =0; i<data.length; i++)
        {
            TitleList[i] = data[i].title;
            NameList[i] = data[i].name;
            UrlList[i] = data[i].url;
            GenreList[i] = data[i].genre;
            PurposeList[i] = data[i].purpose;
	    }
    })
    .error(function (data, status, headers, config) {
        console.log("bad"+status);
      $scope.message = 'failed';
    });


   	$scope.TrainingDelegate = {
      countItems: function() {
        // Return number of items.
        console.log("number");
        return TitleList.length;
      },

      calculateItemHeight: function(index) {
        // Return the height of an item in pixels.
        return 160;
      },

      configureItemScope: function(index, itemScope) {
        // Initialize scope
        //itemScope.profimage = "<img src='"+ProfImageList[index]+"' class='thumbnail'>";
        console.log("hoge");
        itemScope.title = TitleList[index];
        itemScope.name = NameList[index];
        itemScope.url = UrlList[index];
        itemScope.genre = GenreList[index];
        itemScope.purpose = PurposeList[index];
      },

      destroyItemScope: function(index, itemScope) {
        // Optional method that is called when an item is unloaded.
        console.log('Destroyed item with index: ' + index);
      }
    };
}]);
