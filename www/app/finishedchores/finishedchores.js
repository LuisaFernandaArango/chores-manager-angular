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


