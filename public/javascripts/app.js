var app = angular.module('angularjsNodejsTutorial',[]);
app.controller('myController', function($scope, $http) {
        $scope.message="";
        $scope.Submit = function() {
        var request = $http.get('/data/'+$scope.email);
        request.success(function(data) {
            $scope.data = data;
        });
        request.error(function(data){
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