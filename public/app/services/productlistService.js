hbiApp.factory('productlistService', function($http, headerService) { 
    return {

    getProducts: function (categoryId) { 
				  return $http({
						method: 'GET',
						url: "https://api.sphere.io/hnb-59/product-projections/search?filter=categories.id: subtree(\""+categoryId+"\")",
						headers: {
							"Authorization": headerService.sessionGet("configData").header
						},
						complete: function() {
							console.log('done');
						}
					})
    },
	getCategories: function () {
				  return $http({
						method: 'GET',
						url: "https://api.sphere.io/hnb-59/categories?expand=true&limit=200",
						headers: {
							"Authorization": headerService.sessionGet("configData").header
						},
						complete: function() {
							console.log('done');
						}
					})
    }
  };
});
