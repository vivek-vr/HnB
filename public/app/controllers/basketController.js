hbiApp.controller('basketController', ['$scope','$http','$timeout','$rootScope','basketService','headerService','productlistService','cartService','$state',  function($scope, $http,$timeout,$rootScope,basketService,headerService,productlistService,cartService,$state) {
	
	$scope.init = function(){ 
		console.log("basket");
		$scope.basketItems();
	}
    
	$scope.basketItems = function() { 
	    
	    //var cartId = '2ead088f-2f7b-4493-bbdd-968e0a6724eb';
		var cart = headerService.sessionGet('cart');
		console.log("calling get cart service:"+cart);
		var cartId = cart.id;
		$scope.cartVersion = cart.version;
        console.log("calling get cartid service:"+cartId);
		
		basketService.getBasketDetails(cartId).then(function(response, status, headers, config) {  
		   console.log("response:"+response.data);
		   
           $scope.masterDataObj = response.data;
           console.log($scope.masterDataObj);
		   $scope.cartVersion = $scope.masterDataObj.version;
		   cart.version = $scope.masterDataObj.version;;
		   headerService.sessionSet('cart',cart);
           $scope.setBasketData(response.data);
		   $rootScope.$broadcast("updateBacket",response.data);
           $scope.recommendedProducts();
		}).catch(function(response, status, headers, config) {
		   console.log(response);	  
		})
	}
	
	$scope.gotoCheckout = function(){ 
		console.log("gotoCheckout");
		$state.go("checkout");	
	}
	
	$scope.setBasketData = function(basketObj) { 
		if (basketObj != null) {
			$scope.lineitems = [];
			var i=0;
			$scope.totalDiscountAmt = 0;
			angular.forEach(basketObj.lineItems, function(lineItemData){
				$scope.lineItem = {};
				$scope.lineItem.lineItemId = lineItemData.id;
				$scope.lineItem.productId = lineItemData.productId;
				var lang=headerService.sessionGet('Language');
				$scope.lang = lang;
				$scope.lineItem.productNameEn = lineItemData.name[lang];
				//$scope.lineItem.productNameSv = lineItemData.name.sv;
				$scope.lineItem.quantity = lineItemData.quantity;
				$scope.lineItem.image=lineItemData.variant.images[0].url;
				$scope.lineItem.discountAmt = 0;
				$scope.lineItem.discountCurrency = '£';
				var discountedPrice = lineItemData.discountedPrice;
				if(discountedPrice != null){
					if(discountedPrice.includedDiscounts !=null){
						angular.forEach(discountedPrice.includedDiscounts, function(discounts){
							discountedPrice = discounts.discountedAmount.centAmount/100;
							$scope.lineItem.discountAmt = $scope.lineItem.discountAmt + discountedPrice;
						});
					}
				}
				$scope.totalDiscountAmt = $scope.totalDiscountAmt + $scope.lineItem.discountAmt;
				console.log("$scope.lineItem.image::"+$scope.lineItem.image);
				$scope.lineItem.priceAmt = lineItemData.totalPrice.centAmount;
				if(lineItemData.totalPrice.fractionDigits != null){
					$scope.lineItem.priceAmt = $scope.lineItem.priceAmt/ (Math.pow(10,lineItemData.totalPrice.fractionDigits));
				}
				$scope.lineItem.currencyCode = '£';
				if(lineItemData.totalPrice.currencyCode == 'SEK')
				{
					$scope.lineItem.currencyCode = 'kr';
				}
				$scope.lineitems[i]=$scope.lineItem;
				i++;
			});
		
			$scope.totalGrossCurrency = '£';
			if(basketObj.totalPrice.currencyCode == 'SEK'){
				$scope.totalGrossCurrency = 'kr';
			}
			$scope.totalGrossAmt = basketObj.totalPrice.centAmount;
			if(basketObj.totalPrice.fractionDigits != null){
				$scope.totalGrossAmt = $scope.totalGrossAmt/ (Math.pow(10,basketObj.totalPrice.fractionDigits));
			}
			$scope.subTotalAmt=$scope.totalGrossAmt;
			$scope.deliveryAmt=0;
			
		}
		
	}
	
	$scope.addDiscount = function(cartDiscountCode) {
		var cart = headerService.sessionGet('cart');
		console.log("calling get cart service:"+cart);
		var cartId = cart.id;
		$scope.cartVersion = cart.version;
		var data={};
		data.version = cart.version;
		data.actions=[];
		var actionDetails={};
		actionDetails.action="addDiscountCode";
		actionDetails.code=cartDiscountCode;
		data.actions[0]=actionDetails;
		basketService.addDiscount(cartId, data)  // add discount
		.then(function(response) {
			$scope.masterDataObj = response.data;
           console.log($scope.masterDataObj);
		   $scope.cartVersion = $scope.masterDataObj.version;
		   cart.version = $scope.masterDataObj.version;
		   headerService.sessionSet('cart',cart);
           $scope.setBasketData(response.data);
		   $rootScope.$broadcast("updateBacket",response.data);
		   alert("Promotional code Autumn Sale Coupon applied successfully");
          // $scope.recommendedProducts();
			
		});
	}
	
	$scope.updateCart = function(action, lineItemId,quantity){
		
		var cart = headerService.sessionGet('cart');
		console.log("calling get cart service:"+cart);
		
		basketService.updateItemQty(action, lineItemId,quantity).then(function(response) {
			$scope.cartVersion = response.data.version;
		    cart.version = response.data.version;
			$rootScope.$broadcast("updateBacket",response.data);
		    headerService.sessionSet('cart',response.data);
            $scope.setBasketData(response.data);
			$timeout( function(){
				console.log("Timeout Error");
				//alert("Oops.Unable to process your request. Please try again.");
			}, 3000 );
			});                           
	}
	
	$scope.recommendedProducts = function() {
		var categoryId = headerService.sessionGet('categoryId');
		productlistService.getProducts(categoryId)  // get all products based on category
		.then(function(response) {
			$scope.products = response.data.results;
			console.log("$scope.products");
			console.log($scope.products);
		});
	}
	
}]);