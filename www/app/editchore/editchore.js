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