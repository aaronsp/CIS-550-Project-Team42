var app = angular.module('angularjsNodejsTutorial',[]);

app.controller('songController', function($scope, $http) {
        $scope.message="";
        $scope.Submit = function() {
            var request = $http.get('/data/'+$scope.song);
            request.success(function(data) {
                $scope.data = data;
            });
            request.error(function(data){
                console.log('err');
            });
        };
        $scope.SubmitSongID = function(songID) {
            var requestSongID = $http.get('/songID/'+ songID);
            requestSongID.success(function(songData) {
                $scope.songData = songData;
            });
            requestSongID.error(function(songData){
                console.log('err');
            });
        };
});

// To implement "Insert a new record", you need to:
// - Create a new controller here
// - Create a corresponding route handler in routes/index.js

app.controller('insertController', function($scope, $http) {
  $scope.message="";
  $scope.Insert = function() {
  var request = $http.get('/data/'+$scope.login + '/' + $scope.name + '/'
  + $scope.sex + '/' + $scope.RelationshipStatus + '/' + $scope.Birthyear);
  request.success(function(data) {
      $scope.data = data;
  });
  request.error(function(data){
      console.log('err');
  });

};
});
/*app.controller('insertController', function($scope, $http) {
    $scope.message = '';
    $scope.Insert = function() {
      alert('huh');
      var data = {
                login: $scope.login,
                name: $scope.name,
                sex: $scope.sex
            };

      /*var request = $http({
            method: 'POST',
            url: '/data2in',
            data: data,
            headers: {'Content-Type: application/json'}
        });*/
      /*var header = {'Content-Type: application/json'};
      var request = $http.post('/data2in/', data, header);
      request.success(function(data) {
          $scope.message = data; //?
          alert('yay!');
      });
      request.error(function(data){
          alert('err');
      });
    };
});*/
