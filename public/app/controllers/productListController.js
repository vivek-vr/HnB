hbiApp.controller('productListController', ['$scope','$http', 'productlistService','$stateParams', 'headerService','cartService','$timeout','$rootScope', function($scope, $http, productlistService,$stateParams, headerService, cartService, $timeout,$rootScope) {
	
	$scope.init = function(){
		var categoryId = headerService.sessionGet('categoryId');
	    var lang=headerService.sessionGet('Language');
		$scope.lang = lang;
		var currency=headerService.sessionGet('Currency');
		$scope.currency = currency; 
		console.log(lang);console.log(currency);
		if(categoryId == null) { categoryId = '1a925ebe-77fe-4bf3-abc9-676fe1b64df1';}
		// productlistService.getProducts($stateParams.categoryId)  // get all products based on category
		productlistService.getProducts(categoryId)
		.then(function(response) {
			$scope.products = response.data.results;
			$scope.facets=response.data.facets;
			$scope.setPageCount(response);
			$scope.ProductFacets($scope.facets);
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
		cartService.cartActions(action, product.id,varient,quantity).then(function(response) {
			headerService.sessionSet('cart', response.data);
			cust.id = response.data.customerId;
			headerService.sessionSet('customer', cust);
			product.addedSuccessfully = true;
			//$('.js-header-basket-link').find('.price').html(' £'+(response.data.totalPrice.centAmount)/100+' ');
			//$('.at-basket-menu-qty').html(' '+response.data.lineItems.length+' ');
			$rootScope.$broadcast("updateBacket",response.data.lineItems);			
			$timeout( function(){
				product.addedSuccessfully = false;
			}, 3000 );
			});                           
	}
		
		
}]);
