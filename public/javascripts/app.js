var app = angular.module('angularjsNodejsTutorial',[]);

app.controller('songController', function($scope, $http) {
        $scope.message="";
        $scope.Submit = function() {
            var request = $http.get('/data/'+$scope.song);
            request.success(function(data) {
                $scope.data = data;
                $scope.songData = '';
                $scope.prompt = 'Artist?';
            });
            request.error(function(data){
                console.log('err');
            });
        };
        $scope.SubmitSongID = function(songID, artist_name, song_name) {
            var requestSongID = $http.get('/songID/'+ songID);
            requestSongID.success(function(songData) {
                console.log(songData);
                $scope.songData = songData;
                $scope.song = song_name;
                $scope.data = '';
                $scope.prompt = "Songs similar to: " + song_name + " by " + artist_name;
            });
            requestSongID.error(function(songData){
                console.log('err');
            });
        };
});

app.controller('popularAController', function($scope, $http) {
        $scope.message="";

        var request = $http.get('/popular/displayArtists');
        request.success(function(popular) {
            $scope.popular = popular;
        });
        request.error(function(popular){
            console.log('err');
        });

});


app.controller('popularSController', function($scope, $http) {
        $scope.message="";

        var request = $http.get('/popular/displaySongs');
        request.success(function(popularS) {
            $scope.popularS = popularS;
        });
        request.error(function(popularS){
            console.log('err');
        });

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
