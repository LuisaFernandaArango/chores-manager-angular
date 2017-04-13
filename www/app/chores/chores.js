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


