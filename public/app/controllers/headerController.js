hbiApp.controller('headerController', ['$scope', '$state','$http', 'productlistService','$rootScope','headerService', function($scope, $state, $http, productlistService, $rootScope ,headerService) {
    
 $scope.init = function(){
	 
	var cartData = headerService.sessionGet('cart');
	$scope.itemCount = 0;	
	$scope.itemPrice = 0;
	if(cartData){
		$scope.itemCount = Object.keys(cartData.lineItems).length;
		$scope.itemPrice = cartData.totalPrice.centAmount/100;
	}
	  setAuthorizationCode().then(function mySuccess(response) {
	   var configData = {};
	   configData.header = "Bearer "+response.data.access_token;
	   headerService.sessionSet("configData",configData);
	   $scope.lang = headerService.sessionGet('Language'); 
		  $scope.currency = headerService.sessionGet('Currency');
	   if(headerService.sessionGet('Language')){
		$scope.lang = headerService.sessionGet('Language');    
	   }else{
		$scope.lang = "en";
	   } 
	   headerService.sessionSet("Language",$scope.lang);	   
	   if(headerService.sessionGet('Currency')){
		$scope.currency = headerService.sessionGet('Currency');    
	   }else{
		$scope.currency = "£";
	   }   
	   headerService.sessionSet("Currency",$scope.currency);
	   buildMenu();
	  });
  
 }
 
 function buildMenu(){
  var finalItemsList = [];
  var outputList = [];
  var parentLevelList = [];
  var firstLevelList = [];
  var secondLevelList = [];
  var sessionCategoryList = headerService.sessionGet("menuCategoryList");
  
  
  
  if(null != sessionCategoryList) {
   $scope.menuTree = sessionCategoryList; 
  } else {
  var categories = productlistService.getCategories()  // get all categories to list
  .then(function(response) {
   angular.forEach(response.data.results, function(item, key1) {
    if(item.ancestors.length == 0){
     parentLevelList.push(item);
    } else if(item.ancestors.length == 1){
     firstLevelList.push(item);
    }else if(item.ancestors.length == 2){
     secondLevelList.push(item);
    }
   });
   finalItemsList = parentLevelList.concat(firstLevelList).concat(secondLevelList);
   angular.forEach(finalItemsList, function(item, key1) {
    if(item.ancestors.length == 0){
     outputList.push(item);
    } else if(item.ancestors.length == 1){
     angular.forEach(item.ancestors, function(ancestor, key2) {
      angular.forEach(outputList, function(parentItem, key1) {
       if(!parentItem.children){
        parentItem.children = [];
       }
       if(ancestor.id == parentItem.id){
        parentItem.children.push(item);
       } 
              
      });
     });
    }else if(item.ancestors.length == 2){
     angular.forEach(item.ancestors, function(ancestor, key2) {
      angular.forEach(outputList, function(firstLevelItem, key3) {
       angular.forEach(firstLevelItem.children, function(secondLevelItem, key4) {
        if(!secondLevelItem.children){
         secondLevelItem.children = [];
        }
        if(ancestor.id == secondLevelItem.id){
         secondLevelItem.children.push(item);
        }              
       });
      });
     });
    }
   });
    $scope.menuTree = outputList; 
    headerService.sessionSet("menuCategoryList",outputList);
   })
  }
 }
 $scope.isObjectEmpty = function(card){
    return Object.keys(card).length === 0;
 }
 
 $rootScope.$on("updateBacket", function(evt,data){ 
	if(data.action && data.action == "clear"){
		$scope.itemCount = 0;
		$scope.itemPrice = 0; 
	}else{
		$scope.itemCount = $scope.itemCount+1;
		$scope.itemPrice = (data.response.totalPrice.centAmount)/100; 
	}
	
});
 
function setAuthorizationCode(){
	return headerService.setAuthCode();
}
 
 $scope.setCategory = function(id) {
  headerService.sessionSet("categoryId",id);
 }
 
 $scope.searchProductList =  function(searchKeyWord){
		$state.go("search");		
		productlistService.getSearchProductsList(searchKeyWord)
		.then(function(response) {			
			$rootScope.productSearchListObj = response.data.results;
			console.log($scope.productSearchListObj);
			$scope.facets=response.data.facets;
			$scope.setPageCount(response);
			$scope.ProductFacets($scope.facets);			
		});
	}
	
	$rootScope.facetSearchCompleteData = [];
	
	$scope.ProductFacets = function(facets){	
		$rootScope.facetSearchCompleteData=productlistService.renderFacets(facets);	
			 
			console.log($rootScope.facetSearchCompleteData);
		
	}
	
	$scope.productSearchDataToggle = function(term){	
		$rootScope.facetSearchCompleteData = productlistService.dataToggle(term , $rootScope.facetSearchCompleteData);	
			 
			console.log($rootScope.facetSearchCompleteData);
		
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
	
	
$scope.changeLanguage = function(lang) { 
				headerService.sessionSet("Language",lang);
				location.reload();
				}
				$scope.changeCountry = function(country) {
			headerService.sessionSet("Currency",country);
			location.reload();
			
	}
 $scope.changeCountry = function(country) {
  headerService.sessionSet("Currency",country);
  //$scope.country = country;
  location.reload();
  
 }
}]);
