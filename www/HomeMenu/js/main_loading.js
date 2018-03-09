module.controller('MainLoading', function($scope) {
  $scope.load = function(page) {
    console.log("nguyen van tam");
    $scope.main_navigator.pushPage('HomeMenu/home.html');
  };

  $scope.toggle = function() {
    $scope.splitter.left.toggle();
  };

  // ons.ready(function() {
  //   console.log("Onsen UI is ready!");
  // });
});

