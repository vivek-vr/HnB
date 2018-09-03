hbiApp.controller('checkoutController', ['$scope','$http','$state','$rootScope', function($scope, $http, $state,$rootScope) {
	
	$scope.emailFlag=true;
	$scope.btn_text="Enter email address";

	$scope.validate=function(){
		//console.log($scope.emailAddress);
		if($scope.emailAddress.length>0){
			$scope.emailFlag=false;
			$scope.btn_text="Continue";
		}
	}
	
	$scope.openWindow=function(){
		$("#js-welcome-guest").removeClass("hidden");
		$("#js-welcome-email-submit").addClass("hidden");
	}
	
	$scope.changeSection=function(value){
		console.log(value)
		if(value==="Yes"){
			$("#js-welcome-create-account").removeClass("hidden");
			$("#IAgree").removeClass("hidden");
			$("#js-welcome-create-account-submit").removeClass("hidden");
			$("#js-welcome-guest-submit").addClass("hidden");
		}else if(value==="No"){
			$("#js-welcome-create-account").addClass("hidden");
			$("#IAgree").addClass("hidden");
			$("#js-welcome-create-account-submit").addClass("hidden");			
			$("#js-welcome-guest-submit").removeClass("hidden");
		}
	}
	
	$scope.continueAsGuest=function(){
		$("#welcome").toggleClass("completed");	
		if($("#welcome").hasClass("completed")){			
			$("#deliveryContent").removeClass("hidden");
		}else if(!($("#welcome").hasClass("completed"))){
			$("#delivery").addClass("completed");
		}			
	}
	
	$scope.toggleDelivery=function(){
		if($("#delivery").hasClass("completed")){			
			$("#welcome").addClass("completed");
			$("#delivery").removeClass("completed");
			$("#collectionMethod").addClass("hidden");
			$("#deliveryMethod").addClass("hidden");
		}else if(!($("#welcome").hasClass("completed"))){
			$("#welcome").removeClass("completed");
			$("#delivery").addClass("completed");
		}
	}
	
	$scope.toggleDeliveryMethod=function(data){
		if(data==="Collection"){
			$("#collectionMethod").removeClass("hidden");
			$("#deliveryMethod").addClass("hidden");
		}else if(data==="Delivery"){
			$("#collectionMethod").addClass("hidden");
			$("#deliveryMethod").removeClass("hidden");
		}
	}
	
	$scope.pincode=true;
	$scope.checkPincode=function(){
		if($scope.postCodeValue!=="" ||$scope.postCodeValue!==null || $scope.postCodeValue!==undefined){
			$scope.pincode=false;
		}else{
			$scope.pincode=true;
		}
	}
	$scope.deliveryChooseButton=true;
	$scope.deliveryMessage="Enter delivery details";
	$scope.findAddress=function(){
		$("#addressDetails").removeClass("hidden");
	}
 
	$scope.showAddressInfo=function(){
		$("#AddressInfo").removeClass("hidden");
		$("#phoneNumber").removeClass("hidden");
	}
	
	$scope.checkPhone=function(){
		if($scope.phoneNumberValue!=="" ||$scope.phoneNumberValue!==null || $scope.phoneNumberValue!==undefined){
			$scope.deliveryChooseButton=false;
			$scope.deliveryMessage="Choose Delivery";
		}else{
			$scope.deliveryChooseButton=true;
			$scope.deliveryMessage="Enter delivery details";			
		}
	}
	
	$scope.toggleAddressSection=function(data){
		if(data==="continueToPayment"){
			$("#continueToPayment").removeClass("hidden");
			$("#addressSection").addClass("hidden");
		}else{
			$("#continueToPayment").addClass("hidden");
			$("#addressSection").removeClass("hidden");
		}
	}
	
	$scope.goToBilling=function(data){				
		if(data==="billing"){
			$("#delivery").removeClass("completed");
			$("#billing").addClass("completed");
		}else if(data==="Delivery"){
			$("#delivery").addClass("completed");
			$("#billing").removeClass("completed");
		}
	}
}])

