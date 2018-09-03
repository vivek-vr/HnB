hbiApp.factory('cartService', function($http, headerService,productlistService, $q) {
	return {
		cartActions: function (action, productId,varient,quantity) {
			this.initCart();
			var cart = headerService.sessionGet('cart');
			var input = {};
			input.version = cart.version;
			var actions = [];
			var lineActions = {};
			lineActions.action = action;
			lineActions.productId = productId;
			lineActions.variantId = varient;
			lineActions.quantity = quantity;
			actions.push(lineActions);
			input.actions = actions;
			productlistService.cartActions(cart,input).then(function(response) {
				cart.id = response.data.id;
				cart.version = response.data.version;
				headerService.sessionSet('cart', cart);
			});
		},
		initCart: function () {
			var cart = headerService.sessionGet('cart');
			if (!cart || Object.keys(cart).length == 0) {
				this.createCart();
			}
		},
		createCart: function() {
			var data = {};
			var cart = {};
			data.currency = 'GBP'; // get from header
			data.customerId = this.getCustId(); // change this to custId after login implementation
			productlistService.createCart(data).then(function(response) {
				if(response.data){
					cart.id = response.data.id;
					cart.version = response.data.version;
					headerService.sessionSet('cart', cart);
				}
				
			});
		},
		getCustId: function() {
			var customerId = "3fd76661-6529-48bf-879e-5f5e126f0d98"; // need to change this.
			return customerId;
		}
		
}
});