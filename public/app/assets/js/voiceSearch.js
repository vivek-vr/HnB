HAB.voiceSearch={config:{recognition:null,recording:false,isRecognized:false,activationButton:$(".js-voice-search-activate"),voiceSearchPopup:$("#js-voice-search-popup"),isHbpSearch:false,activeMicAnimationClass:"pulse-animation",mutedMicClass:"ico-mic-mute"},selectors:{closePopupButton:"#js-close-voice-search",microphoneButton:".js-voice-search-icon",microphoneIcon:".js-voice-search-icon .ico-s",resultsOutput:"#js-voice-search-output",searchStateLabel:".js-voice-search-state",voiceSearchForm:"#js-voice-search-form",activationButton:".js-voice-search-activate",hbpPopupContainer:"#hbp-voice-popup-container",hbpPopupContent:"#hbp-voice-popup-content",hbpPopupCloseBtn:".hbp-voice-popup-hide"},constants:{HPB_MUTED_MIC_ICON_CLASS:"hpb-ico-mic-mute",HBP_ACTIVE_MIC_ANIMATION_CLASS:"hbp-pulse-animation",SEARCH_POPUP_URL:"/common/popup/voiceSearchPopup.jsp",HBP_SEARCH_POPUP_URL:"/common/popup/hbpVoiceSearchPopup.jsp"},init:function(){this.config.recognition=this.getSpeechRecognition();
if(this.config.recognition!=null){this.config.activationButton.removeClass("hidden");
this.config.activationButton.on("click",function(){SFR.Utils.showPopup({url:HAB.voiceSearch.constants.SEARCH_POPUP_URL,showAjaxLoader:true,disableScroll:true,init:HAB.voiceSearch.initVoicePopup})
})}},initHealthboxSearch:function(){this.config.recognition=this.getSpeechRecognition();
this.config.isHbpSearch=true;this.config.activeMicAnimationClass=this.constants.HBP_ACTIVE_MIC_ANIMATION_CLASS;
this.config.mutedMicClass=this.constants.HPB_MUTED_MIC_ICON_CLASS;if(this.config.recognition!=null){$(this.selectors.activationButton).removeClass("hidden");
$(this.selectors.activationButton).on("click",function(){SFR.Utils.showPopup({url:HAB.voiceSearch.constants.HBP_SEARCH_POPUP_URL,showAjaxLoader:true,disableScroll:true,init:HAB.voiceSearch.initVoicePopup,popupContainer:HAB.voiceSearch.selectors.hbpPopupContainer,popupContent:HAB.voiceSearch.selectors.hbpPopupContent,hidePopupBtn:HAB.voiceSearch.selectors.hbpPopupCloseBtn})
})}},initVoicePopup:function(){HAB.voiceSearch.config.recognition=HAB.voiceSearch.getSpeechRecognition();
if(HAB.voiceSearch.config.recognition!=null){HAB.voiceSearch.config.recognition.continuous=false;
HAB.voiceSearch.config.recognition.interimResults=false;HAB.voiceSearch.config.recognition.lang=HAB.voiceSearch.config.activationButton.data("locale");
HAB.voiceSearch.config.recognition.onresult=HAB.voiceSearch.onRecognitionResult;HAB.voiceSearch.config.recognition.onend=HAB.voiceSearch.onRecognitionEnd;
HAB.voiceSearch.startRecording();$(HAB.voiceSearch.selectors.closePopupButton).on("click",function(){HAB.voiceSearch.stopRecording()
})}},getSpeechRecognition:function(){if(typeof webkitSpeechRecognition!="undefined"){var recognition=new webkitSpeechRecognition();
if(recognition){return recognition}}if(typeof SpeechRecognition!="undefined"){recognition=new SpeechRecognition();
if(recognition){return recognition}}},onRecognitionEnd:function(event){HAB.voiceSearch.config.recording=false;
if(!HAB.voiceSearch.config.isRecognized){HAB.voiceSearch.makeMicButtonMuted()}else{if(HAB.voiceSearch.config.isHbpSearch){HAB.voiceSearch.submitHealthboxSearchForm()
}else{$(HAB.voiceSearch.selectors.voiceSearchForm).submit()}}},submitHealthboxSearchForm:function(){var recognizedText=$(HAB.voiceSearch.selectors.resultsOutput).val();
$(".js-search-pills-text").val(recognizedText);$(".js-search-pills-form").submit();
$(HAB.voiceSearch.selectors.hbpPopupContainer).hide();$(HAB.voiceSearch.selectors.hbpPopupContent).html("")
},onRecognitionResult:function(event){var tempTrascription="";var finalTranscription="";
for(var i=event.resultIndex;i<event.results.length;++i){if(event.results[i].isFinal){finalTranscription+=event.results[i][0].transcript
}}if(finalTranscription!=null){HAB.voiceSearch.config.isRecognized=true;$(HAB.voiceSearch.selectors.resultsOutput).val(finalTranscription)
}},startStopRecording:function(){if(HAB.voiceSearch.config.recording){HAB.voiceSearch.config.recording=false;
HAB.voiceSearch.config.recognition.stop()}else{HAB.voiceSearch.config.recording=true;
HAB.voiceSearch.getVoiceData()}},startRecording:function(){if(!HAB.voiceSearch.config.recording){HAB.voiceSearch.config.recording=true;
HAB.voiceSearch.getVoiceData()}HAB.voiceSearch.makeMicButtonActive()},makeMicButtonActive:function(){var $micIcon=$(HAB.voiceSearch.selectors.microphoneIcon);
var $micButton=$(HAB.voiceSearch.selectors.microphoneButton);var $stateLabel=$(HAB.voiceSearch.selectors.searchStateLabel);
$micIcon.removeClass(HAB.voiceSearch.config.mutedMicClass);$micButton.addClass(HAB.voiceSearch.config.activeMicAnimationClass);
$stateLabel.html(window.localization.voiceSearch.listeningMessage);$micButton.off("click",HAB.voiceSearch.startRecording)
},makeMicButtonMuted:function(){var $micIcon=$(HAB.voiceSearch.selectors.microphoneIcon);
var $micButton=$(HAB.voiceSearch.selectors.microphoneButton);var $stateLabel=$(HAB.voiceSearch.selectors.searchStateLabel);
$micIcon.addClass(HAB.voiceSearch.config.mutedMicClass);$micButton.removeClass(HAB.voiceSearch.config.activeMicAnimationClass);
$stateLabel.html(window.localization.voiceSearch.errorMessage);$micButton.on("click",HAB.voiceSearch.startRecording)
},stopRecording:function(){if(HAB.voiceSearch.config.recording){HAB.voiceSearch.config.recording=false;
HAB.voiceSearch.config.recognition.stop()}},getVoiceData:function(){HAB.voiceSearch.config.recognition.start()
},getUserMedia:function(data,successCallback,errorCallback){if(navigator.webkitGetUserMedia){return navigator.webkitGetUserMedia(data,successCallback,errorCallback)
}if(navigator.getUserMedia){return navigator.getUserMedia(data,successCallback,errorCallback)
}if(navigator.mozGetUserMedia){return navigator.mozGetUserMedia(data,successCallback,errorCallback)
}if(navigator.msGetUserMedia){navigator.msGetUserMedia(data,successCallback,errorCallback)
}},errorCallback:function(){HAB.voiceSearch.makeMicButtonMuted()}};$(document).ready(function(){HAB.voiceSearch.init()
});