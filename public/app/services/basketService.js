hbiApp.factory('basketService', function($http, headerService) { 
    return {

    getBasketDetails: function (cartId) { 
	console.log("pulling cart details"+cartId);
	
				  return $http({
						method: 'GET',
						url: "https://api.sphere.io/hnb-59/carts/" + cartId,
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
