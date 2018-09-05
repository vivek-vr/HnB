hbiApp.controller('productDetailController', ['$scope', '$http', '$q', '$state', 'productlistService', '$stateParams' , 'productdetailService', 'headerService' ,'cartService','_','$rootScope','$timeout', function($scope, $http, $q, $state, productlistService, $stateParams, productdetailService, headerService, cartService, _,$rootScope,$timeout) {
	
	$scope.init = function(){ 
		console.log("Product Details");
		var lang=headerService.sessionGet('Language');
		$scope.lang = lang;
		var currency=headerService.sessionGet('Currency');
		$scope.currency = currency;
		$scope.productDetail();
	}
	//console.log($stateParams);
	$scope.productDetail = function() { 
	    // var productId = $stateParams.productId;
	    var productId = headerService.sessionGet('productId');
        $state.go("product-detail");	
		productdetailService.getProductsById(productId).then(function(response, status, headers, config) {      
		   $scope.productDetails = response.data;		
           $scope.masterDataObj = response.data.masterData.current;
           $scope.setProductData($scope.masterDataObj);
           $scope.recommendedProducts();
		   $scope.flavours = buildFlavour(response.data);
		   $scope.added = true;
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
	
	function buildFlavour(data){
		var isValid = checkGraph(data,'masterData.current.masterVariant.attributes');
		var flavourObj = [];
		if(isValid){
			if(data.masterData.current.masterVariant.attributes[0].name == "flavour" ){
				flavourObj[0] = {};
				flavourObj[0].name = data.masterData.current.masterVariant.attributes[0].value;
				flavourObj[0].value = data.masterData.current.masterVariant.id;
			}
		}
		if(checkGraph(data,'masterData.current.variants')){
			_.forEach(data.masterData.current.variants, function(element, i) {
			  var varientObj = {};
			  if(element.attributes[0] != "undefined"){
				  varientObj.name = element.attributes[0].value;
				  varientObj.value = element.id;
				  flavourObj.push(varientObj);
			  }
			});
		}
		return flavourObj;
	}
	
	function checkGraph(obj, graphPath) {
    if (obj) {
	  var isValid = true;
      let root = obj;
      _.each(graphPath.split('.'), part => {
        if (root[part]) {
          root = root[part];
        } else {
          isValid = false;
        }
      });
      return isValid;
    }
  }
	

	$scope.addToBag = function(action,product) { 
		var variantid = $('.form-control.width50per').find('option:selected').val();
		var qty = $('.in-qty-control.noKeyUpValidation.input-quantity-selectbox.validated-inline').val();
		cartService.cartActions(action, product,typeof variantid != 'undefined'?parseInt(variantid):1,
		typeof qty != 'undefined'?parseInt(qty):1);
	}
	
	$rootScope.$on("updateBacket", function(evt,data){ 
		$scope.added = false;
		$timeout( function(){
			$scope.added = true;
		}, 3000 );
	});

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