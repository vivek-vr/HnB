hbiApp.factory('basketService', function($http, headerService,productlistService) { 
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
    },
	
	updateItemQty: function (action, lineItemId,quantity) {
			
			var cart = headerService.sessionGet('cart');
			var input = {};
			input.version = cart.version;
			var actions = [];
			var lineActions = {};
			lineActions.action = action;
			lineActions.lineItemId = lineItemId;
			if(action != 'removeLineItem'){
				console.log("Quantity is optional for removing line items");
				lineActions.quantity = quantity;
			}
			actions.push(lineActions);
			input.actions = actions;
			return productlistService.cartActions(cart,input);
		},
	
  };
});
