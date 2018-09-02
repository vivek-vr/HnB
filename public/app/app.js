var hbiApp = angular.module('HBIapp', ['ui.router', 'ngSanitize']);

hbiApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'views/home.html'
        })
        .state('productlist', {
            url: '/product-list',
			params: { categoryId: null },
            templateUrl: 'views/product-list.html'       
        })
		.state('productdetail', {
            url: '/product-detail',
			params: { productId: null },
            templateUrl: 'views/product-detail.html'       
        })
		.state('checkout', {
            url: '/checkout',
			params: {  },
            templateUrl: 'views/checkout.html'       
        })
		.state('basket', {
            url: '/basket',			
            templateUrl: 'views/basket.html'       
        })
		

});
