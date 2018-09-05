hbiApp.factory('cartService', function($http, headerService,productlistService, $q, $rootScope,$timeout) {
	return {
		cartActions: function (action, product,varient,quantity) {
			this.initCart(action, product,varient,quantity,this);			
		},
		triggerCartAction: function (cart, action, product,varient,quantity) {
			var input = {};
			input.version = cart.version;
			var actions = [];
			var lineActions = {};
			lineActions.action = action;
			lineActions.productId = product.id;
			lineActions.variantId = varient;
			lineActions.quantity = quantity;
			actions.push(lineActions);
			input.actions = actions;
			return productlistService.cartActions(cart,input);
		},
		initCart: function (action, product,varient,quantity,initialThis) {
			var cart = headerService.sessionGet('cart');
			if (!cart || Object.keys(cart).length == 0) {
				var cart ={};
				this.createCart().then(function(response) {
				if(response.data){
					cart.id = response.data.id;
					cart.version = response.data.version;
					headerService.sessionSet('cart', cart);
					initialThis.triggerCartAction(cart,action, product,varient,quantity).then(function(response) {
						headerService.sessionSet('cart', response.data);
						var broadcastObj={}
						broadcastObj.response = response.data;
						broadcastObj.product = product;
						$rootScope.$broadcast("updateBacket",broadcastObj);
					}); 
				}				
			});
			}else{
				this.triggerCartAction(cart,action, product,varient,quantity).then(function(response) { 
						headerService.sessionSet('cart', response.data);
						var broadcastObj={}
						broadcastObj.response = response.data;
						broadcastObj.product = product;
						$rootScope.$broadcast("updateBacket",broadcastObj);		
					});
			}
		},
		createCart: function() {
			var data = {};
			var cart = {};
			var currency = headerService.sessionGet('Currency');
			currency = currency== 'kr' ? 'SEK': 'GBP'
			data.currency = currency; 
			var custId = this.getCustId(); 
			if(custId != null){
			  data.customerId =custId			
			}
			return productlistService.createCart(data);
		},
		getCustId: function() {
			var customer = headerService.sessionGet('customer');
			return customer == null?null:customer.id;
		}
		
}
});