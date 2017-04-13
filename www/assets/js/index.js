//Routing of backedn service
var applicationConfig = {
    'base_url':'http://localhost:3000/',
    'users':'users',
    'chores':'chores'
};

//Dependencies  
angular.module('myApp', [
  'ngRoute',
  'ngStorage'
])
.run(['loginService',  function(loginService){
    loginService.initialize();    
}])
.constant('applicationConfig', applicationConfig)
.value('sessionData', {})
.config(['$routeProvider', function($routeProvider) {
    
    //Routing settings
    $routeProvider
    .when("/login", {
        templateUrl : "app/login/login.html",
        controller: 'loginCtrl',
        controllerAs:'login' 
    })
    .when("/chores", {
        templateUrl : "app/chores/chores.html",
        controller: 'choresCtlr',
        controllerAs:'vmChore'
    }).when("/changepass", {
        templateUrl : "app/changepass/changepass.html",
        controller: '',
        controllerAs:''
    }).when("/editchore", {
        templateUrl : "app/editchore/editchore.html",
        controller: 'editChoreCtlt',
        controllerAs:'vmChore'
    }).when("/finishedchores", {
        templateUrl : "app/finishedchores/finishedchores.html",
        controller: 'finishChoresCtlr',
        controllerAs:'vmFinishedChore'
    }).when("/detail", {
        templateUrl : "app/detail/detail.html",
        controller: 'detailCtlt',
        controllerAs:'vmChore'
    }).when("/addChore", {
        templateUrl : "app/addchore/addchore.html",
        controller: 'addChoreCtlr',
        controllerAs:'vmAddChore'
    })
    .when("/changepass", {
        templateUrl : "app/changepass/changepass.html",
        controller: 'changePassCtlt',
        controllerAs:'vmChore'
    })
    
    .otherwise({redirectTo: '/login'});
}]);
(function(){

	angular.module('myApp')
	.controller('addChoreCtlr', ['applicationConfig', 'httpService', 'sessionData', '$scope', '$rootScope', '$location','$localStorage' , RegisterChore]);

	function RegisterChore(applicationConfig, httpService, sessionData, $scope, $rootScope, $location, $localStorage){
		var vmAddChore = this;
		vmAddChore.newChore = {};
		vmAddChore.newChore.state="undone";
		vmAddChore.newChore.resposable = $localStorage.userSesion.id;
		//funciones
		vmAddChore.addChore = addChore;
		//agrega un una nueva tarea
		function addChore(){
			var successCallback = function(response){
				if(response.data){
					$scope.formRegisterChore.$setPristine();
					vmAddChore.newChore = {};
					console.log("Agrego la tarea de manera exitosa");
				}
			};

			var errorCallback = function(error){
				console.log('error: ' + error);
			};
			console.log(vmAddChore.newChore);
			httpService.post(applicationConfig.chores, vmAddChore.newChore, successCallback, errorCallback);
		}
		
		
	};
})();
(function(){

	angular.module('myApp')   
	.controller('changePassCtlt', ['$localStorage','applicationConfig', 'httpService', 'sessionData', '$scope', '$rootScope', '$location',  ChangePass]);

	function ChangePass($localStorage, applicationConfig, httpService, sessionData, $scope, $rootScope, $location){
		var vmChore = this;
		vmChore.newChore=sessionData.chore;
		vmChore.pass={};
		vmChore.user={};
		//funciones
		vmChore.save=save;
		vmChore.change=change;
		
		//Se actualiza la contraseña del usuario logeado
		function change()
		{
			if (vmChore.pass.pass1==vmChore.pass.pass2 ) 
			{
				vmChore.user = $localStorage.userSesion;
				vmChore.user.password=vmChore.pass.pass1;
				save(vmChore.user);
			}
		}
		//Actualizar el objeto usuario
		function save (obj) {
			
			var successCallback = function(response){
				if(response.data){
					console.log("Pass change");
					alert('La contrasela se ha cambiado exitosamente');
					alert('La Sesión a caducado');
					$rootScope.logOut();					
				}
			};
			var errorCallback = function(error){
				console.log('error: ' + error);
			};
			var url = applicationConfig.users + "/" + obj.id;
			httpService.put(url, obj, successCallback, errorCallback);
		}
				
	};
})();
(function(){

	angular.module('myApp')
	.controller('choresCtlr', ['$window','$location', 'applicationConfig', 'httpService', 'sessionData', '$rootScope', '$localStorage', ChoresList]);

	function ChoresList($window,$location,applicationConfig, httpService, sessionData, $rootScope, $localStorage){
		var vmChore = this;
		//variables
		vmChore.chore = [];
		vmChore.paginator = 0;
		vmChore.choresAvailable = true;
		vmChore.query = '';
	  
		//funciones
		vmChore.loadMoreChores = loadMoreChores;
		vmChore.detail = detail;
		vmChore.finish = finish;
		vmChore.edit = edit;

		getChores();
		//Obtiene las Tareas Pendientes
		function getChores(){
			var successCallback = function(chore){
				addData(chore.data);
			};

			var errorCallback = function(error){
				console.log('error: ' + error);
			};
			
			var end = vmChore.paginator + 10;
			var start;
			if(vmChore.paginator>0){
				start =end - 5;
			}
			else{
				start=0;
			}
			
			var url = applicationConfig.chores +'?resposable='+$localStorage.userSesion.id+ '&state=undone&_start=' + start + '&_end=' + end;

			httpService.get(url, {}, successCallback, errorCallback);
		}	

		//Se van armando las tareas
		function addData(data){
			var numberItems = Object.keys(data).length;
			if(numberItems > 0){				
				vmChore.chore = vmChore.chore.concat(data);
				for (var i = 0; i < vmChore.chore.length; i++) 
				{				
					var stringDate = vmChore.chore[i].date
					var date = new Date(stringDate);
					vmChore.chore[i].date = date;					
				}
				
			} else {
				vmChore.choresAvailable = false;
			}		
			
		}
		//Guarda en la variable global y redirecciona para ser editada
		function edit(obj) {
			sessionData.chore = obj;  
			$location.path('/editchore');
		}
		//Carga más tareas - 5 tareas 
		function loadMoreChores(){
			vmChore.paginator += 5;
			getChores();
		};
		//Va al detalle de la tarea
		function detail(chore){
			var date= chore.date;
			var dd = date.getDate();
			var mm = date.getMonth()+1; //hoy es 0!
			var yyyy = date.getFullYear();

			if(dd<10) {
			    dd='0'+dd
			} 
			if(mm<10) {
			    mm='0'+mm
			} 
			chore.date = mm+'/'+dd+'/'+yyyy;
			sessionData.choreDetalle = chore;  
			$location.path('/detail');
		}
		//La tarea pendiente pasa a estar hecha
		function finish (obj) {
			obj.state="done";
			var successCallback = function(response){
				if(response.data){
					$window.location.reload();
				}
			};
			var errorCallback = function(error){
				console.log('error: ' + error);
			};
			var url = applicationConfig.chores + "/" + obj.id;
			httpService.put(url, obj, successCallback, errorCallback);
		}

		
		
	};
})();



