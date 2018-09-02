hbiApp.factory('productdetailService', function($http, headerService) { 
    return {

    getProductsById: function (productId) { 
				  return $http({
						method: 'GET',
						url: "https://api.sphere.io/hnb-59/products/" + productId,
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
