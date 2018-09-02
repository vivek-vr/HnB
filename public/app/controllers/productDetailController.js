hbiApp.controller('productDetailController', ['$scope', '$http', '$q', '$state', 'productlistService', '$stateParams' , 'productdetailService', 'headerService' , function($scope, $http, $q, $state, productlistService, $stateParams, productdetailService, headerService) {
	
	$scope.init = function(){ 
		console.log("Product Details");
	}
	//console.log($stateParams);
	$scope.productDetail = function() { 
	    // var productId = $stateParams.productId;
	    var productId = headerService.sessionGet('productId');
        $state.go("product-detail");	
		productdetailService.getProductsById(productId).then(function(response, status, headers, config) {         
           $scope.masterDataObj = response.data.masterData.current;
           console.log($scope.masterDataObj);
           $scope.setProductData($scope.masterDataObj);
           $scope.recommendedProducts();
		}).catch(function(response, status, headers, config) {
		   console.log(response);	  
		})
	}
	
	$scope.setProductData = function(productObj) { 
		if (productObj.masterVariant.attributes) {
			angular.forEach(productObj.masterVariant.attributes, function(item, key){
				if ('points' === item.name) {
					$scope.points = item.value;
				}
				if ('pricePerUOM' === item.name) {
					$scope.pricePerUOM = item.value;
				}
				if ('Size' === item.name) {
					$scope.size = item.value;
				}
			});
		}
		if (productObj.masterVariant.sku) {
			$scope.sku = productObj.masterVariant.sku.replace('sku_', '');
		}
	}
	
	$scope.addToBag = function() { 
		$state.go("checkout");
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