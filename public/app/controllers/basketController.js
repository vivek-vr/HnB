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
			$scope.lineitems = [];
			
			angular.forEach(basketObj.lineItems, function(lineItemData){
				$scope.lineItem = {};
				$scope.lineItem.productId = lineItemData.productId;
				$scope.lineItem.productNameEn = lineItemData.name.en;
				$scope.lineItem.productNameSv = lineItemData.name.sv;
				$scope.lineItem.quantity = lineItemData.quantity;
				$scope.lineItem.image=lineItemData.variant.images[0].url;
<<<<<<< HEAD
				$scope.lineItem.priceAmt = lineItemData.price.value.centAmount;
				$scope.lineItem.currencyCode = lineItemData.price.value.currencyCode;
				$scope.lineitems.push($scope.lineItem);
=======
				console.log("$scope.lineItem.image:"+$scope.lineItem.image);
				$scope.lineItem.priceAmt = lineItemData.price.value.centAmount;
				if(lineItemData.price.value.fractionDigits != null){
					$scope.lineItem.priceAmt = $scope.lineItem.priceAmt/ (Math.pow(10,lineItemData.price.value.fractionDigits));
				}
				$scope.lineItem.currencyCode = '£';
				if(lineItemData.price.value.currencyCode == 'GBP')
				{
					$scope.lineItem.currencyCode = '£';
				}
				$scope.lineitems[i]=$scope.lineItem;
				i++;
>>>>>>> parent of 3e58450... Basket page: Fixed duplicate images & item level total price value
			});
		
			$scope.totalGrossCurrency = basketObj.totalPrice.currencyCode;
			$scope.totalGrossAmt = basketObj.totalPrice.centAmount;
			if(basketObj.totalPrice.fractionDigits != null){
				$scope.totalGrossAmt = $scope.totalGrossAmt/ (Math.pow(10,basketObj.totalPrice.fractionDigits));
			}
			$scope.subTotalAmt=$scope.totalGrossAmt;
			$scope.savingsAmt=0;
			
		}
		
	}
	
}]);