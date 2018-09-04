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
			return productlistService.cartActions(cart,input);
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
			var custId = this.getCustId(); 
			if(custId != null){
			  data.customerId =custId			
			}
			productlistService.createCart(data).then(function(response) {
				if(response.data){
					cart.id = response.data.id;
					cart.version = response.data.version;
					headerService.sessionSet('cart', cart);
					var cust = {};
					cust.id = response.data.customerId;
					headerService.sessionSet('customer', cust);
				}
				
			});
		},
		getCustId: function() {
			var customer = headerService.sessionGet('customer');
			return customer == null?null:customer.id;
		}
		
}
});