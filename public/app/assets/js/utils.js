var HAB=HAB||{};HAB.utils={getCookieByName:function(name){var value="; "+document.cookie;
var parts=value.split("; "+name+"=");if(parts.length===2){return parts.pop().split(";").shift()
}},switchPageType:function(e){e.preventDefault();var $this=$(this);var formSelector=$this.data("hbFormSubmit");
if(formSelector){$(formSelector).find('[type="submit"]').trigger("click")}},recommendedAccordion:{init:function(){$(".recommended-accordion-container").on("click",".recommended-accordion-title",function(){var $this=$(this);
if($this.parent().hasClass("active")){$this.next().slideUp(function(){$(this).parent().removeClass("active");
refreshStickyHeader()})}else{$this.next().slideDown(refreshStickyHeader).parent().addClass("active")
}function refreshStickyHeader(){var fixedHeaderObj=HAB.healthboxFixedHeader;if(fixedHeaderObj.allIsOK){fixedHeaderObj.navElementsArr=fixedHeaderObj.sectionOffsetsInit(fixedHeaderObj.linkArr)
}}})}}};