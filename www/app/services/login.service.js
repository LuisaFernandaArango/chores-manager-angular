(function(){

	angular.module('myApp')
	.service('loginService', ['$location', '$localStorage', '$rootScope', 'sessionData', Login]);

	function Login($location, $localStorage, $rootScope, sessionData){

		var loginService = {};

		loginService.initialize = function(){
			//Verifica si el usuario esta logeado e inicia el enrutamiento según el caso			
		    $rootScope.$on('$routeChangeStart', function (event) {
		        if ($location.$$path != '/login' && $localStorage.userSesion == undefined) {
		            event.preventDefault();
		            $location.path('login');
		        } else if($localStorage.userSesion != undefined){
		            $rootScope.user = $localStorage.userSesion;
		            if($location.$$path == '/login'){
		                event.preventDefault();
		                $location.path('chores');
		            }
		        }
		    });
		};

		//Se inicializa el método global para cerrar sesión desde cualquier vista.
		$rootScope.logOut = function() {
			delete $rootScope.user;
			delete $localStorage.userSesion;
			$location.path('login');			
		};

		return loginService;
	};
})();