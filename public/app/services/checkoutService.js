hbiApp.factory('checkoutService', function($http, headerService,productlistService, $q) {
	return {
		setShipment: function (cartId,shipmentData) {
			return $http({
			  method: 'POST',
			  url: "https://api.sphere.io/hnb-59/carts/"+cartId,
			  data:shipmentData,
			  headers: {
				  "Authorization": headerService.sessionGet("configData").header
			  },
			  complete: function() {
				  console.log('done');
			  }
		  })
		},
		createPayment: function (paymentData) {
			return $http({
			  method: 'POST',
			  url: "https://api.sphere.io/hnb-59/payments",
			  data:paymentData,
			  headers: {
				  "Authorization": headerService.sessionGet("configData").header
			  },
			  complete: function() {
				  console.log('done');
			  }
		  })
		},
		addPayment: function (cartId,paymentData) {
			return $http({
			  method: 'POST',
			  url: "https://api.sphere.io/hnb-59/carts/"+cartId,
			  data:paymentData,
			  headers: {
				  "Authorization": headerService.sessionGet("configData").header
			  },
			  complete: function() {
				  console.log('done');
			  }
		  })
		},
		placeOrder: function (orderData) {
			return $http({
			  method: 'POST',
			  url: "https://api.sphere.io/hnb-59/orders",
			  data:orderData,
			  headers: {
				  "Authorization": headerService.sessionGet("configData").header
			  },
			  complete: function() {
				  console.log('done');
			  }
		  })
		}
	}
	
});

