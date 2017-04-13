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