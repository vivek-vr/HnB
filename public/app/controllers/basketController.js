hbiApp.controller('basketController', ['$scope','$http','basketService','headerService', function($scope, $http,basketService,headerService) {
	
	$scope.init = function(){ 
		console.log("basket");
		$scope.basketItems();
	}
    
	$scope.basketItems = function() { 
	    
	    var cartId = '2ead088f-2f7b-4493-bbdd-968e0a6724eb';
        console.log("calling get cart service");
		
		basketService.getBasketDetails(cartId).then(function(response, status, headers, config) {  
		   console.log("response:"+response.data);
		   console.log("response:"+response.data);
           $scope.masterDataObj = response.data;
           console.log($scope.masterDataObj);
           $scope.setBasketData(response.data);
           $scope.recommendedProducts();
		}).catch(function(response, status, headers, config) {
		   console.log(response);	  
		})
	}
	
	$scope.setBasketData = function(basketObj) { 
		if (basketObj != null) {
			$scope.totalGrossCurrency = basketObj.totalPrice.currencyCode;
			$scope.totalGrossAmt = basketObj.totalPrice.centAmount;
			if(basketObj.totalPrice.fractionDigits != null){
				$scope.totalGrossAmt = $scope.totalGrossAmt/ (Math.pow(10,basketObj.totalPrice.fractionDigits));
			}
			
		}
		
	}
	
}]);