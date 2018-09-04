hbiApp.controller('thankyouController', ['$scope', 'headerService', function($scope,headerService) {
    
	$scope.init = function(){
		$scope.orderId = headerService.sessionGet('orderId');
	}
	
}]);