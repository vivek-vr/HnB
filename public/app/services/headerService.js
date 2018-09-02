hbiApp.factory('headerService', function($http) {
	    return {
		setAuthCode: function () {
						return $http({
						method: 'POST',
						url: "https://auth.sphere.io/oauth/token?grant_type=client_credentials&scope=manage_project:hnb-59",
						headers: {
							"Authorization": "Basic " + btoa('BWCBzuf58CcFOpBIpmjDHYN3:n5ZJ1p0ioXhRNcdWxGslvJ1dtWb8FR7M')
						},
						complete: function() {
							console.log('done');
						}
					})
		},
		sessionSet: function (key, value) {
			var itemToStore =  JSON.stringify(value);
			sessionStorage.setItem(key, itemToStore)
		},
		sessionGet: function (key) {
			var temp = sessionStorage.getItem(key);
			if (temp) {
			return JSON.parse(temp);
			}
			return null;
		}
	  };
});


