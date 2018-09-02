$(document).ready(function(){$("#inActive").hide();$("#inActive-update").hide();$("#active").hide();
$("#invalid-rfl-card").hide();$("#enter-login-details").hide();$("#enter-rfl-card").hide();
$("#enter-rfl-card-digits").hide();$("#invalid-rfl-card-update").hide();$("#rfl-card-exists").hide();
$("#siebel-error").hide();$("#siebel-error-update").hide();$("#rfl-card-exists-update").hide();
$("#enter-login-details-update").hide();$("#enter-rfl-card-update").hide();$("#enter-rfl-card-digits-update").hide();
$("#addAddressButton").live("click",function(){HAB.address.chooseCorrectAddressBeforeSubmit();
var options={beforeSend:function(){SFR.Utils.switchAjaxLoader()},complete:function(){SFR.Utils.switchAjaxLoader()
},success:function(data){if($(data).attr("id")=="errRspnc"){$(".form-errors").replaceWith(data);
$(".form-errors").removeClass("hdn")}else{$(".address-list").html(data);SFR.Utils.setupResponsiveTables()
}},error:function(result){console.log(result)}};$("#addAddressForm").ajaxSubmit(options)
});$("#addDeliveryAddressLink").live("click",function(){$.ajax({type:"POST",dataType:"html",url:"/my-account/includes/addAddress.jsp?isFirst=false",success:function(text){$("#addAddressDiv").html(text);
$("#addAddressDiv").trigger("domUpdated");HAB.address.initStylesUKandNED(window.addressConfig.initialCountryCode)
}});$("#addAddressDiv").show();$("#addAddressDiv").trigger("domUpdated");$("#addDeliveryAddressLink").hide();
$(".hb-form-address-remove-2").hide()});$("#cancelAddAddress").live("click",function(){$("#addAddressDiv").html("");
$("#addDeliveryAddressLink").show();$(".form-errors").html("");if(!$(".form-errors").hasClass("hdn")){$(".form-errors").addClass("hdn")
}});$(".setDefault").live("click",function(event){var address=$(this);var selectedAddress=$.trim($(this).val());
$("#setDefaultAddressKey").val(selectedAddress);var options={beforeSend:function(){SFR.Utils.switchAjaxLoader()
},complete:function(){SFR.Utils.switchAjaxLoader()},success:function(data){$("label.radio:has(.setDefault)").removeClass("checked");
address.parent().addClass("checked")},error:function(result){console.log(result)}};
$("#setProfileDefaultAddress").ajaxSubmit(options)})});$(window).load(function(){var $ogMsi=$("#og-msi");
var $ogMsiErrorBlock=$("#og-not-available-error");if($ogMsi.length&&$ogMsi.html().trim().length===0&&!$ogMsi.hasClass("ng-scope")){if($ogMsiErrorBlock.length){$ogMsiErrorBlock.show()
}}});function isActiveOrInActiveRFLCardForUpdate(){$.ajax({url:"/my-account/includes/isActiveRFLCardUpdate.jsp?rflcardId="+$("#account-rfl-number").val()+"&login="+$("#frm_registration_email").val()+"&firstName="+$("#frm_registration_firstname").val()+"&lastName="+$("#frm_registration_lastname").val()+"&middleName="+$("#frm_registration_middlename").val(),success:function(data){data=data.replace(/\&quot;/g,'"');
var obj=jQuery.parseJSON(data);$("#rflCardNumber").val(obj.cardNumber);$("#frm_registration_hidden_rflButtonFlag").val(true);
if(obj.status=="active"){$("#account-rfl-number").val(obj.cardNumber);$("#getrflvalue").html(obj.rflPoints);
$("#rfl-card-form-input").show();$("#rfl-card-form-update").hide();$("#account-rfl-number").prop("readonly",true).removeClass("validated-inline").addClass("readonly");
$("#invalid-rfl-card-update").hide();$("#enter-rfl-card-digits-update").hide();$("#enter-login-details-update").hide();
$("#siebel-error-update").hide();$("#rfl-card-exists-update").hide();$("#enter-rfl-card-update").hide()
}else{if(obj.status=="inactive"){$("#userAddressDetals").val(true);$("#inActive").show();
$("#active-update").hide()}else{if(obj.status=="addRFLCard"){$("#userAddressDetals").val(false);
$("#inActive-update").hide();$("#active-update").show();$("#rfl-card-update-form").removeClass("clearfix").addClass("text error clearfix");
$("#enter-rfl-card-update").show();$("#rfl-card-exists-update").hide();$("#siebel-error-update").hide();
$("#invalid-rfl-card-update").hide();$("#frm_registration_rflNumber").val(null);$("#account-rfl-number").val(null);
$("#enter-login-details-update").hide();$("#enter-rfl-card-digits-update").hide()
}else{if(obj.status=="login"){$("#userAddressDetals").val(false);$("#inActive-update").hide();
$("#active-update").show();$("#rfl-card-update-form").removeClass("clearfix").addClass("text error clearfix");
$("#enter-login-details-update").show();$("#invalid-rfl-card-update").hide();$("#siebel-error-update").hide();
$("#frm_registration_rflNumber").val(null);$("#account-rfl-number").val(null);$("#rfl-card-exists-update").hide();
$("#enter-rfl-card-update").hide();$("#enter-rfl-card-digits-update").hide()}else{if(obj.status=="13"){$("#userAddressDetals").val(false);
$("#inActive-update").hide();$("#active-update").show();$("#rfl-card-update-form").removeClass("clearfix").addClass("text error clearfix");
$("#enter-rfl-card-digits-update").show();$("#invalid-rfl-card-update").hide();$("#siebel-error-update").hide();
$("#frm_registration_rflNumber").val(null);$("#account-rfl-number").val(null);$("#rfl-card-exists-update").hide();
$("#enter-login-details-update").hide();$("#enter-rfl-card-update").hide()}else{if(obj.status=="siebel"){$("#userAddressDetals").val(false);
$("#inActive-update").hide();$("#active-update").show();$("#rfl-card-update-form").removeClass("clearfix").addClass("text error clearfix");
$("#enter-rfl-card-digits-update").hide();$("#invalid-rfl-card-update").hide();$("#siebel-error-update").show();
$("#frm_registration_rflNumber").val(null);$("#account-rfl-number").val(null);$("#rfl-card-exists-update").hide();
$("#enter-login-details-update").hide();$("#enter-rfl-card-update").hide()}else{if(obj.status=="exists"){$("#userAddressDetals").val(false);
$("#rfl-card-update-form").removeClass("clearfix").addClass("text error clearfix");
$("#enter-rfl-card-digits").hide();$("#invalid-rfl-card").hide();$("#siebel-error-update").hide();
$("#frm_registration_rflNumber").val(null);$("#account-rfl-number").val(null);$("#rfl-card-exists-update").show();
$("#enter-login-details").hide();$("#enter-rfl-card").hide()}else{$("#userAddressDetals").val(false);
$("#inActive-update").hide();$("#active-update").show();$("#rfl-card-update-form").removeClass("clearfix").addClass("text error clearfix");
$("#invalid-rfl-card-update").show();$("#enter-login-details-update").hide();$("#frm_registration_rflNumber").val(null);
$("#account-rfl-number").val(null);$("#rfl-card-exists-update").hide();$("#siebel-error-update").hide();
$("#enter-rfl-card-update").hide();$("#enter-rfl-card-digits-update").hide()}}}}}}}}})
}function isNumberKeyFav(evt){prodQuantity=$(".in-qty-control").val();var length=$(".itemQtyControl").val().length;
var charCode=(evt.which)?evt.which:evt.keyCode;if(length==0){if(charCode>31&&(charCode<49||charCode>57)){return false
}}else{if(charCode>31&&(charCode<48||charCode>57)){return false}}return true}function isNumberKey(evt){prodQuantity=$(".in-qty-control").val();
var charCode=(evt.which)?evt.which:evt.keyCode;if(charCode>31&&(charCode<48||charCode>57)){return false
}return true}$("#frm_registration_rflNumber").keypress(function(event){if(event.which==13){event.preventDefault();
$(".rfl-add-card-bt").click()}});$("#account-rfl-number").keypress(function(event){if(event.which==13){event.preventDefault();
$("#rfl-card-form-update").click()}});function isPhoneNumber(evt){var charCode=(evt.which)?evt.which:event.keyCode;
if(charCode>31&&(charCode<48||charCode>57)&&charCode!==118){return false}else{return true
}}function isSpacesEntered(evt){var charCode=(evt.which)?evt.which:event.keyCode;
if(charCode==32){return false}return true}if($(window).width()<=768){$("#frm_registration-rfl_postcode-lookup, #frm_address_postcode-lookup, .postcode-lookup-input").keypress(function(){var lookupBtn=$(".postcode-lookup-field input[type=button]");
$(lookupBtn).prop("disabled",false)})}function checkCountrySelect(){var selected=document.getElementById("checkout_form_country").value;
if(selected!="GBR"){document.getElementById("postcodeerror").style.display="none";
document.getElementById("postcodeerrordisp").style.display="block"}}function countryPostalSel(){var selected=document.getElementById("checkout_form_country").value;
if(selected!="GBR"){document.getElementById("postcodeerror").style.display="none";
document.getElementById("postcodeerrordisp").style.display="block"}}function postGiftFrm(){var count=$("#itemNumb").val();
var posting=$.post($("#updateUrl").val(),{pCount:count-1,pGiftlistItemId:$("#giftlistItemId").val(),pQuantity:$("#updateQuantity").val()});
posting.done(function(data){$("#wishlistItem"+count+" .total-sum").html(data);var $addToCartBtn=$("#wishlistItem"+count+" .js-og-update-cart");
if($addToCartBtn.length){$addToCartBtn.data("quantity",$("#updateQuantity").val());
HAB.orderGroove.setQuantity($addToCartBtn)}});posting.fail(function(){alert("error")
})}function showConfirmation(id){removeEditFrm($("#edt_block_"+id),id);$(".hb-form-address-remove-2").hide();
$("#addDeliveryAddressLink").show();$("#addAddressDiv").html("");$("#confirm"+id).show()
}function hideConfirmation(id){$("#confirm"+id).hide()}function getAddressForEdit(id,akey){$("#updateLink"+id).attr("onclick","");
hideConfirmation(id);$.ajax({type:"POST",dataType:"html",url:"/my-account/includes/editAddress.jsp?adid="+id+"&akey="+akey,success:function(data){$("#trid_"+id).after("<tr class='row-form'><td id='edt_block_"+id+"' class='essential' colspan='4' >"+data+"</td></tr>");
$("#edt_block_"+id).trigger("domUpdated")},error:function(){$("#updateLink"+id).attr("onclick","getAddressForEdit("+id+");")
}})}function removeEditFrm(obj,id){$(obj).closest("tr").remove();$("#updateLink"+id).attr("onclick","getAddressForEdit("+id+");")
}function submitUpdate(obj,id){HAB.address.chooseCorrectAddressBeforeSubmit(obj);
var makeDefault=$("#edt_block_"+id+" #frm_checkout_makedefault").prop("checked");
var options={beforeSend:function(){SFR.Utils.switchAjaxLoader()},complete:function(){SFR.Utils.switchAjaxLoader()
},success:function(data){if($(data).attr("id")=="errRspnc"){$("#edt_block_"+id).children(".form-errors").replaceWith($(data).children());
$("#edt_block_"+id).children(".form-errors").removeClass("hdn")}else{$(".form-errors").addClass("hdn");
$(obj).closest("tr").remove();$("#addr_info_"+id).html(data);$("#updateLink"+id).attr("onclick","getAddressForEdit("+id+");");
if(makeDefault){$("label.radio").removeClass("checked");$("#addr_row_"+id+" .setDefault").parent().addClass("checked")
}else{var dfltAddrCheckbox=$("#addr_row_"+id).find('input[name="default-delivery-address"]').parent();
dfltAddrCheckbox.removeClass("checked")}}},error:function(result){console.log(result)
}};$(obj).closest("form").ajaxSubmit(options)}function clearForm(selectMessage){$("#frm_address_housenumber").attr("value","");
$("#frm_address_street").attr("value","");$("#frm_address_address1").attr("value","");
$("#frm_address_town").attr("value","");$("#frm_address_county").attr("value","")
}function removeAddress(addrId){var options={success:function(data){$(".s-account-module").html(data);
SFR.Utils.setupResponsiveTables()},error:function(result){console.log(result)}};$("#removeAddressForm"+addrId).ajaxSubmit(options)
}function tabWasPressed(event){if(event&&event.keyCode==9){return true}}function hasErrorOrEmpty(elem){if(elem){var hasError=elem.closest(".quantity-wrapper").hasClass("error");
var inputEmpty=elem.val()=="";if(hasError||inputEmpty){return true}}}$(document).ready(function(){$.root.on("keyup",".itemQty, .saveForLater-itemQty, .itemQtyControl",$.debounce(500,function(e){if($(this).val()!=""){$(this).triggerHandler("blur")
}}));$.root.on("keyup",".itemQty, .saveForLater-itemQty, .itemQtyControl",$.debounce(1000,function(e){var $this=$(this);
if(tabWasPressed(e)){return}if(hasErrorOrEmpty($this)){return}var inputEle=$this.closest(".quantity-wrapper").find("input");
if($this.is(".saveForLater-itemQty")){HAB.basket.updateSaveForLaterQty(inputEle.attr("giftlistId"),inputEle.attr("name"),inputEle.val())
}if($this.is(".itemQtyControl")){$(this).attr("data-saved-valid-value",$(this).val());
$("#giftlistItemId").val(inputEle.attr("name"));$("#updateQuantity").val(inputEle.attr("value"));
$("#itemNumb").val(inputEle.attr("cnt"));$("#updateGiftlistItemsSmbt").click();$("#updateGiftlistItems").ajaxSubmit()
}if($this.is(".itemQty")){var $this=$(this);if(tabWasPressed(e)){return}if(hasErrorOrEmpty($this)){return
}HAB.basket.updateQuantity(inputEle.attr("name"),inputEle.attr("value"))}}));$(".removeCartItem").one("click",function(event){HAB.basket.removeItemFromCart(event,$(this).attr("removeItem"),$(this).data("removed-sku"))
});$(".cartItem button").click(function(event){var inputEle=$(this).closest(".quantity-wrapper").find("input");
HAB.basket.updateQuantity(inputEle.attr("name"),inputEle.attr("value"))});$(".js-saved-last-valid-value").on("keyup",$.debounce(1000,function(event){var $this=$(this);
if(tabWasPressed(event)){return}if(hasErrorOrEmpty($this)){return}var inputEle=$(this).closest(".quantity-wrapper").find("input");
HAB.basket.updateQuantity(inputEle.attr("name"),inputEle.attr("value"))}));$(".saveForItem button").click(function(event){var inputEle=$(this).closest(".quantity-wrapper").find("input");
HAB.basket.updateSaveForLaterQty(inputEle.attr("giftlistId"),inputEle.attr("name"),inputEle.val())
});$(".saveForLaterFromCart").click(function(event){HAB.basket.saveForLaterFromCart(event,$(this).attr("commerceItemId"),$(this).attr("giftlistId"),$(this).attr("itemQty"),$(this).data("sku-id"))
});$(".removeGiftItem").click(function(event){HAB.basket.removeSaveForLater(event,$(this).attr("giftItemId"),$(this).attr("giftlistId"))
});$(".act-remove-all").click(function(event){var giftlistId=$(this).attr("giftlistId");
HAB.basket.removeAllSaved4Later(event,giftlistId)});$(".js-remove-coupon").click(function(event){var promoItem=$(this).data("promo-item");
HAB.basket.removeDiscount(event,promoItem)});$(".saveAddToBasket").click(function(event){HAB.basket.addToBasketFromSavedLater(event,$(this).attr("giftlistId"),$(this).attr("giftItemId"))
});$("#synchronizeFailedUser").ajaxSubmit();$("#wrongEmail").click(function(){$("#clearCookie").submit()
})});var prodQuantity;function isNumberKey(evt){prodQuantity=$(".in-qty-control").val();
var charCode=(evt.which)?evt.which:evt.charCode;if(charCode>31&&(charCode<48||charCode>57)){return false
}return true}function isDecimal(evt){var charCode=(evt.which)?evt.which:event.keyCode;
if(charCode!=46&&charCode>31&&(charCode<48||charCode>57)){return false}return true
}function submitRestoreOriginalPriceForm(event,priceOverrideSkuId){event.preventDefault();
$("#restoreSkuId").val(priceOverrideSkuId);var basketModule=$.root.find("#ajaxBasketModule");
var refreshURL=HAB.basket.getRefreshURL();SFR.Utils.submitAjaxForm($("#restoreOriginalPriceForm"),basketModule,refreshURL,HAB.basket.onAjaxReloadingComplete,HAB.basket.showErrorMessages)
}function getAbbrTitle(skuId,productForm){var divId="#toolTip"+skuId;var divhtml=$.trim($(divId).html())+" "+productForm;
$(".product").find("abbr").attr("title",divhtml)}function getStrikeTitle(skuId){var divId="#was"+skuId;
var divhtml=$.trim($(divId).html());$(".line-total").find("strike").attr("title",divhtml)
}function clearForm(selectMessage){$("#frm_registration-rfl_housenumber").attr("value","");
$("#frm_registration-rfl_street").attr("value","");$("#frm_registration-rfl_town").attr("value","");
$("#frm_registration-rfl_county").attr("value","")}function func(){$("#flag").val(1)
}function submitUpdateOnCheckout(obj,id){HAB.address.chooseCorrectAddressBeforeSubmit(obj);
var options={beforeSend:function(){SFR.Utils.showAjaxLoader()},complete:function(){SFR.Utils.hideAjaxLoader()
},success:function(data){if($(data).attr("id")=="errRspnc"){$("#form-errors-container").html($(data).find(".form-errors"))
}else{$(".form-errors").addClass("hdn");$("#newAddressDiv").html("")}},error:function(result){console.log(result)
}};$(obj).closest("form").ajaxSubmit(options)}function removeEditFrmOnCheckout(obj,id){$("#newAddressDiv").html("");
$("#newShippingAddressId").show();$("#save-shipping-address").show();$("#save-shipping-address-metapack").show();
$("#form-errors-container").html("");SFR.Utils.scrollTo("#deliveryDetails")}function changeCurrency(curType){document.getElementById("existingCurrencyType").value="GBP";
document.getElementById("selectedCurrencyType").value=curType;document.getElementById("changeCurrencyForm").submit()
}$(document).ready(function(){$(".paGoBtnhide").hide();$("#favourites_form").find(".bh-ajax-loader").live("click",function(){$("#favouriteform").submit()
});$("#pagination li a").live("click",function(event){var target=$(this).attr("href");
$.ajax({url:target,type:"GET",dataType:"html",success:function(html){var content=$(html).find("section.s-account-module.s-your-orders");
$("div.l-col.l-three-quarters").html(content);if($("body").is(".breakpoint-220")){SFR.Utils.setupResponsiveTables("section.s-account-module.s-your-orders")
}}});event.preventDefault()});$("#favouritesPagination li a, #showAll").live("click",function(event){var target=$(this).attr("href");
$.ajax({url:target,type:"GET",dataType:"html",success:function(html){var content=$(html).find("section.s-acc-module.s-favourites");
$("div.js-fav-pagination").html(content);HAB.hookQtyButtons();HAB.myAccount.init();
HAB.pdp.init()}});event.preventDefault()});maxLength=$("textarea#frm_comments").attr("maxlength");
$("textarea#frm_comments").bind("keypress keyup change",function(){checkMaxLength(this.id,maxLength)
});$("#frm_registration-rfl_postcode-lookup").live("keypress",function(event){if(event.which==13){var $lookupButton=$(this).parents("form").find(".js-lookup-trigger");
event.preventDefault();if($lookupButton.is(":visible")){$lookupButton.focus();setTimeout(function(){$lookupButton.trigger("click")
},100)}}});if($(window).width()<=768){$(".uraddress_check").find("#frm_registration-rfl_postcode-lookup, #frm_address_postcode-lookup").keypress(function(){var lookupBtn=$(".postcode-lookup-field input[type=submit]");
$(lookupBtn).prop("disabled",false)})}});function checkMaxLength(textareaID,maxLength){currentLengthInTextarea=$("#"+textareaID).val().length;
if(currentLengthInTextarea>(maxLength)){$("textarea#"+textareaID).val($("textarea#"+textareaID).val().slice(0,maxLength))
}}function switchImg(imgSrc,inputId){var img;if(typeof inputId!="undefined"){img=$("#quickBuyProduct").find("img")[0]
}else{img=$(".content.clearfix.prod-teaser-form.quick-buy ").find("img")[0]}if(typeof img!="undefined"){img.src=imgSrc
}}function validateData(allowSpacesForName){var ajaxcall=false||document.getElementById("signUp").value;
var hasError=false;$.each($(".alpha"),function(i,e){var emailReg=/^[a-z0-9!$'*+\-_]+(\.[a-z0-9!$'*+\-_&]+)*@([a-z0-9]+(-+[a-z0-9]+)*\.)+([a-z]{2,6})$/;
var nameFieldReg=/^[A-Za-z]+$/;if(!!allowSpacesForName){nameFieldReg=/^[A-Za-z ]+$/
}var firstName="firstName";var middleName="middleName";var lastName="lastName";var userEmail="userEmail";
var Email="Email";var Post="Post";var SMS="SMS";if(e.id==firstName){if(e.value==""){$(".error4").show();
$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});hasError=true
}else{if(!nameFieldReg.test(e.value)){$(".error1").show();$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
hasError=true}else{if(e.value.length<2){$(".error18").show();$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
hasError=true}else{$(e).css({"border":"","box-shadow":""})}}}}if(e.id==middleName){if(e.value.length>0&&!nameFieldReg.test(e.value)){$(".error8").show();
$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});hasError=true
}else{if(e.value.length==1){$(".error22").show();$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
hasError=true}else{$(e).css({"border":"","box-shadow":""})}}}if(e.id==lastName){if(e.value==""){$(".error5").show();
$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});hasError=true
}else{if(!nameFieldReg.test(e.value)){$(".error2").show();$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
hasError=true}else{if(e.value.length<2){$(".error20").show();$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
hasError=true}else{$(e).css({"border":"","box-shadow":""})}}}}if(e.id==userEmail){if(e.value==""){$(".error6").show();
$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});hasError=true
}else{if(emailReg.test(e.value.toLowerCase())&&(e.value.length<2||e.value.length>50)){$(".error6").show();
$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});hasError=true
}else{if(!emailReg.test(e.value.toLowerCase())){if(e.value.length<2&&nameFieldReg.test(e.value.toLowerCase())){$(".error6").show();
$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});hasError=true
}else{$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
$(".error3").show();hasError=true}}else{if(e.value.length<2||e.value.length>50){$(".error6").show();
$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});hasError=true
}else{$(e).css({"border":"","box-shadow":""})}}}}}if(e.id==Email){if($("#Email").prop("checked")||$("#Post").prop("checked")||$("#SMS").prop("checked")){$(e).css({"border":"","box-shadow":""})
}else{$(".error16").show();$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
hasError=true}}if(e.id==Post){if($("#Email").prop("checked")||$("#Post").prop("checked")||$("#SMS").prop("checked")){$(e).css({"border":"","box-shadow":""})
}else{$(".error16").show();$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
hasError=true}}if(e.id==SMS){if($("#Email").prop("checked")||$("#Post").prop("checked")||$("#SMS").prop("checked")){$(e).css({"border":"","box-shadow":""})
}else{$(".error16").show();$(e).css({"border":"1px solid #d61616","box-shadow":"0px 0px 0px 1px #d61616"});
hasError=true}}});$("#hidden.page-title").hide();$("#hidden.page-title").hide();$("input").focus(function(){var error1_new=$(this).parents("li").find(".error1").val();
var error2_new=$(this).parents("li").find(".error2").val();var error3_new=$(this).parents("li").find(".error3").val();
$(this).parents("li").find(".error1").val(error1_new);$(this).parents("li").find(".error1").fadeOut(300);
$(this).parents("li").find(".error2").val(error2_new);$(this).parents("li").find(".error2").fadeOut(300);
$(this).parents("li").find(".error3").val(error3_new);$(this).parents("li").find(".error3").fadeOut(300);
$(this).parents("li").find(".error4").fadeOut(300);$(this).parents("li").find(".error5").fadeOut(300);
$(this).parents("li").find(".error6").fadeOut(300);$(this).parents("li").find(".error8").fadeOut(300);
$(this).parents("li").find(".error16").fadeOut(300);$(this).parents("li").find(".error17").fadeOut(300);
$(this).parents("li").find(".error18").fadeOut(300);$(this).parents("li").find(".error19").fadeOut(300);
$(this).parents("li").find(".error20").fadeOut(300);$(this).parents("li").find(".error22").fadeOut(300)
});if(hasError==false&&ajaxcall=="true"){$("form#signUpForm").ajaxSubmit({beforeSubmit:function(){},success:function(msg){if(msg.isSuccess){$("div").remove(".signUpHide");
$("#emailTabStyle").show()}else{}},error:function(msg){},dataType:"json"})}else{if(hasError==true){}else{if(document.signUpMonthlyForm["/atg/userprofiling/ProfileFormHandler.subscribeOffers"]){document.signUpMonthlyForm["/atg/userprofiling/ProfileFormHandler.subscribeOffers"].value="submit";
document.signUpMonthlyForm.submit()}else{$("#signUpMonthlyForm").submit()}}}}function searchFieldValidate(){var value=document.getElementById("sitesearch").value;
if(value==""||value.replace(/[^A-Za-z0-9]+/g,"")==""){return false}}function refreshBasket(){document.returntobasket.submit()
}$("#checkout_form_deliverynotes").live("keydown keyup blur",function(e){var $this=$(this),maxlen=$this.attr("maxlength"),val=$this.val();
if(val.length>maxlen){$this.val(val.substr(0,maxlen))}});$(".itemQty,.in-qty-control,.validate-qty").live("keyup",function(){var maxval=parseInt($(this).attr("max"));
var minval=parseInt($(this).attr("min"));var curval=parseInt($(this).val());$.fn.inlineValidation()
});$(".check").find('input[type="checkbox"]').live("click",function(){if($(this).is(":checked")){$(".error16").hide()
}});function isNumberKey(evt){var charCode=(evt.which)?evt.which:evt.keyCode,backspaceCode=8,leftArrowCode=37,rightArrowCode=39,deleteCode=46,zeroCode=48,nineCode=57,aCode=65,cCode=67,vCode=86,aFFCode=97,cFFCode=99,vFFCode=118;
if((charCode>=zeroCode&&charCode<=nineCode)||(charCode==backspaceCode)||(charCode==leftArrowCode)||(charCode==rightArrowCode)||(charCode==deleteCode)||(evt.ctrlKey&&(charCode==aCode||charCode==cCode||charCode==vCode||charCode==aFFCode||charCode==cFFCode||charCode==vFFCode))){return true
}return false}seal_gif_url="/images/nortonseal.png";dn="www.hollandandbarrett.com";
sap="getnortonsealimaget.js";splash_url="https://trustsealinfo.verisign.com";tpt="transparent";
language="en";u1=splash_url+"/splash?form_file=fdf/splash.fdf&dn="+dn+"&lang="+language;
function vrsn_splash(){tbar="location=yes,status=yes,resizable=yes,scrollbars=yes,width=560,height=500";
sw=window.open(u1,"VRSN_Splash",tbar);sw.focus()}var ver=-1;var v_ua=navigator.userAgent.toLowerCase();
var re=new RegExp("msie ([0-9]{1,}[.0-9]{0,})");if(re.exec(v_ua)!=null){ver=parseFloat(RegExp.$1)
}var v_old_ie=(v_ua.indexOf("msie")!=-1);if(v_old_ie){v_old_ie=ver<5}function maction(e){if(document.addEventListener){var seal=(e.target.name=="seal");
if(seal){vrsn_splash();return false}}else{if(document.captureEvents){var tgt=e.target.toString();
var seal=(tgt.indexOf("splash")!=-1);if(seal){vrsn_splash();return false}}}return true
}function mouseDown(){if(event.button==1){if(v_old_ie){return true}else{vrsn_splash();
return false}}else{if(event.button==2){vrsn_splash();return false}}}var sealContainer=document.querySelectorAll(".js-static-norton-seal");
if(sealContainer!=="undefined"&&sealContainer.length>0){for(var i=0;i<sealContainer.length;
i++){sealContainer[i].innerHTML='<a HREF="'+u1+'" tabindex="-1" onmousedown="return mouseDown();" target="VRSN_Splash"><IMG NAME="seal" BORDER="true" SRC="'+seal_gif_url+'" oncontextmenu="return false;"></A>'
}}if((v_ua.indexOf("msie")!=-1)&&(ver>=10)){var plat=-1;var re=new RegExp("windows nt ([0-9]{1,}[.0-9]{0,})");
if(re.exec(v_ua)!=null){plat=parseFloat(RegExp.$1)}if(plat>=5.1){document.write("<div style='display:none'>");
document.write("<img src='https://extended-validation-ssl.verisign.com/dot_clear.gif'/>");
document.write("</div>")}}if(document.addEventListener){document.addEventListener("mouseup",maction,true)
}else{if(document.layers){document.captureEvents(Event.MOUSEDOWN);document.onmousedown=maction
}}function resized(){if(pageWidth!=innerWidth||pageHeight!=innerHeight){self.history.go(0)
}}if(document.layers){pageWidth=innerWidth;pageHeight=innerHeight;window.onresize=resized
};