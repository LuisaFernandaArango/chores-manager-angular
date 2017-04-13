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