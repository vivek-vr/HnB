var hbiApp = angular.module('HBIapp', ['ui.router', 'ngSanitize']);

hbiApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
			views: {
				'' : { templateUrl: 'views/home.html' },
				'advice@home' : { templateUrl: 'views/childviews/home-advice.html' }
			}
            
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
			views: {
				'' : { templateUrl: 'views/basket.html' },
				'basketitems@basket' : { templateUrl: 'views/childviews/basketitems.html' }
			}
                 
        })
		

});

hbiApp
  // allow DI for use in controllers, unit tests
  .constant('_', window._)
  // use in views, ng-repeat="x in _.range(3)"
  .run(function ($rootScope) {
     $rootScope._ = window._;
  });