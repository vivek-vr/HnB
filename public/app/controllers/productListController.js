hbiApp.controller('productListController', ['$scope','$http', 'productlistService','$stateParams', 'headerService', function($scope, $http, productlistService,$stateParams, headerService) {
	
	$scope.init = function(){
		var categoryId = headerService.sessionGet('categoryId');
		// productlistService.getProducts($stateParams.categoryId)  // get all products based on category
		productlistService.getProducts(categoryId)
		.then(function(response) {
			$scope.products = response.data.results;
			console.log("$scope.products");
			console.log($scope.products);
		});
	}
	$scope.setProduct = function(id) {
		headerService.sessionSet("productId",id);
	}
    
}]);