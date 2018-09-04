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
    },
	
	addDiscount: function (cartId, data) { 
	console.log("adddiscount "+data);
				  return $http({
						method: 'POST',
						url: "https://api.sphere.io/hnb-59/carts/" + cartId,
						data: data,
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