(function(){

	angular.module('myApp')
	.controller('detailCtlt', ['$location', 'applicationConfig', 'httpService', 'sessionData', '$rootScope', '$localStorage', DetailChore]);

	function DetailChore($location,applicationConfig, httpService, sessionData, $rootScope, $localStorage){
		var vmChore = this;
		//variables
		vmChore.chore = [];
		vmChore.chore=sessionData.choreDetalle;
		//funciones
		vmChore.toBack = toBack;
		//Redirecciona a las tareas pendientes
		function toBack() {
			$location.path('/chores');
		}
		       
	};
})();



(function(){

	angular.module('myApp')   
	.controller('editChoreCtlt', ['applicationConfig', 'httpService', 'sessionData', '$scope', '$rootScope', '$location',  EditChore]);

	function EditChore(applicationConfig, httpService, sessionData, $scope, $rootScope, $location){
		var vmChore = this;
		//variables
		vmChore.newChore=sessionData.chore;
		//funciones
		vmChore.save=save;
				
        //Actualiza la tarea seleccionada
		function save (obj) {
			var successCallback = function(response){
				if(response.data){					
					$location.path('/chores');
				}
			};
			var errorCallback = function(error){
				console.log('error: ' + error);
			};
			var url = applicationConfig.chores + "/" + obj.id;
			httpService.put(url, obj, successCallback, errorCallback);
		}		
	};
})();
(function(){

	angular.module('myApp')
	.controller('finishChoresCtlr', ['$location', 'applicationConfig', 'httpService', 'sessionData', '$rootScope', '$localStorage', ChoresList]);

	function ChoresList($location,applicationConfig, httpService, sessionData, $rootScope, $localStorage){
		var vmFinishedChore = this;
		//variables
		vmFinishedChore.chore = [];
		vmFinishedChore.choresAvailables = true;
		vmFinishedChore.query = '';
	  
		
		getChore();
		//Obtiene las tareas Finalizadas
		function getChore(){
			var successCallback = function(chore){
				addData(chore.data);
			};

			var errorCallback = function(error){
				console.log('error: ' + error);
			};				
			
			var url = applicationConfig.chores +'?resposable='+$localStorage.userSesion.id+ '&state=done';
			httpService.get(url, {}, successCallback, errorCallback);
		}

		

		//Se arma la lista de tareas
		function addData(data){
			var numberItems = Object.keys(data).length;
			if(numberItems > 0){
			   vmFinishedChore.chore = vmFinishedChore.chore.concat(data);
				
				for (var i = 0; i < vmFinishedChore.chore.length; i++) {
					
					var stringDate = vmFinishedChore.chore[i].date
					var date = new Date(stringDate);
					var dd = date.getDate();
					var mm = date.getMonth()+1; //hoy es 0!
					var yyyy = date.getFullYear();

					if(dd<10) {
					    dd='0'+dd
					} 
					if(mm<10) {
					    mm='0'+mm
					} 
					vmFinishedChore.chore[i].date = mm+'/'+dd+'/'+yyyy;				
					
				}
			}
			
		}		
		
		
	};
})();





