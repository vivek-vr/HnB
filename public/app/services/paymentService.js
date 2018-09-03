hbiApp.factory('paymentService', function($http) { 
    return {

    getPaymentSession: function (paymentInput) { 
				  return $http({
						method: 'POST',
                        url: "https://checkout-test.adyen.com/v32/paymentSession",
                        data: paymentInput,
						headers: {
                            "X-API-Key": "AQEfhmfuXNWTK0Qc+iSesFABe1h8Cxd32qLHGNBZ+MzNyhDBXVsNvuR83LVYjEgiTGAH-+JQpLkHSDmliqvoYb33/PwvkQ8anUgghE9YykxS+Rlk=-GLKj7HYgxLgjN2d5",
                            "Content-Type": "application/json"
						},
						complete: function() {
							console.log('done');
						}
					})
    }
  };
});
