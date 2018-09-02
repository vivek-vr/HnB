hbiApp.controller('headerController', ['$scope', 'productlistService','headerService', function($scope, productlistService,headerService) {
    
	$scope.init = function(){
		setAuthorizationCode();
		var finalItemsList = [];
		var outputList = [];
		var parentLevelList = [];
		var firstLevelList = [];
		var secondLevelList = [];
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
		
	})
	}
	
	$scope.isObjectEmpty = function(card){
	   return Object.keys(card).length === 0;
	}
	
	function setAuthorizationCode(){
		headerService.setAuthCode().then(function mySuccess(response) {
			var configData = {};
			configData.header = "Bearer "+response.data.access_token;
			headerService.sessionSet("configData",configData);
		});;
	}
	
	$scope.setCategory = function(id) {
		headerService.sessionSet("categoryId",id);
	}
}]);