//Establecer el ancho de la navegación de lado a 250px
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("dark-background").style.display = "block";
    
}

//Establecer el ancho de la navegación de lado a 0 
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("dark-background").style.display = "none";
}
(function(){

	angular.module('myApp')
	.controller('loginCtrl', ['$location', '$localStorage', '$rootScope', 'httpService', Login]);

	function Login($location, $localStorage, $rootScope, httpService){
		var vmLogin = this;
		//variables
		vmLogin.user = {};
		//funciones
		vmLogin.login = login;

		//Se realiza la utenticación del usuario
		function login(){
		    
			if(vmLogin.user.username != '' && vmLogin.user.password != ''){
                   console.log(vmLogin.user.username);
				var successCallback = function(response){
				     console.log(response);
					if(response.data.length > 0){
						$localStorage.userSesion = $rootScope.user = response.data[0];
						$location.path('chores');
					} else {
						
					}
				}
				var errorCallback = function(error){
					console.log('error: ' + error);
				}

				var url = applicationConfig.users + '?username=' + vmLogin.user.username + '&password=' + vmLogin.user.password;

				httpService.get(url, {}, successCallback, errorCallback)
			}
		};
	};
})();
(function(){

//Servicio utilizado para hacer solicitud a la base de datos
	angular.module('myApp')
	.service('httpService', ['$http', 'applicationConfig', httpService]);

	function httpService($http, applicationConfig){
		
		var service = {
			get: get,
			post:post,
			put:put,
			deleteReq, deleteReq
		};
		return service;

		function makeRequest(url, requestType, params, successCallback, errorCallback, headers) {

			var requestConfig = {
				method: requestType,
				url: applicationConfig.base_url + url,
				data: params,
				timeout: 10000
			};

			if (headers !== undefined) {
				requestConfig.headers = headers;
			}

			$http(requestConfig).then(successCallback, errorCallback);
		};

		function get(url, params, successCallback, errorCallback, headers){
			makeRequest(url, 'GET', params, successCallback, errorCallback, headers);
		}

		function post(url, params, successCallback, errorCallback, headers){
			makeRequest(url, 'POST', params, successCallback, errorCallback, headers);
		}

		function put(url, params, successCallback, errorCallback, headers){
			makeRequest(url, 'PUT', params, successCallback, errorCallback, headers);
		}

		function deleteReq(url, params, successCallback, errorCallback, headers){
			makeRequest(url, 'DELETE', params, successCallback, errorCallback, headers);
		}
	};
})();
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