var myApp=angular.module('login', ['ui.router', 'ui.bootstrap', 'ngMaterial', 'login.loginFactory'])
.controller('loginCtrl', ['$scope', '$http', '$window', 'loginService', function ($scope, $http, $window, loginService) {
	'use strict';
	$scope.errorMessage = '';
	$scope.user = {};
	function init() {
		if (localStorage.getItem('Username') != null) {
			loginService.isUserLogged()
			.success(function (data, status, headers, config) {
				if(data.isLoggedIn) {
					$window.location.href = data.url;
				}
			})
			.error(function (data, status, headers, config) {
				localStorage.removeItem('Username');
				localStorage.removeItem('TimeStamp');
				localStorage.removeItem('SessionID');
				localStorage.removeItem('UserRole');
				localStorage.removeItem('ReadNews');
			});
		}
	};

	init();

	$scope.login = function() {
		if ($scope.user.username !== undefined && $scope.user.password !== undefined) {
			loginService.login($scope.user.username, $scope.user.password)
			.success(function (data) {
				localStorage.setItem('TimeStamp', new Date().getTime());
				localStorage.setItem('SessionID', data.session);
				localStorage.setItem('Username', $scope.user.username );
				localStorage.setItem('UserRole', data.role);
				localStorage.setItem('ReadNews', data.readNews);
				$window.location.href = data.url;
				$scope.errorMessage = '';
			})
			.error(function () {
				$scope.errorMessage = 'Niepoprawna próba logowania. Błędna nazwa użytkownika lub hasło.';
			});
		}
	};
}])
.directive('myEnter', function () {
	'use strict';
	return function (scope, element, attrs) {
		element.bind('keydown keypress', function (event) {
			if(event.which === 13) {
				scope.$apply(function () {
					scope.$eval(attrs.myEnter);
				});
				event.preventDefault();
			}
		});
	};
});
