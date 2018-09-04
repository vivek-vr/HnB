hbiApp.factory('productlistService', function($http, headerService) { 
    return {

    getProducts: function (categoryId) { 
				  return $http({
						method: 'GET',
						url: "https://api.sphere.io/hnb-59/product-projections/search?filter=categories.id: subtree(\""+categoryId+"\")&facet=variants.attributes.flavour&facet=variants.attributes.unitName",
						headers: {
							"Authorization": headerService.sessionGet("configData").header
						},
						complete: function() {
							console.log('done');
						}
					})
    },
	getSortedProducts: function (categoryId, sortType) { 
		return $http({
			  method: 'GET',
			  url: "https://api.sphere.io/hnb-59/product-projections/search?filter=categories.id: subtree(\""+categoryId+"\")&sort="+sortType,
			  headers: {
				  "Authorization": headerService.sessionGet("configData").header
			  },
			  complete: function() {
				  console.log('done');
			  }
		  })
},
	    getSearchProductsList: function (searchkey) { 
		return $http({
			  method: 'GET',
			  url: "https://api.sphere.io/hnb-59/product-projections/search?"+searchkey+".en=Holland&facet=variants.attributes.flavour&facet=variants.attributes.unitName",
			  headers: {
				  "Authorization": headerService.sessionGet("configData").header
			  },
			  complete: function() {
				  console.log('done');
			  }
		  })
	},
	getCategories: function () {
				  return $http({
						method: 'GET',
						url: "https://api.sphere.io/hnb-59/categories?expand=true&limit=200",
						headers: {
							"Authorization": headerService.sessionGet("configData").header
						},
						complete: function() {
							console.log('done');
						}
					})
    },
	createCart: function (data) { 
				  return $http({
						method: 'POST',
						url: "https://api.sphere.io/hnb-59/carts",
						//params: '{"currency":"'+currency+'","customerId":"'+customerId+'}',
						data: data,
						headers: {
							"Content-Type": "application/json",
							"Authorization": headerService.sessionGet("configData").header
						},
						complete: function() {
							console.log('done');
						}
					})
    },
	cartActions: function (cart, input) {
				  return $http({
						method: 'POST',
						url: "https://api.sphere.io/hnb-59/carts/" + cart.id,
						data: input,
						headers: {
							"Authorization": headerService.sessionGet("configData").header
						},
						complete: function() {
							console.log('done');
						}
					})
    },
	    renderFacets: function(facets){
		console.log(facets);
		var facetCompleteData=[];	
		var facetsDataTitle=[];
		var dataCount=[];
		var facetsData=$.map(facets,function(value,index){
			var title=index.split('.');
			facetsDataTitle.push(title[(title.length)-1]);
			return value;
		})
		
		console.log("+++++"+facetsData);		
		var i;
		for(i=0;i<facetsData.length;i++){
			var temp=[];
			var tempObj={};
			var title=facetsDataTitle[i];
			temp.push(facetsDataTitle[i]);
			temp.push(facetsData[i]);
			temp.push({count:5,buttonText:"Show More..."});
			facetCompleteData.push(temp);
			dataCount.push(tempObj);
		}
		return facetCompleteData;
		//console.log(facetCompleteData);	
		//console.log(dataCount);		
	},
	
	dataToggle:function (term,facetCompleteData){
		console.log(term);
		console.log(facetCompleteData);
		angular.forEach(facetCompleteData,function(facet){
			if(facet[0]===term){
				if(facet[2].count==5){
					facet[2].count=facet[1].length;
					facet[2].buttonText="Show Less...";					
				}else {
					facet[2].count=5;	
					facet[2].buttonText="Show More...";	
				}
			}
			
		});
		return facetCompleteData;
	}
  };
});
