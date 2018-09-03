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
	getSortedProducts: function (categoryId, sortType) { 
		return $http({
			  method: 'GET',
			  url: "https://api.sphere.io/hnb-59/product-projections/search?filter=categories.id: subtree(\""+categoryId+"\")&sort="+sortType,
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
    },
	createCart: function (data) { 
				  return $http({
						method: 'POST',
						url: "https://api.sphere.io/hnb-59/carts",
						//params: '{"currency":"'+currency+'","customerId":"'+customerId+'}',
						data: data,
						headers: {
							"Content-Type": "application/json",
							"Authorization": headerService.sessionGet("configData").header
						},
						complete: function() {
							console.log('done');
						}
					})
    },
	cartActions: function (cart, input) {
				  return $http({
						method: 'POST',
						url: "https://api.sphere.io/hnb-59/carts/" + cart.id,
						data: input,
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