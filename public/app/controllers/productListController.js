hbiApp.controller('productListController', ['$scope','$http', 'productlistService','$stateParams', 'headerService','cartService','$timeout', function($scope, $http, productlistService,$stateParams, headerService, cartService, $timeout) {
	
	$scope.init = function(){
		var categoryId = headerService.sessionGet('categoryId');
		if(categoryId == null) { categoryId = '1a925ebe-77fe-4bf3-abc9-676fe1b64df1';}
		// productlistService.getProducts($stateParams.categoryId)  // get all products based on category
		productlistService.getProducts(categoryId)
		.then(function(response) {
			$scope.products = response.data.results;
			console.log("$scope.products");
			console.log($scope.products);
			$scope.setPageCount(response);
		});
	}
	
	$scope.facetCompleteData = [];
	
	$scope.ProductFacets = function(facets){	
		$scope.facetCompleteData=productlistService.renderFacets(facets);	
			 
			console.log($scope.facetCompleteData);
		
	}
	
	$scope.productDataToggle = function(term){	
		$scope.facetCompleteData = productlistService.dataToggle(term , $scope.facetCompleteData);	
			 
			console.log($scope.facetCompleteData);
		
	}
	
	$scope.onProductSort = function(sortOption){
		//console.log('Sorting Item selected : ',sortOption);
		var sortType = "";
		switch (sortOption) {
            case 'sort_low-high' :
				sortType = "price%20asc";
                break;
            case 'sort_high-low':
				sortType = "price%20desc";
				break;
			case 'sort_a-to-z' :
				sortType = "name.en%20asc";
                break;
            case 'sort_z-to-a':
				sortType = "name.en%20desc";
				break;
			case 'sort_ratings':
				sortType = "reviewRatingStatistics.highestRating%20asc";
				break;
			case 'popularity':
				sortType = "popularity";
				break;
				
            default:

		}
		if(sortType == "popularity"){
			productlistService.getProducts($stateParams.categoryId)  // get all products based on category
			.then(function(response) {
				$scope.products = response.data.results;
				$scope.setPageCount(response);
			});	
		} else {
			productlistService.getSortedProducts($stateParams.categoryId, sortType)  // get all sorted products based on category
			.then(function(response) {
				$scope.products = response.data.results;
				$scope.setPageCount(response);
			});
		}
		
	}
	
	$scope.setProduct = function(id) {
		headerService.sessionSet("productId",id);
	}
	
	$scope.setPageCount = function(productList){
		$scope.totalProducts = productList.data.total;
		$scope.countOfProducts = productList.data.count;
		$scope.items = parseInt($scope.countOfProducts/20);
		$scope.steps = [];
		if($scope.items == 0){
			$scope.steps.push("All");
		} else{
			for(var i=1;i<=$scope.items;i++) {
				$scope.steps.push(i*20);
			}
		}
	}
	
	$scope.quickAdd = function(action, product,varient,quantity){
                                var cart = {};
                                var cust = {}
                                cartService.cartActions(action, product,varient,quantity).then(function(response) {
                                                                cart.id = response.data.id;
                                                                cart.version = response.data.version;
                                                                headerService.sessionSet('cart', cart);
                                                                cust.id = response.data.customerId;
                                                                headerService.sessionSet('customer', cust);
                                                                product.addedSuccessfully = true;
                                                                $timeout( function(){
                                                                                product.addedSuccessfully = false;
                                                                }, 3000 );
                                                });                           
                }
		
		
}]);
