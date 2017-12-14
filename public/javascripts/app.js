var app = angular.module('angularjsNodejsTutorial',[]);

app.controller('songController', function($scope, $http) {
        $scope.message="Hello";
        $scope.Submit = function() {
            var song = $scope.song;
            var artist = $scope.artist;
            if (artist == null || artist === '') {
              var request = $http.get('/data/'+ song);
              var prompt = 'Artist?';
            }
            else if (song == null || song === '') {
              var request = $http.get('/artistSearch/'+ artist);
              var prompt = 'Song?';
            }
            else {
              var request = $http.get('/both/'+ song + "/" + artist);
              var prompt = 'Find similar songs?'
            }
            request.success(function(data) {
                $scope.data = data;
                $scope.songData = '';
                if (data.length > 0 ) {
                  $scope.prompt = prompt;
                } else {
                  $scope.prompt = "Search found no results.";
                }
            });
            request.error(function(data){
                console.log('err');
            });
        };
        $scope.SubmitSongID = function(songID, artist_name, song_name, rec) {
            var requestSongID = $http.get('/songID/' + songID + '/' + rec);
            requestSongID.success(function(songData) {
                console.log(songData);
                if (songData.length > 0){
                    $scope.prompt = "Songs similar to: " + song_name + " by " + artist_name;
                } else {
                    $scope.prompt = "No songs found similar to " + song_name + " by " + artist_name;
                }
                $scope.songData = songData;
                $scope.song = song_name;
                $scope.artist = artist_name;
                $scope.data = '';
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

        $scope.SongsByArtist = function(artistName) {
            var requestSongsByArtist = $http.get('/songsByArtist/' + artistName);

        };

});

app.controller('popularTController', function($scope, $http) {
        $scope.message="";

        var request = $http.get('/popular/displayTag');
        request.success(function(popularT) {
            $scope.popularT = popularT;
        });
        request.error(function(popularT){
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
        $scope.SubmitSongID = function(songID, artist_name, song_name) {
            var requestSongID = $http.get('/similarSongsUser/'+ songID);
            requestSongID.success(function(songData) {
                console.log(songData);
                if (songData.length > 0){
                    $scope.prompt = "Songs similar to: " + song_name + " by " + artist_name;
                } else {
                    $scope.prompt = "No songs found similar to " + song_name + " by " + artist_name;
                }
                $scope.songData = songData;
                $scope.song = song_name;
                $scope.data = '';
            });
            requestSongID.error(function(songData){
                console.log('err');
            });
        };

});
