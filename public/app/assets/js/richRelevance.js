function r3_context(){var R3_objects_names=["R3_ITEM","R3_CATEGORY","R3_CART","R3_ADDTOCART","R3_PURCHASED","R3_SEARCH","R3_HOME","R3_DLP","R3_ERROR","R3_MYRECS","R3_PERSONAL","R3_MERCHANDISED","R3_WISHLIST","R3_GENERIC","R3_LANDING","R3_ENSEMBLE","R3_REGISTRY","R3_ADDTOREGISTRY","R3_BRAND","R3_PROMO"];
if(typeof window["R3_COMMON"]!=="undefined"){window["R3_COMMON"].placementTypes="";
window["R3_COMMON"].categoryHintIds=""}$.each(R3_objects_names,function(i,r3_obj_name){if(typeof window[r3_obj_name]!=="undefined"){window[r3_obj_name]=undefined
}});var RR_callbacks={};var r3_context={RR_callback:RR_callbacks};function initR3Object(objectName,createObject){r3_context[objectName.toLowerCase()]=function(){if(!window[objectName]){window[objectName]=createObject()
}return window[objectName]}}initR3Object("R3_COMMON",createCommon);function createCommon(){var r3_comm=new r3_common();
r3_comm.setBaseUrl(window.RR_CONFIG.baseUrl);r3_comm.setClickthruServer(RR_CONFIG.clickthruServer);
r3_comm.setApiKey(window.RR_CONFIG.apiKey);r3_comm.setSessionId(window.RR_CONFIG.sessionId);
r3_comm.setUserId(window.RR_CONFIG.userId);if(window.RR_CONFIG.devMode){r3_comm.forceDevMode();
r3_comm.debugMode="t"}return r3_comm}$.each(R3_objects_names,function(i,r3_obj_name){initR3Object(r3_obj_name,createR3Object);
function createR3Object(){return new window[r3_obj_name.toLowerCase()]()}});r3_context.r3_common();
r3_context.addPlacementType=function(placement,callback){var placementHolder=$("[data-rr-placement='"+placement+"']");
if(placementHolder.length===0){placement=placement.split(".")[0]}if(RR_callbacks[placement]){return r3_context
}r3_context.r3_common().addPlacementType(placement);RR_callbacks[placement]=callback;
return r3_context};r3_context.r3=function(){window.RR.jsonCallback=function(){var commonPlacements=window.RR.data.JSON;
$.each(commonPlacements,function(i,placements){$.each(placements,function(i,placement){if(placement===undefined){return
}callback=RR_callbacks[placement.placement_name];if(typeof(callback)==="function"){callback(placement)
}})})};rr_flush_onload();window.r3()};return r3_context}function placementRenderer(placement){var template=$.templates('[data-rr-template="'+placement.placement_name+'"]');
var content=template.render(placement);var contentHolder=$('[data-rr-placement="'+placement.placement_name+'"]');
contentHolder.html(content);$(contentHolder).each(function(){if($(this).parents(".rr-enabled").length){richRelevanceCarouselPdpVertical($(this).find(".js-rr-product-carousel"))
}else{richRelevanceCarousel($(this).find(".js-rr-product-carousel"))}});addClickTracking(contentHolder.find("a.js-product-link"))
}function addClickTracking(productsLinks){var clickTracking=function(ref,callback){$.ajax({beforeSend:function(){setTimeout(callback,3000)
},url:ref.data("rr-click-tracking-url"),complete:callback})};productsLinks.on("click contextmenu",function(event){var ref=$(this);
var isModKey=event.shiftKey||event.ctrlKey||event.altKey||event.metaKey;if(event.which==1&&!isModKey){event.preventDefault();
clickTracking(ref,function(){window.location.assign(ref.attr("href"))})}else{if(event.which!=2){clickTracking(ref)
}}});productsLinks.on("mousedown",function(event){if(event.which==2){clickTracking($(this))
}})};