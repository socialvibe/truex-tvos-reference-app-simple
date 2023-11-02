//
//  BFITruexTvmlCore.js
//
//  Created by Kyle Lam on 1/23/19.
//  Copyright © 2018 true[X]. All rights reserved.
//

// MARK: - universal Choice Card code
//  (BFI only as of Jan, 2019)

// *_src_crop='22,22,263,89' is to crop the image with the given x, y, width, height
// value are measured from innovid screenshot
const STATIC_CC_XML = "<document>\n    <divTemplate>\n        <txview button_hover_effect='__txButtonHoverEffect__' >\n            <txbutton id='one_ad_now_button' name='one_ad_now' x='__ix__' y='__iy__' width='__iWidth__' height='__iHeight__' src='__ib__' default_src_crop='__iDefaultSrcCrop__' hover_src='__ib__' hover_src_crop='__iHoverSrcCrop__' onselect='host.cardChooseInteract()' autoHighlight='true'/>\n            <txbutton id='continue_button' name='continue_button' x='__wx__' y='__wy__' width='__wWidth__' height='__wHeight__' src='__wb__' default_src_crop='__wDefaultSrcCrop__' hover_src='__wb__' hover_src_crop='__wHoverSrcCrop__' onselect='host.cardChooseWatch()'  />\n            <tximage id='background' name='background' x='0' y='0' width='1920' height='1080' src='__bg__' />\n        </txview>\n    </divTemplate>\n</document>\n";
const VIDEO_CC_XML = "<document controller='FullscreenVideoController'>\n    <divTemplate>\n        <txview button_hover_effect='__txButtonHoverEffect__'>\n            <txbutton id='one_ad_now_button' name='one_ad_now' x='__ix__' y='__iy__' width='__iWidth__' height='__iHeight__' src='__ib__' default_src_crop='__iDefaultSrcCrop__' hover_src='__ib__' hover_src_crop='__iHoverSrcCrop__' onselect='host.cardChooseInteract()' showOn='__bd__' autoHighlight='true'/>\n            <txbutton id='continue_button' name='continue_button' x='__wx__' y='__wy__' width='__wWidth__' height='__wHeight__' src='__wb__' default_src_crop='__wDefaultSrcCrop__' hover_src='__wb__' hover_src_crop='__wHoverSrcCrop__' onselect='host.cardChooseWatch()' showOn='__bd__' />\n            <txvideo id='initial_video' name='initial_video' src='__bgv__' x='0' y='0' width='1920' height='1080' action='play' loop='false' timeBoundaries=''/>\n        </txview>\n    </divTemplate>\n</document>\n";

// following code take the choice card config and render the choice card with tvml
var parseAndPushChoiceCard = function(parsedConfig) {
    var choiceCardXml;
    // check if config asked for a static (image background) or video choice card,
    // by looking at the variable bgv
    if (parsedConfig && parsedConfig.bgv && parsedConfig.bgv!="") {
        choiceCardXml = VIDEO_CC_XML;
    } else {
        choiceCardXml = STATIC_CC_XML;
    }
    var keys = ["bg", "bgv", "ib", "ib", "wb", "wb", "bd", "bd"];
    for (var i in keys){
        var key = keys[i];
        choiceCardXml = choiceCardXml.replace('__'+key+'__', parsedConfig[key]);
    }
    var pixelsKeys = ["ix", "iy", "wx", "wy"];
    for (var i in pixelsKeys){
        var key = pixelsKeys[i];
        // Innovid's values are in HD (1280x720), However tvOS require them in FHD (1920x1080)
        var pixelsFHD = Number(parsedConfig[key]) * 1080 / 720;
        // margin value calculated from screenshots
        var margin = 33;
        choiceCardXml = choiceCardXml.replace('__'+key+'__', pixelsFHD + margin );
    }
    
    var buttonType = "default";
    // there seems to be no way, but to look at the x,y of the 2 buttons to determine if this cc is 8020
    if (parsedConfig["ix"]==parsedConfig["wx"] && parsedConfig["iy"]!=parsedConfig["wy"]) {
        buttonType = "8020";
    }
    var buttonSettings = {
        "default": {
            "iWidth": "394",
            "iHeight": "133",
            "iDefaultSrcCrop": "22,22,263,89",
            "iHoverSrcCrop": "22,155,263,89",
            "wWidth": "394",
            "wHeight": "133",
            "wDefaultSrcCrop": "22,22,263,89",
            "wHoverSrcCrop": "22,155,263,89",
            "txButtonHoverEffect": "false"
        },
        "8020": {
            "iWidth": "1236",
            "iHeight": "537",
            "iDefaultSrcCrop": "22,22,824,358",
            "iHoverSrcCrop": "22,424,824,358",
            "wWidth": "1236",
            "wHeight": "159",
            "wDefaultSrcCrop": "22,22,824,106",
            "wHoverSrcCrop": "22,172,824,106",
            "txButtonHoverEffect": "true"
        }
    }
    var buttonSetting = buttonSettings[buttonType];
    var buttonSettingKeys = Object.keys(buttonSetting);
    for (var i in buttonSettingKeys){
        var key = buttonSettingKeys[i];
        choiceCardXml = choiceCardXml.replace('__'+key+'__', buttonSetting[key] );
    }
    
    parseAndPush(choiceCardXml, "main_card", false, true);
}


// MARK: - BFI Renderer: Main Logic
const BFI_GREY = "#949494";
const BFI_WHITE = "#FFFFFF";
const BFI_DARK_GREEN = "#215428";
const BFI_GREEN = "#4fd461";
const BFI_PROGRESS_BAR_QUESTION_TEXT_PREFIX = "Question ";
const BFI_PROGRESS_BAR_FINSIH_TEXT = "Finish";
const BFI_FINISH_CARD_MAIN_TEXT = "Thank You!";
const BFI_FOOTER_PRE_INTERACT_PRE_TIME_TEXT = "YOUR INTERACTIVE SURVEY";
const BFI_FOOTER_PRE_INTERACT_POST_TIME_TEXT = "SELECT AN ANSWER TO COMPLETE THIS SURVEY";
const BFI_FOOTER_POST_INTERACT_TEXT = "CONTINUE IN";

var bfiSurveyConfig={};

var parseAndPushBFI = function(parsedConfig) {
    showDocument(createLoadingDocument(), false);
    if (parsedConfig && parsedConfig.survey_config_url && parsedConfig.survey_config_url!=""){
        getJsonFrom(parsedConfig.survey_config_url,
                    (templateXHR)=>{
                        host.debugLog("TruexTvmlCore.js parseAndPushBFI: got survey_config from _url");
                        try {
                            bfiSurveyConfig = JSON.parse(templateXHR.responseText);
                        } catch(e) {
                            host.debugLog("TruexTvmlCore.js parseAndPushBFI error: cannot parse bfiSurveyConfig");
                            host.cardFail("cannot parse bfiSurveyConfig, failing ad.");
                        }
                        createAndPushBFIPage(0);
                    },
                    (templateXHR)=>{
                        host.debugLog("TruexTvmlCore.js parseAndPushBFI error: cannot get bfiSurveyConfig: " + templateXHR.status);
                        host.cardFail("cannot get bfiSurveyConfig, failing ad.");
                    });
    } else {
        host.debugLog("TruexTvmlCore.js parseAndPushBFI error: invalid survey_config_url");
        host.cardFail("invalid survey_config_url, failing ad.");
    }

    // override the keypress event to enable button on 1st key press event
    onKeyPressedEvent = function(eventName){
        // this is BFI specific logic
        if (eventName=="left" || eventName=="right"){
            bfiEnableButtonsOnFirstKeyPress();
        }
    }
}

var createAndPushBFIPage = function(pageNumber){
    if (!(bfiSurveyConfig && bfiSurveyConfig.surveys && bfiSurveyConfig.surveys.length>0)) {
        host.debugLog("TruexTvmlCore.js createBFIPage error: invalid bfiSurveyConfig or page number");
        host.cardFail("invalid bfiSurveyConfig or page number, failing ad.");
    } else {
        if (bfiSurveyConfig.surveys.length <= pageNumber){
            createAndShowLastPage();
        } else {
            var survey = bfiSurveyConfig.surveys[pageNumber];
            // error check, if there are no answers, or more than 10 answers, we will skip the question
            if (!survey || !survey.answers || (survey.answers.length==0) || (survey.answers.length>10)){
                createAndPushBFIPage(pageNumber+1);
                return;
            }
            var buttonsXml = "";
            var labelsXml = "";
            var question = survey.text;
            var answers = survey.answers;
            // calculate spacing
            // left right margin = spacing - 45px
            var safeMargin = 45;
            var spacing = (1920 + (safeMargin*2))/(survey.answers.length+1);
            var margin = spacing - safeMargin;

            var onloadJavascriptText = "receivedFirstKeyPressed=false; setIsDisabledAllButton(true);";
            var headXml = "<document onload=\""+onloadJavascriptText+"\">\n    <divTemplate>\n        <txview button_hover_effect=\"false\" button_hover_interaction=\"false\">\n ";
            var tailXml = "<tximage id=\"backgroundImage\" name=\"backgroundImage\" x=\"0\" y=\"0\" width=\"1920\" height=\"1080\" src=\"https://media.truex.com/image_assets/2019-01-16/1adb0619-958b-4277-8018-ddbf36fc8292.png\"/>\n        </txview>\n    </divTemplate>\n</document>";
            var progressBarXml = getProgressBarXml(bfiSurveyConfig.surveys.length, pageNumber+1);
            var questionAttributes = {
                "id": "question",
                "name": "question",
                "x": margin-spacing/2,  // to match the answerlabel left and right
                "y": 210,
                "width": 1920-(margin-spacing/2)*2,
                "height": 150,
                "text": question,
                "color": BFI_WHITE,
                "alignment": "center",
                "lineBreakMode": "NSLineBreakByWordWrapping"
            };
            var questionXml = getTxelenmentXml("txlabel", questionAttributes);
            var answerLineAttributes = {
                "id": "answerLine",
                "name": "answerLine",
                "x": margin,
                "y": 538,
                "width": ( (spacing*answers.length-safeMargin) - margin ),  // last answer's center - first answer's center
                "height": 4,
                "text": '',
                "backgroundColor": BFI_GREY
            };
            var answerLineXml = getTxelenmentXml("txlabel", answerLineAttributes);
            // create answers elenments (buttons, labels)
            for (var i in answers){
                var xCenter = spacing * (Number(i)+1) - safeMargin;
                var answer = answers[i];
                buttonsXml += getBfiAnswerButtonXml(pageNumber, i, xCenter, answers.length);
                labelsXml += getBfiAnswerLabelXml(i, xCenter, spacing, answer.text);
            }

            host.disableFooterWatchButton();
            var pageXml = headXml;
            pageXml += progressBarXml;
            pageXml += questionXml;
            pageXml += buttonsXml;
            pageXml += answerLineXml;
            pageXml += labelsXml;
            pageXml += tailXml;
            parseAndPush(pageXml, "question_"+pageNumber, true, true);

            // tracking calls on which question being display
            var gifPixelPath = "i.gif";
            var arguments = {
                "category": "tvos_tvml_bfi",
                "name": "bfi_question_display",
                "step": pageNumber.toString(),
                "value": survey.survey_id,
                "datas_json": JSON.stringify(survey)
            };
            var isChoiceEvent = false;
            host.trackEventWithPathArgumentsIsChoiceEvent(gifPixelPath, arguments, isChoiceEvent);
        }
    }

    // modify footer text base on current page number
    if (pageNumber==0){
        host.changeFooterMessageWithPreTimeRequirementMessagePostTimeRequirementMessage(BFI_FOOTER_PRE_INTERACT_PRE_TIME_TEXT, BFI_FOOTER_PRE_INTERACT_POST_TIME_TEXT);
    } else {
        host.changeFooterMessageWithPreTimeRequirementMessagePostTimeRequirementMessage(BFI_FOOTER_POST_INTERACT_TEXT, BFI_FOOTER_POST_INTERACT_TEXT);
    }
}

var createAndShowLastPage = function(){
    var onloadJavascriptText = "setTimeout(()=>{ host.creativeWantsToCompleteAds(); }, 3000);";
    var headXml = "<document onload=\""+onloadJavascriptText+"\">\n    <divTemplate>\n        <txview button_hover_effect=\"false\" button_hover_interaction=\"false\"  >\n ";
    var tailXml = "<tximage id=\"backgroundImage\" name=\"backgroundImage\" x=\"0\" y=\"0\" width=\"1920\" height=\"1080\" src=\"https://media.truex.com/image_assets/2019-01-16/1adb0619-958b-4277-8018-ddbf36fc8292.png\"/>\n        </txview>\n    </divTemplate>\n</document>";
    var titleXmlAttributes = {
        "id": "title",
        "name": "title",
        "x": 0,
        "y": 440,
        "width": 1920,
        "height": 200,
        "text": BFI_FINISH_CARD_MAIN_TEXT,
        "fontSize": 120,
        "color": BFI_WHITE,
        "alignment": "center"
    };
    var titleXml = getTxelenmentXml("txlabel", titleXmlAttributes);
    var progressBarXml = getProgressBarXml(bfiSurveyConfig.surveys.length, bfiSurveyConfig.surveys.length+1);

    var pageXml = headXml + progressBarXml + titleXml + tailXml;
    host.sendNotificationToDefaultCenterWithName("TAR_fadeOutFooter");
    host.creativeWantsFlagAchievedTrueAttention();
    parseAndPush(pageXml, "last_card", true, true);
}

var bfiUserPickedAnswer = function(pageNumber, answersNumber){
    var answer = bfiSurveyConfig.surveys[pageNumber].answers[answersNumber];
    var trackingPixelUrl = answer.tracking_pixel;
    firePixelWithUrl(trackingPixelUrl);
    host.flagActivityForAttention();
    createAndPushBFIPage(Number(pageNumber)+1);

    // tracking calls on answers, question
    var gifPixelPath = "i.gif";
    var arguments = {
        "category": "tvos_tvml_bfi",
        "name": "bfi_question_answer",
        "step": bfiSurveyConfig.surveys[pageNumber].survey_id,
        "value": answer.id,
        "datas_json": JSON.stringify(bfiSurveyConfig.surveys[pageNumber])
    };
    var isChoiceEvent = false;
    host.trackEventWithPathArgumentsIsChoiceEvent(gifPixelPath, arguments, isChoiceEvent);
}

// navigational logic
var receivedFirstKeyPressed = false;
var bfiEnableButtonsOnFirstKeyPress = function(){
    if (!receivedFirstKeyPressed){
        setIsDisabledAllButton(false);
        var txButtons = getActiveDocument().getElementsByTagName('txbutton');
        txButtons.item(0).setAttribute('needsFocusUpdate', '1' );
        host.enableContinue();
        receivedFirstKeyPressed = true;
    }
};

var setIsDisabledAllButton = function(disabled){
    var txButtons = getActiveDocument().getElementsByTagName('txbutton');
    for (var i = 0; i != txButtons.length; i++) {
        var btn = txButtons.item(i);
        btn.setAttribute('isDisabled', disabled );
    };
};

// MARK: - BFI Renderer: XML Generator
var getTxelenmentXml = function(elenmentName, attributes){
    var elenment = "<" + elenmentName + " ";
    for (var key in attributes) {
        elenment += key + "='" + attributes[key] +"' ";
    }
    elenment += "/>\n ";
    return elenment;
};

var getBfiAnswerButtonXml = function(pageNumber, answerNumber, xCenter, answerLength){
    const buttonWidth = 92; // value measured with innovid screenshot
    var buttonAttributes = {
        "onselect": "bfiUserPickedAnswer("+pageNumber+", "+answerNumber+")",
        "id": "ans"+answerNumber+"-btn",
        "name": "ans-btn",
        "x": (xCenter-buttonWidth/2),
        "y": 493,
        "width": buttonWidth,
        "height": buttonWidth,
        "src": "https://media.truex.com/image_assets/2019-01-16/c0e699d4-db06-4d29-84e5-c62bc2b24542.png",
        "hover_src": "https://media.truex.com/image_assets/2019-01-16/deb0f5b5-14d1-47c2-8a33-d7b89ea5a1a2.png",
        "isDisabled": "true"
    };
    if (answerNumber==0){
        buttonAttributes.guide="bottom";
    } else if (answerNumber == answerLength-1){
        buttonAttributes.guide="right";
    }
    return getTxelenmentXml("txbutton", buttonAttributes);
};

var getBfiAnswerLabelXml = function(answerNumber, xCenter, labelWidth, answerText){
    var labelAttributes = {
        "id": "ans"+answerNumber,
        "name": "ans-label",
        "x": (xCenter-labelWidth/2),
        "y": 590,
        "width": labelWidth,
        "height": 150,      // 1 line is 50px, and here we have space for 3 lines
        "text": answerText,
        "color": BFI_GREY,
        "alignment": "center",
        "lineBreakMode": "NSLineBreakByWordWrapping"
    };
    return getTxelenmentXml("txlabel", labelAttributes);
};

var getProgressBarXml = function(surveyConfigLength, questionNumber){
    var progressBarXml = "";
    const finishBarWidth = 238;
    const spacing = 5;
    var progressTileWidth = (1920 - spacing * surveyConfigLength - finishBarWidth)/surveyConfigLength;
    if (progressTileWidth < spacing) {
        spacing = 0;
        progressTileWidth = (1920 - finishBarWidth)/surveyConfigLength;
    }
    const progressTileDefaultAttributes = {
        "id": "progressTile-",
        "name": "progressTile",
        "x": 0,
        "y": 2,
        "width": (progressTileWidth>1)?progressTileWidth:1,
        "height": 20,
        "text": "",
        "backgroundColor": BFI_GREY
    };
    const questionNumberDefaultAttributes = {
        "id": "questionNumber-",
        "name": "questionNumber",
        "x": 0,
        "y": 50,
        "width": (progressTileWidth>1)?progressTileWidth:1,
        "height": 25,
        "text": "",
        "color": BFI_GREY,
        "alignment": "center",
        "fontSize": "30"
    };

    // Question n text+tile
    for (var i = 0; i < surveyConfigLength; i++) {
        var progressTileAttributes = Object.assign({}, progressTileDefaultAttributes);
        progressTileAttributes.id += questionNumber;
        progressTileAttributes.x = (progressTileWidth + spacing) * i;
        if (i+1 <= questionNumber) {
            progressTileAttributes.backgroundColor = BFI_WHITE;
        }
        var progressTileXml = getTxelenmentXml("txlabel", progressTileAttributes);
        var questionNumberXml = "";
        // only show the current question number if number of question is >= 10
        // 10 is the hardcoded number based on questionNumberDefaultAttributes.fontSize = 30 and width = 1920
        if (surveyConfigLength < 10 || i+1 == questionNumber){
            var questionNumberAttributes = Object.assign({}, questionNumberDefaultAttributes);
            questionNumberAttributes.id += questionNumber;
            questionNumberAttributes.text = BFI_PROGRESS_BAR_QUESTION_TEXT_PREFIX + (i+1);
            questionNumberAttributes.x = (progressTileWidth + spacing) * i;
            // 170 is aneyeballed value with questionNumberDefaultAttributes.fontSize = 30 and text being "Question XX"
            const minimumWidth = 170;
            // apply minimum widht and center the label if needed
            if (questionNumberAttributes.width < minimumWidth) {
                questionNumberAttributes.x = questionNumberAttributes.x + questionNumberAttributes.width/2 - minimumWidth/2;
                if (questionNumberAttributes.x < 0){
                    questionNumberAttributes.x = 0;
                }
                questionNumberAttributes.width = minimumWidth;
            }
            if (i+1 == questionNumber) {
                questionNumberAttributes.color = BFI_WHITE;
            }
            questionNumberXml = getTxelenmentXml("txlabel", questionNumberAttributes);
        }
        progressBarXml += progressTileXml;
        progressBarXml += questionNumberXml;
    }

    // Finish text+tile
    var finishBarColor = BFI_DARK_GREEN;
    if (surveyConfigLength < questionNumber) {
        finishBarColor = BFI_GREEN;
    }
    var progressTileAttributes = Object.assign({}, progressTileDefaultAttributes);
    progressTileAttributes.id += "finish";
    progressTileAttributes.x = (progressTileWidth + spacing) * surveyConfigLength;
    progressTileAttributes.width = finishBarWidth;
    progressTileAttributes.backgroundColor = finishBarColor;
    var progressTileXml = getTxelenmentXml("txlabel", progressTileAttributes);
    var questionNumberAttributes = Object.assign({}, questionNumberDefaultAttributes);
    questionNumberAttributes.id += "finish";
    questionNumberAttributes.text = BFI_PROGRESS_BAR_FINSIH_TEXT;
    questionNumberAttributes.x = (progressTileWidth + spacing) * surveyConfigLength;
    questionNumberAttributes.width = finishBarWidth;
    questionNumberAttributes.color = finishBarColor;
    var questionNumberXml = getTxelenmentXml("txlabel", questionNumberAttributes);
    progressBarXml += progressTileXml;
    progressBarXml += questionNumberXml;

    return progressBarXml;
};

// MARK: - BFI Renderer: Helpers
function getJsonFrom(url, callback, errorCallback) {
    var templateXHR = new XMLHttpRequest();
    templateXHR.responseType = "json";
    templateXHR.addEventListener("load", function() {
                                     if (callback){
                                        callback(templateXHR);
                                     }
                                 }, false);
    templateXHR.addEventListener("error", function() {
                                     if (errorCallback){
                                        errorCallback(templateXHR);
                                     }
                                 }, false);
    templateXHR.open("GET", url, true);
    templateXHR.send();
};

var firePixelWithUrl = function(url, done) {
    if (!url){
        if (done){
            done("error");
        }
        return;
    }
    var request = new XMLHttpRequest();
    request.responseType = 'arraybuffer';
    request.addEventListener('load', function() {
                                 if (done) {
                                    done(request);
                                 }
                             }, false);
    request.open('GET', url, true);
    request.send();
};

var fillMacroWithUrl = function(url) {
    url = url.replace('#{request.networkId}', escape(Device.appIdentifier));
    url = url.replace('#{request.deviceId}', escape(Device.vendorIdentifier));
    url = url.replace('#{ad.ref.random}', escape(UUID()));
    url = url.replace('#{user.id}', escape(host.getUserId()));
    url = url.replace(/=#.*?}/ig, '=');
    return url;
};

// following is the original core.js from TAR
// updated on 01/23/19

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

//
//  TruexTvmlCore.js
//
//  Created by Simon Asselin on 1/27/18.
//  Copyright © 2018 true[X]. All rights reserved.
//

// MARK: - App Event Handlers

App.onLaunch = function(options) {
    console.log("App.onLaunch");
    host.debugLog("TruexTvmlCore.js App.onLaunch");

    videoPlayerManager = new VideoPlayerManager();
}

App.onWillResignActive = function() {
    console.log("App.onWillResignActive");
    host.debugLog("TruexTvmlCore.js App.onWillResignActive");
}

App.onDidEnterBackground = function() {
    console.log("App.onDidEnterBackground");
    host.debugLog("TruexTvmlCore.js App.onDidEnterBackground");
}

App.onWillEnterForeground = function() {
    console.log("App.onWillEnterForeground");
    host.debugLog("TruexTvmlCore.js App.onWillEnterForeground");
}

App.onDidBecomeActive = function() {
    console.log("App.onDidBecomeActive");
    host.debugLog("TruexTvmlCore.js App.onDidBecomeActive");
}

App.onWillTerminate = function() {
    console.log("App.onWillTerminate");
    host.debugLog("TruexTvmlCore.js App.onWillTerminate");
}

App.onError = function(message, sourceURL, line) {
    console.log("onError");
    host.debugLog("TruexTvmlCore.js onError");
    host.debugLog("TruexTvmlCore.js onError message: " + message);
    host.debugLog("TruexTvmlCore.js onError sourceURL: " + sourceURL);
    host.debugLog("TruexTvmlCore.js onError line: " + line);
    videoPlayerManager.pauseAllPlayers();
}

App.onExit = function(options) {
    console.log("onExit");
    host.debugLog("TruexTvmlCore.js onExit");
    videoPlayerManager.stopAllPlayers();
}

App.onResume = function(options) {
    console.log("onResume");
    host.debugLog("TruexTvmlCore.js onResume");

    // if AYS is presented/active, coming back from background/ending siri input should not resume audio
    if (!host.isAreYouSureScreenPresented()){
        videoPlayerManager.resumePausedPlayers();
        host.resumeTimersAsAppropriate();
    }
    host.resumeFromDeeplinkAsAppropriate();
}

App.onSuspend = function(options) {
    console.log("onSuspend");
    host.debugLog("TruexTvmlCore.js onSuspend");
    videoPlayerManager.pauseAllPlayers();
}

// MARK: - Video Player Manager & Related

var videoPlayerManager;
var VideoPlayerManager = function() {
    this.videoPlayers = {};
    this.pausedPlayers = [];
    this.getAllPlayers = function() {
        return this.videoPlayers;
    }
    this.getPlayerByKey = function(key){
        return this.videoPlayers[key];
    }
    this.setNewPlayer = function(key, player){
        if (this.videoPlayers[key] && this.videoPlayers[key].playbackState==="playing"){     // if there is an existing player, stop it first before creating a new one
            this.videoPlayers[key].truexPauseOverride = true;
            this.videoPlayers[key].pause();
        }
        this.videoPlayers[key] = player;
        return this.videoPlayers[key];
    }
    this.getNewPlayer = function(key){
        var newPlayer = new Player();
        newPlayer.truexVideoPlayerType = "tvjs";
        if (!key || key===""){
            do {
                key = "truex_video_player_" + Math.random().toString(36).substr(2, 9);
            } while (this.videoPlayers[key]);
        }
        this.setNewPlayer(key, newPlayer);
        return this.videoPlayers[key];
    }
    this.setNewNativePlayerWithElementId = function(key, element){
        var nativeVideoPlayer = new nativeVideoPlayerAdapter(element);
        this.videoPlayers[key] = nativeVideoPlayer;
        return this.videoPlayers[key];
    }
    this.pauseAllPlayers = function(){
        host.debugLog("TruexTvmlCore.js pauseAllPlayers");
        if (!(this.pausedPlayers && Array.isArray(this.pausedPlayers))){
            this.pausedPlayers = [];
        }
        for (var key in this.videoPlayers){
            host.debugLog("TruexTvmlCore.js pauseAllPlayers key: " + key);
            if (this.videoPlayers[key] && this.videoPlayers[key].playbackState==="playing"){
                this.videoPlayers[key].truexPauseOverride = true;
                this.videoPlayers[key].pause();
                if (this.pausedPlayers.indexOf(this.videoPlayers[key])===-1){
                    this.pausedPlayers.push(this.videoPlayers[key]);
                }
            }
        }
    }
    this.resumePausedPlayers = function(){
        host.debugLog("TruexTvmlCore.js resumePausedPlayers");
        while (this.pausedPlayers.length>0){
            var videoPlayer = this.pausedPlayers.pop();
            if (videoPlayer &&videoPlayer.playbackState==="paused"){
                videoPlayer.truexPauseOverride = false;
                videoPlayer.play();
            }
        }
    }
    this.resumeAllPlayers = function(){
        host.debugLog("TruexTvmlCore.js resumeAllPlayers");
        for (var key in this.videoPlayers){
            host.debugLog("TruexTvmlCore.js resumeAllPlayers key: " + key);
            if (this.videoPlayers[key]) {
                host.debugLog("TruexTvmlCore.js resumeAllPlayers this.videoPlayers[key].playbackState: " + this.videoPlayers[key].playbackState);
            }
            if (this.videoPlayers[key] && this.videoPlayers[key].playbackState==="paused"){
                this.videoPlayers[key].truexPauseOverride = false;
                this.videoPlayers[key].play();
            }
        }
        this.pausedPlayers = [];
    }
    this.stopAllPlayers = function(){
        for (var key in this.videoPlayers){
            if (this.videoPlayers[key]){
                this.videoPlayers[key].stop();
            }
        }
    }
    this.setAllPlayersInteractiveOverlayDismissable = function(dismissable){
        for (var key in this.videoPlayers){
            if (this.videoPlayers[key]){
                this.videoPlayers[key].interactiveOverlayDismissable = dismissable;
            }
        }
    }
    this.clearPlayerByKey = function(key){
        if (this.videoPlayers[key] && this.videoPlayers[key].playbackState==="playing"){
            this.videoPlayers[key].truexPauseOverride = true;
            this.videoPlayers[key].pause();
        }
        this.videoPlayers[key] = null;
    }
}

// this object keep track of a <txvideo>
var nativeVideoPlayerAdapter = function(element){
    this.videoElement = element;
    this.truexVideoPlayerType = "native";
    this.playbackState = "playing";
    this.play = function() {
        this.playbackState = "playing";
        host.debugLog("TruexTvmlCore.js this.videoElement playing: " + this.videoElement);
        this.videoElement.setAttribute('action', 'play');
    }
    this.pause = function() {
        this.playbackState = "paused";
        this.videoElement.setAttribute('action', 'pause');
        host.debugLog("TruexTvmlCore.js this.videoElement paused: " + this.videoElement);
        console.log(this.videoElement);
    }
    this.stop = function() {
        this.playbackState = "end";
        this.videoElement.setAttribute('action', 'pause');
    }

    // native only functions
    this.setVideoSrc = function(videoUrl) {
        this.playbackState = "playing";
        this.videoElement.setAttribute('src', videoUrl);
    }
}

var truexVideoBackgroundEval = function(truexVideoBackgroundEvalExpression){
    videoPlayerManager.pauseAllPlayers();

    var parser = new DOMParser();
    var truexPostVideoBackground = parser.parseFromString(`<document><alertTemplate><truexPostVideoBackground/></alertTemplate></document>`, "application/xml");

    truexPostVideoBackground.addEventListener('disappear', function(event){
                                              truexPostVideoBackground.addEventListener('appear', function(event){
                                                                                        var truexVideoBackground = videoPlayerManager.getPlayerByKey("truexVideoBackground");
                                                                                        if (truexVideoBackground && truexVideoBackground.truexOverlayDocument){
                                                                                        truexVideoBackground.interactiveOverlayDocument = truexVideoBackground.truexOverlayDocument;
                                                                                        }
                                                                                        navigationDocument.removeDocument(truexPostVideoBackground);
                                                                                        });
                                              });

    var truexVideoBackground = videoPlayerManager.getPlayerByKey("truexVideoBackground");
    if (truexVideoBackground){
        truexVideoBackground.truexOverlayDocument = truexVideoBackground.interactiveOverlayDocument;
        truexVideoBackground.interactiveOverlayDocument = null;
        truexVideoBackground.truexExpectingOverlayDocumentDismiss = true;
    }

    // will have to wait until the document is on the stack to call host
    truexPostVideoBackground.addEventListener('load', function(event){
                                              eval(truexVideoBackgroundEvalExpression);
                                              });

    navigationDocument.pushDocument(truexPostVideoBackground);
}

var pushWithTruexVideoBackground = function(document, loadingDoc){
    // create and push a dummy document. Having only the video on the TVML stack will make the interactiveOverlay dismissable
    // as described as jfoo(Apple Staff), this seems to be a bug
    // https://forums.developer.apple.com/message/298397
    var parser = new DOMParser();
    var truexPreVideoBackground = parser.parseFromString(`<document><alertTemplate><truexPreVideoBackground/></alertTemplate></document>`, "application/xml");


    if (loadingDoc) {
        navigationDocument.replaceDocument(truexPreVideoBackground, loadingDoc);
    } else {
        navigationDocument.pushDocument(truexPreVideoBackground);
    }

    // document should listen to disappear event to also stop the video player, just incase (the auto timeout will not stop video player correctly)
    document.addEventListener("disappear", function(event){
                              var truexVideoBackground = videoPlayerManager.getPlayerByKey("truexVideoBackground");
                              if (truexVideoBackground){
                              if (truexVideoBackground.truexExpectingOverlayDocumentDismiss) {
                              // document dismiss because truexVideoBackgroundEval
                              truexVideoBackground.truexExpectingOverlayDocumentDismiss = false;

                              truexVideoBackground.truexPauseOverride = true;
                              truexVideoBackground.pause();
                              } else {
                              truexVideoBackground.stop();
                              }
                              } else {
                              videoPlayerManager.pauseAllPlayers();
                              }
                              });

    document.addEventListener("appear", function(event){
                              var truexVideoBackground = videoPlayerManager.getPlayerByKey("truexVideoBackground");

                              // the play action would be allow only when it is not at the end of the video,
                              // this behavior is defined in truexVideoBackground's EventListener -- "shouldHandleStateChange"
                              if (truexVideoBackground){
                              truexVideoBackground.play();
                              }
                              });

    // get attribute value from background > truexVideoBackground Tag
    var src = "";
    var buttonDelay = 0;    //button_delay
    var timerSeconds = 0;  //timer_seconds
    if (document.getElementsByTagName("background") && document.getElementsByTagName("background").item(0) ){
        var background = document.getElementsByTagName("background").item(0);
        if (background.getElementsByTagName("truexVideoBackground") && background.getElementsByTagName("truexVideoBackground").item(0)){
            var truexVideoBackground = background.getElementsByTagName("truexVideoBackground").item(0);
            var videoSrc = truexVideoBackground.getAttribute("src");
            if (videoSrc && videoSrc!=""){
                src = videoSrc;
            }
            var videoButtonDelay = Number(truexVideoBackground.getAttribute("button_delay"));
            if ( videoButtonDelay && !isNaN(videoButtonDelay)){
                buttonDelay = videoButtonDelay;
                if (buttonDelay < 0){
                    buttonDelay = 0;
                }
            }
            var videoTimerSeconds = Number(truexVideoBackground.getAttribute("timer_seconds"));
            if ( videoTimerSeconds && !isNaN(videoTimerSeconds)){
                timerSeconds = videoTimerSeconds;
                if (timerSeconds < 0){
                    timerSeconds = 0;
                }
            }
        }
    }

    // set up video and its listeners
    var singleVideo = new MediaItem('video', src);
    var videoList = new Playlist();
    videoList.push(singleVideo);
    var truexVideoBackgroundPlayer = videoPlayerManager.getNewPlayer("truexVideoBackground");
    truexVideoBackgroundPlayer.playlist = videoList;
    truexVideoBackgroundPlayer.interactiveOverlayDismissable = false;

    truexVideoBackgroundPlayer.addEventListener("stateDidChange", function(event) {
                                                // this event listener is to dismiss the empty document when video is pop
                                                truexPreVideoBackground.addEventListener('appear', function(event){
                                                                                         // we probably don't need popToDocument(truexPreVideoBackground), but just incase
                                                                                         navigationDocument.popToDocument(truexPreVideoBackground);
                                                                                         // originally we used `navigationDocument.popDocument();` to dismiss this empty document,
                                                                                         // now, dismiss is handled by the menuKeyPushed function, which also do other logics (canceling timer, stream etc.)
                                                                                         host.menuKeyPushed();
                                                                                         });
                                                // truexVideoBackgroundPlayer.currentMediaItemDuration is 0 before this event
                                                if (event.state === "playing"){

                                                //timeBoundaryDidCross will not fire when video end
                                                var videoBackgoundLength = truexVideoBackgroundPlayer.currentMediaItemDuration - 0.1;
                                                if (videoBackgoundLength < timerSeconds || timerSeconds==0){
                                                timerSeconds = videoBackgoundLength;
                                                }
                                                if (timerSeconds < buttonDelay){
                                                buttonDelay = timerSeconds - 0.1;
                                                }
                                                // timeBoundaryDidCross event will not be fired when buttonDelay is 0
                                                if (buttonDelay==0){
                                                buttonDelay = 0.1;
                                                }
                                                var videoStartSeconds = 0.1;
                                                var videoFirstQuartileSeconds  = Number( (timerSeconds/4*1).toFixed(1) );
                                                var videoSecondQuartileSeconds = Number( (timerSeconds/4*2).toFixed(1) );
                                                var videoThirdQuartileSeconds  = Number( (timerSeconds/4*3).toFixed(1) );

                                                truexVideoBackgroundPlayer.addEventListener("timeBoundaryDidCross", function(event) {
                                                                                            var videoUrl = "";
                                                                                            if (truexVideoBackgroundPlayer && truexVideoBackgroundPlayer.currentMediaItem){
                                                                                            videoUrl = truexVideoBackgroundPlayer.currentMediaItem.url;
                                                                                            }

                                                                                            if (event.boundary == buttonDelay){
                                                                                            if (!truexVideoBackgroundPlayer.interactiveOverlayDocument){
                                                                                            truexVideoBackgroundPlayer.interactiveOverlayDocument = document;
                                                                                            }
                                                                                            }
                                                                                            if (event.boundary == videoStartSeconds){
                                                                                            //host.trackEventWithNameEventValue("trackVideoStartedWithVideoName", videoUrl);

                                                                                            // or build your own arguments and call the general trackEventWithPath

                                                                                            // var gifPixelPath = "i.gif";
                                                                                            // var arguments = { "category" : "multimedia",
                                                                                            //                   "name" : "video_started",
                                                                                            //                   "step" : "1",
                                                                                            //                   "value" : videoUrl
                                                                                            //                  };
                                                                                            // var isChoiceEvent = false;
                                                                                            // host.trackEventWithPathArgumentsIsChoiceEvent(gifPixelPath, arguments, isChoiceEvent)
                                                                                            }
                                                                                            if (event.boundary == videoFirstQuartileSeconds){
                                                                                            //host.trackEventWithNameEventValue("trackVideoFirstQuartileWithVideoName", videoUrl);
                                                                                            }
                                                                                            if (event.boundary == videoSecondQuartileSeconds){
                                                                                            //host.trackEventWithNameEventValue("trackVideoSecondQuartileWithVideoName", videoUrl);
                                                                                            }
                                                                                            if (event.boundary == videoThirdQuartileSeconds){
                                                                                            //host.trackEventWithNameEventValue("trackVideoThirdQuartileWithVideoName", videoUrl);
                                                                                            }

                                                                                            if (event.boundary == timerSeconds){    //Completed
                                                                                            truexVideoBackgroundPlayer.truexPauseOverride = true;
                                                                                            truexVideoBackgroundPlayer.pause();
                                                                                            //host.trackEventWithNameEventValue("trackVideoCompletedWithVideoName", videoUrl);
                                                                                            }
                                                                                            }, [buttonDelay, timerSeconds, videoStartSeconds, videoFirstQuartileSeconds, videoSecondQuartileSeconds, videoThirdQuartileSeconds]);
                                                }
                                                });


    truexVideoBackgroundPlayer.addEventListener("playbackError", function(event){
                                                truexPreVideoBackground.addEventListener('appear', function(event){
                                                                                         // show the plain document if video playback failed
                                                                                         videoPlayerManager.clearPlayerByKey("truexVideoBackground");

                                                                                         // and display the backup background image
                                                                                         var background = document.getElementsByTagName("background").item(0);
                                                                                         if (background.getElementsByTagName("truexVideoBackground") && background.getElementsByTagName("truexVideoBackground").item(0)){
                                                                                         var truexVideoBackground = background.getElementsByTagName("truexVideoBackground").item(0);
                                                                                         truexVideoBackground.outerHTML = truexVideoBackground.outerHTML.replace(/truexVideoBackground/g,"img");
                                                                                         }
                                                                                         if (background.getElementsByTagName("img") && background.getElementsByTagName("img").item(0)){
                                                                                         var truexImageBackground = background.getElementsByTagName("img").item(0);
                                                                                         var imageSrc = truexImageBackground.getAttribute("imageSrc");
                                                                                         if (imageSrc && imageSrc!==""){
                                                                                         truexImageBackground.setAttribute("src", imageSrc);
                                                                                         }
                                                                                         }

                                                                                         navigationDocument.replaceDocument(document, truexPreVideoBackground);
                                                                                         });
                                                });

    truexVideoBackgroundPlayer.addEventListener("playbackDidStall", function(event){
                                                // if the playback stall, make sure the control is being shown
                                                if (!truexVideoBackgroundPlayer.interactiveOverlayDocument && document){
                                                truexVideoBackgroundPlayer.interactiveOverlayDocument = document;
                                                }
                                                });

    truexVideoBackgroundPlayer.play();

    // this will disallow seek, and/or other player actions
    truexVideoBackgroundPlayer.addEventListener("shouldHandleStateChange", function(event) {
                                                var shouldHandleStateChange = false;
                                                if (event.state==="paused" && event.target.truexPauseOverride){
                                                event.target.truexPauseOverride = false;
                                                shouldHandleStateChange = true;
                                                }
                                                // do not allow playback if it is toward the end of the video
                                                if (event.state==="playing"){
                                                if (event.elapsedTime+0.5 < event.duration){
                                                shouldHandleStateChange = true;
                                                }
                                                }
                                                return shouldHandleStateChange;
                                                });
}

//// helpers
var hasTruexVideoBackgound = function(document) {
    if (document.getElementsByTagName("background") && document.getElementsByTagName("background").item(0) ){
        var background = document.getElementsByTagName("background").item(0);
        if (background.getElementsByTagName("truexVideoBackground") && background.getElementsByTagName("truexVideoBackground").item(0)){
            var truexVideoBackground = background.getElementsByTagName("truexVideoBackground").item(0);
            var videoSrc = truexVideoBackground.getAttribute("src");
            if (videoSrc && videoSrc!=""){
                return true;
            }
        }
    }

    return false;
}

var getNativeVideoNameOrUrl = function(videoElement){
    var videoUrl = videoElement.target.attributes.getNamedItem("src").value;
    var videoName = videoElement.target.getAttribute("truexVideoName");
    if (!videoName || videoName===""){
        videoName = videoUrl;
    }
    return videoName;
}

// this function look at all sections and set up video player and listeners accordingly for "choose your own video"
var highlightVideoSetup = function(document){

    var sections = document.getElementsByTagName("section");
    if (!sections || sections.length<=0){
        return;
    }

    for (var sectionIndex = 0; sectionIndex < sections.length; sectionIndex++){
        var section = sections.item(sectionIndex);

        // if section requires video playback
        var containerId = section.getAttribute("truexVideoContainerId");
        if (!containerId || containerId===""){
            continue;
        }

        // native, or mediaContent, feature support for other player type
        var containerType = section.getAttribute("truexVideoContainerType");
        if (containerType != "native"){
            continue;
        }

        // should be onclick or highlight
        var playbackMode = section.getAttribute("truexPlaybackMode");
        if (playbackMode!="onclick"){
            // default to highlight
            playbackMode = "highlight";
        }

        var nativeVideoPlayerElement = document.getElementById(containerId);
        videoPlayerManager.setNewNativePlayerWithElementId(containerId, nativeVideoPlayerElement);
        document.addEventListener("disappear", function(event){
                                  videoPlayerManager.pauseAllPlayers();
                                  })

        var lockups = section.getElementsByTagName("lockup");
        if (!lockups || lockups.length<=0){
            continue;
        }

        for (var lockupIndex = 0; lockupIndex < lockups.length; lockupIndex++){
            var lockup = lockups.item(lockupIndex);

            // set attribute into lockup for easier access
            lockup.setAttribute("truexVideoContainerId", containerId);

            // depends on playback mode settting, listen to different events
            var playbackListenerEvent = "highlight";
            if (playbackMode == "onclick"){
                playbackListenerEvent = "select";
                // also set up the first video
                if (lockupIndex==0){

                    var videoUrl = lockup.getAttribute("truexVideoSrc");
                    var videoName = lockup.getAttribute("truexVideoName");

                    if (videoUrl && videoUrl!=="" && containerId && containerId!==""){
                        var player = videoPlayerManager.getPlayerByKey(containerId);
                        if (!player || player.truexVideoPlayerType!="native"){
                            return;
                        }
                        player.videoElement.setAttribute("truexVideoName", videoName);
                        player.setVideoSrc(videoUrl);
                        player.play();
                    }
                }

            } else {
                lockup.addEventListener("select", function(event){
                                        var containerId = event.target.getAttribute("truexVideoContainerId");
                                        var player = videoPlayerManager.getPlayerByKey(containerId);
                                        if (player){
                                        player.play();
                                        }
                                        });

            }

            lockup.addEventListener(playbackListenerEvent, function(event){

                                    var containerId = event.target.getAttribute("truexVideoContainerId");
                                    var videoUrl = event.target.getAttribute("truexVideoSrc");
                                    var videoName = event.target.getAttribute("truexVideoName");

                                    if (videoUrl && videoUrl!=="" && containerId && containerId!==""){
                                    var player = videoPlayerManager.getPlayerByKey(containerId);
                                    if (!player || player.truexVideoPlayerType!="native"){
                                    return;
                                    }
                                    player.videoElement.setAttribute("truexVideoName", videoName);
                                    player.setVideoSrc(videoUrl);
                                    player.play();
                                    }
                                    } )


        }

    }

}


// MARK: - Card and TVML Life Cycle
//

var parseAndPush = function(xmlString, stepName, shouldReplace, shouldUseLoadingScreen) {
    console.log('parseAndPush');
    host.debugLog('TruexTvmlCore.js parseAndPush, stepName: ' + stepName + ' shouldReplace: ' + shouldReplace);

    const loadingDoc = createLoadingDocument();

    if (typeof navigationDocument === "undefined"){
        host.debugLog("TruexTvmlCore.js parseAndPush error: no navigationDocument");
        return;
    }

    if (shouldUseLoadingScreen) {
        showDocument(loadingDoc, shouldReplace);
    }

    try {
        videoPlayerManager.pauseAllPlayers();

        var parser = new DOMParser();
        var currentDoc = parser.parseFromString(xmlString, "application/xml");

        if (currentDoc) {
            // This first call to "fetch" the background sound config has the
            // desirable side effect of clearing the sound src which prevents
            // Apple from screwing it up.
            fetchBackgroundSoundConfig(currentDoc);

            if (hasTruexVideoBackgound(currentDoc)) {
                pushWithTruexVideoBackground(currentDoc, loadingDoc);
            }
            else {
                if (loadingDoc) {
                    if (getActiveDocument()==loadingDoc){
                        navigationDocument.replaceDocument(currentDoc, loadingDoc);
                    } else {
                        if (shouldUseLoadingScreen){
                            host.debugLog("TruexTvmlCore.js parseAndPush error: " + "the top document isn't the loading docs, you called parseAndPush twice?");
                            // fall back, this might leave loading in the navigationDocument, not ideal, but better then fail
                            navigationDocument.pushDocument(currentDoc);
                        } else {
                            showDocument(currentDoc, shouldReplace);
                        }
                    }
                } else {
                    navigationDocument.pushDocument(currentDoc);
                }
            }

            // Run post parse actions, typically installing handlers for dynamic behavior.
            setupSoundHandler(currentDoc);
            runTemplateAction(currentDoc);
            highlightVideoSetup(currentDoc);
            setupTXVideos(currentDoc);
            setupTxgame(currentDoc);
            setupPageTracking(currentDoc, stepName);
            setupAttentionHandlers(currentDoc);
            setupPollHandler(currentDoc);

            setupTimeoutHandler(currentDoc);

            setupExtraSoundPlayerHandler(currentDoc);
        }
    }
    catch (error) {
        host.debugLog("TruexTvmlCore.js parseAndPush error: " + error.message);
        host.cardFail("Invalid TVML, failing ad.");
    }
}

var showDocument = function(currentDoc, shouldReplace) {
    if (shouldReplace) {
        const oldDoc = getActiveDocument();
        navigationDocument.replaceDocument(currentDoc, oldDoc);
    } else {
        navigationDocument.pushDocument(currentDoc);
    }
}

// This handler handle the choice card time out event in Javascript side
var truexChoiceCardTimeoutObj;
var setupTimeoutHandler = function(currentDoc) {
    // get timeout seconds from tvml
    var timeoutSeconds = 0;
    if (currentDoc) {
        var currentTemplateDoc = currentDoc.getElementsByTagName("document").item(0).lastChild;
        if (currentTemplateDoc && currentTemplateDoc.hasAttribute("truexChoiceCardTimeout")){
            timeoutSeconds = Number(currentTemplateDoc.getAttribute("truexChoiceCardTimeout"));
        }
    }

    if (!isNaN(timeoutSeconds) && (timeoutSeconds>0)){
        currentDoc.addEventListener("appear", function(event) {
            if (truexChoiceCardTimeoutObj){
                clearTimeout(truexChoiceCardTimeoutObj);
            }
            truexChoiceCardTimeoutObj = setTimeout(function(){
                host.cardChooseWatch();
            }, Number(timeoutSeconds)*1000);
        });
        currentDoc.addEventListener("disappear", function(event) {
            if (truexChoiceCardTimeoutObj){
                clearTimeout(truexChoiceCardTimeoutObj);
            }
        });
    }
}

// This handler resets the sound playback for the current card.
var setupSoundHandler = function(currentDoc) {
    // Handling this on `appear` means we reset the sound state on every parse and push
    // or card load. The host sound handling will continue a previous card's sound
    // if the new card is the same file.
    currentDoc.addEventListener("appear", function(event) {
        if (event && event.target) {
            var thisDoc = event.target;
            var soundConfig = fetchBackgroundSoundConfig(thisDoc);
            if (soundConfig) {
                host.debugLog("setupSoundHandler callback: triggering background sound: " + soundConfig.url);
                host.playBackgroundSoundWithUrlLoop(soundConfig.url, soundConfig.loop);
            }
        }
    });
}

// Fetch background sound configuration from tvml and delegate to the native AVPlayer.
// This is to address Apple's broken tvml background audio implementation which
// cannot be silenced in certain cases: TXT-9993.
var fetchBackgroundSoundConfig = function(currentDoc) {
    var retVal = {
        url : "",
        loop : false
    };

    host.debugLog("handleBackgroundSound, looking for sound information...!");
    if (currentDoc.getElementsByTagName("background") && currentDoc.getElementsByTagName("background").length &&
        currentDoc.getElementsByTagName("background").item(0).getElementsByTagName("audio") && currentDoc.getElementsByTagName("background").item(0).getElementsByTagName("audio").length &&
        currentDoc.getElementsByTagName("background").item(0).getElementsByTagName("audio").item(0).getElementsByTagName("asset") &&
        currentDoc.getElementsByTagName("background").item(0).getElementsByTagName("audio").item(0).getElementsByTagName("asset").length > 0) {
        var audioTag = currentDoc.getElementsByTagName("background").item(0).getElementsByTagName("audio").item(0);
        var loopArg = audioTag.getAttribute("loop");
        loopArg = loopArg && loopArg.length && loopArg.toLowerCase() == "false" ? false : true;
        var assetTag = audioTag.getElementsByTagName("asset").item(0);
        var soundUrl = assetTag.getAttribute("src");
        if (!soundUrl || !soundUrl.length) {
            soundUrl = assetTag.getAttribute("txSrc") ? assetTag.getAttribute("txSrc") : "";
        }
        host.debugLog("handleBackgroundSound, found audio/asset tag: " + soundUrl);
        // Clear out the src element which is the officially supported Apple schema, so that Apple doesn't
        // try to handle this. But save the old value in txSrc so we can get it back for re-entrancy.
        // For instance, in navigation when the card is navigated to the second time in a given engagement.
        assetTag.setAttribute("src", "");
        assetTag.setAttribute("txSrc", soundUrl);

        retVal = {
            url : soundUrl,
            loop : loopArg
        };
    }

    return retVal;
}

// Installs handler for all <lockup> tags 'highlight' messages. Basically captures focus
// changes on the built-in TVML tags used in our interactions.
var attentionFlag = false;

var setupAttentionHandlers = function(currentDoc) {
    if (!currentDoc) {
        return;
    }

    var lockups = currentDoc.getElementsByTagName("lockup");
    if (!lockups || lockups.length <= 0){
        return;
    }

    // when appear, or reappear, make sure the first highlight does not flagActivityForAttention
    currentDoc.addEventListener("appear", function(event){
        attentionFlag = false;
    });

    for (var lockupIndex = 0; lockupIndex < lockups.length; lockupIndex++) {
        var lockup = lockups.item(lockupIndex);

        // First, back up regular state image src url's, so they can be reset later in highlight handlers.
        var images = lockup.getElementsByTagName("img");
        if (images && images.length && images.item(0)) {
            var image = images.item(0);
            image.setAttribute("truexNormalSrc", image.getAttribute("src"));
        }

        // Install highlight event handler to switch out img to on focus state based on
        // value of "truexHighlightSrc" on img. Only supported under collectionList
        // elements.
        lockup.addEventListener("highlight", function(event) {
                                    if (event && event.target) {
                                        var parentNode = event.target.parentNode;
                                        while (parentNode && parentNode.tagName != "collectionList") {
                                            parentNode = parentNode.parentNode;
                                        }

                                        if (!parentNode) {
                                            host.debugLog("setupAttentionHandlers: could not find parent collectionList exiting...");
                                            return;
                                        }

                                        // Resetting default unfocused images first.
                                        var lockups = parentNode.getElementsByTagName("lockup");
                                        if (lockups && lockups.length > 0) {
                                            for (var lockupIndex = 0; lockupIndex < lockups.length; lockupIndex++) {
                                                var lockup = lockups.item(lockupIndex);
                                                var images = lockup.getElementsByTagName("img");
                                                if (!images || images.length<=0) {
                                                    continue;
                                                }

                                                var image = images.item(0);
                                                if (image.getAttribute && image.getAttribute) {
                                                    image.setAttribute("src", image.getAttribute("truexNormalSrc"));
                                                }
                                            }
                                        }

                                        // And then highlight the focused image.
                                        var currentImages = event.target.getElementsByTagName("img");
                                        if (currentImages.length > 0) {
                                            var currentImage = currentImages.item(0);
                                            var truexHighlightSrc = currentImage.getAttribute("truexHighlightSrc");
                                            if (truexHighlightSrc && truexHighlightSrc.length) {
                                                currentImage.setAttribute("src", truexHighlightSrc);
                                            }
                                        }
                                    }

                                    if (!attentionFlag) {
                                        host.debugLog("setupAttentionHandlers: calling into host attention flag, do nothing the first time");
                                        attentionFlag = true;
                                    }
                                    else {
                                        host.debugLog("setupAttentionHandlers: calling into host attention flag");
                                        host.flagActivityForAttention();
                                    }
                                });

    }
}

var setupPollHandler = function(currentDoc){
    var pollResultDisplay = currentDoc.getElementById("truexPollResult");
    if (pollResultDisplay){
        currentDoc.addEventListener("appear", function(event) {
                                    var voteSummary = host.getVoteSummary();

                                    if (voteSummary.length<=0){
                                        host.debugLog("voteSummary is null");
                                    }

                                    var maxVoteCount = 0;
                                    for (var voteDetailIndex in voteSummary){
                                        var voteDetail = voteSummary[voteDetailIndex];
                                        if (!voteDetail){
                                            continue;
                                        }

                                        if (Number(voteDetail.vote_count) > maxVoteCount){
                                            maxVoteCount = Number(voteDetail.vote_count);
                                        }
                                    }

                                    // normalize vote count
                                    // TODO: read the screenMaxWidth from some setting
                                    var screenMaxWidth = 1300;
                                    for (var voteDetailIndex in voteSummary){
                                        var voteDetail = voteSummary[voteDetailIndex];
                                        if (!voteDetail){
                                            continue;
                                        }
                                        voteDetail.vote_count = Number( screenMaxWidth / maxVoteCount * voteDetail.vote_count ).toFixed(0);
                                    }

                                    var images = pollResultDisplay.getElementsByTagName("img");
                                    // TODO: other types of elenments too
                                    for (var i=0; i <images.length; i++){
                                        if (images.item(i) && images.item(i).hasAttribute("truexPollAnswerId")){
                                            images.item(i).setAttribute("width", 0);
                                            // get attribute value from truexPollAnswerId
                                            var truexPollAnswerId = images.item(i).getAttribute("truexPollAnswerId");
                                            // then find that vote/answerId from the array
                                            for (var voteDetailIndex in voteSummary){
                                                var voteDetail = voteSummary[voteDetailIndex];
                                                if (!voteDetail){
                                                    continue;
                                                }
                                                if (voteDetail.vote == truexPollAnswerId){
                                                    images.item(i).setAttribute("width", voteDetail.vote_count);
                                                }
                                            }
                                        }

                                    }

                                    });
    }
}

var setupPageTracking = function(currentDoc, stepName){
    if (stepName) {
        var currentTemplateDoc = currentDoc.getElementsByTagName("document").item(0).lastChild;
        if (currentTemplateDoc && !currentTemplateDoc.hasAttribute("truexStepName")){
            // set the stepName to template document as attribute
            currentTemplateDoc.setAttribute("truexStepName", stepName);
        }
    }

    // actual tracking, will read whatever is on the event.target.getAttribute("truexStepName")
    // becasue we did not override the existing truexStepName attribute, ad template will be able to set their own name by setting the truexStepName attribute
    currentDoc.addEventListener("appear", function(event) {
        host.debugLog("document appear event");
        host.resumeTimersAsAppropriate();
        host.resumeFromDeeplinkAsAppropriate();
        if (event && event.target && event.target.getAttribute) {
            var truexStepName = event.target.getAttribute("truexStepName");
            if (truexStepName){
                host.trackEventWithNameEventValue("trackGotoWithStep", truexStepName);
                // Call the host to notify of card load completion. This implements a callback process enabling us
                // to drive behavior from the time a card actually appears on screen, for instance countdown timers.
                host.onShowTvmlStepCompleteWithName(truexStepName);
            }
        }

        // capture initial hightlight
        // will there ever be a step where there is no highlight-able element - and the watch button is never re-enabled?
        // ^ Yes, if the TVML is written with only `button` elements as focusable elements, then this can happen.
        const didHighlight = function() {
            currentDoc.removeEventListener('highlight', didHighlight);
            host.enableContinue();
        };
        currentDoc.addEventListener('highlight', didHighlight);
    });
}

/**
 * This convenience funnction returns an alert template, which can be used to present errors to the user.
 */
var createAlert = function(title, description) {

    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
    <alertTemplate>
    <title>${title}</title>
    <description>${description}</description>
    <button>
    <text>Interact</text>
    </button>
    <button>
    <text>Skip</text>
    </button>
    <text>Interact will call a Native view controller, Skip will go back.</text>
    </alertTemplate>
    </document>`

    var parser = new DOMParser();
    var alertDoc = parser.parseFromString(alertString, "application/xml");
    alertDoc.addEventListener('select', handleSelectEvent);

    return alertDoc;
}

var runTemplateAction = function(doc) {
    const docElement = doc.getElementsByTagName("document").item(0);

    if (docElement.attributes.getNamedItem("controller")) {
        const controller = docElement.attributes.getNamedItem("controller").value;

        let action;
        if (docElement.attributes.getNamedItem("action")) {
            action = docElement.attributes.getNamedItem("action").value;
        }

        console.log(controller, action);

        if (controller) {
            const ctrl = TemplateControllers[controller];

            try {
                if (action) {
                    ctrl[action](doc);
                } else {
                    ctrl(doc);
                }
            } catch (error){
                host.debugLog("TruexTvmlCore.js runTemplateAction error: " + error.message);
                host.cardFail("Failed to run controller, failing ad.");
            }
        }
    }
};

// default loading screen
var createLoadingDocument = function(title) {
    title = title || "Loading...";

    const template = `<?xml version="1.0" encoding="UTF-8" ?>
    <document>
        <loadingTemplate>
            <activityIndicator>
                <title>${title}</title>
            </activityIndicator>
        </loadingTemplate>
    </document>`;

    return new DOMParser().parseFromString(template, "application/xml");
}

/** Send an arbitrary named event to the root document. Useful for global actions such as pausing and resuming
 videos */
var emitDocumentEvent = function(eventName) {
    host.debugLog("emitDocumentEvent: " + eventName);
    var document = getActiveDocument();
    if (document && eventName && eventName.length) {
        var newEvent = new Event(eventName);
        document.dispatchEvent(newEvent);
    }
}

// This function should mainly use for hotfixes
// Only works in AdRenderer, will be called when key pressed
// up, down, left, right, select, playpause
var onKeyPressedEvent = function(eventName) {
    host.debugLog("TruexTvmlCore.js onKeyPressedEvent: " + eventName);
}

// This function should mainly use for hotfixes
// Only works in AdRenderer, will be called when key life cycle events happen
// allDoneButtonPushed, handleCompletedAd, etc...
var onLifeCycleEvent = function(eventName) {
    host.debugLog("TruexTvmlCore.js onLifeCycleEvent: " + eventName);
}

var trackInteractionEvent = function(args) {
    const gifPixelPath = "i.gif";
    const trackingArgs = Object.assign({
        "category": "other",
        "name": "",
        "step": "1",
        "value": ""
    }, args);
    const isChoiceEvent = false;
    host.trackEventWithPathArgumentsIsChoiceEvent(gifPixelPath, trackingArgs, isChoiceEvent);
}

// MARK: - Device Link
var DeviceLink = {};

// Message should be a valid JSON string
DeviceLink.sendMessage = function(message) {
    const jsonStr = message.replace(new RegExp("'", "g"), '\"');
    try {
        host.sendMessageToDeviceLink(JSON.parse(jsonStr));
    } catch (jsonParseError) {
        var errorMessage = "TruexTvmlCore.js: DeviceLink.sendMessage(message) Unable to parse message '";
        errorMessage = errorMessage.concat(jsonStr);
        errorMessage = errorMessage.concat("' to send to device link. Error: '");
        errorMessage = errorMessage.concat(jsonParseError);
        errorMessage = errorMessage.concat("'");
        host.debugLog(errorMessage);
    }
};

DeviceLink.subscribeToMessages = function(messageHandler) {
    host.subscribeToMessagesFromDeviceLink(messageHandler);
};

DeviceLink.retrieveLinkInfo = function(deviceInfoHandler) {
    host.retrieveDeviceLinkInfo(deviceInfoHandler);
}

DeviceLink.handleFailure = function(failureHandler) {
    host.handleDeviceLinkFailure(failureHandler);
};

DeviceLink.handleDeviceConnected = function(connectedHandler) {
    host.handleDeviceConnectedToLink(connectedHandler);
};

// MARK: - Template Controllers
var TemplateControllers = {};

// fullscreen video
TemplateControllers.FullscreenVideoController = function(doc) {
    const activeDocument = doc;

    var continueButtons = [];
    // legacy get button by id behavior
    // const continueButton = activeDocument.getElementById('continue_button');
    if (activeDocument.getElementById('continue_button') && !activeDocument.getElementById('continue_button').hasAttribute("showOn") ){
        continueButtons.push(activeDocument.getElementById('continue_button'));
    }
    // new behavior that looks for all items that has `showOn` attribute
    // note: if in the future apple support getElementsByName, we should use that instead of the following loop
    var allElements = activeDocument.getElementsByTagName("*");
    for (var i=0; i < allElements.length; i++){
        var currentElement = allElements.item(i);
        if (currentElement.hasAttribute("showOn")){
            continueButtons.push(currentElement);
        }
    }

    for (var i=0; i < continueButtons.length; i++) {
        var continueButton = continueButtons[i];

        // track button focus
        continueButton.addEventListener("highlight", () => {
            const trackingArgs = {
                "name": "button_focus",
                "value": "continue_button"
            };
            trackInteractionEvent(trackingArgs);
        });

        // track button select
        continueButton.addEventListener("select", () => {
            video.setAttribute('action', 'pause');

            const trackingArgs = {
                "name": "button_select",
                "value": "continue_button"
            };
            trackInteractionEvent(trackingArgs);
        });
    }

    const video = activeDocument.getElementById('initial_video');

    video.addEventListener('videoStarted', (evt) => {
        runQuartileActions('videoStarted');
    });

    video.addEventListener('firstQuartile', (evt) => {
        runQuartileActions('firstQuartile');
    });

    video.addEventListener('secondQuartile', (evt) => {
        runQuartileActions('secondQuartile');
    });

    video.addEventListener('thirdQuartile', (evt) => {
        runQuartileActions('thirdQuartile');
    });

    video.addEventListener('videoEnded', (evt) => {
        runQuartileActions('videoEnded');
        // Use the "skip interact" mode of this replaceStep call so that the passive
        // step transition is not counted as an actual interaction.

        // legacy behavior
        const docElement = doc.getElementsByTagName("document").item(0);
        if (docElement.attributes.getNamedItem("controller") && docElement.attributes.getNamedItem("controller").value=="VideoToGalleryController") {
            host.debugLog("TruexTvmlCore.js: replaceStepSkipInteract('step_2'), this is a legacy behavior, do not use VideoToGalleryController if this is not intended");
            host.replaceStepSkipInteract('step_2');
        }
    });

    video.addEventListener('timeBoundaryDidCross', (event) => {
         runQuartileActions(event.boundary);
    });

    // get all the non-quartile showOn value
    var timeBoundaries = [];
    for (var i=0; i < continueButtons.length; i++) {
        var continueButton = continueButtons[i];
        var showOnValue = continueButton.getAttribute("showOn");
        // if showOn has a number value
        if (!isNaN(showOnValue)){
            if (timeBoundaries.indexOf(showOnValue) === -1){
                timeBoundaries.push(showOnValue);
            }
        }
    }

    var timeBoundariesString = "";
    timeBoundaries = timeBoundaries.sort()
    timeBoundariesString = timeBoundaries.toString();

    video.setAttribute("timeBoundaries", timeBoundariesString);

    function runQuartileActions(quartile) {
        var pickedAutoFocused = false;
        for (var i=0; i < continueButtons.length; i++) {
            var continueButton = continueButtons[i];

            const showContinueOn = continueButton.attributes.getNamedItem("showOn");

            if (showContinueOn && showContinueOn.value === quartile) {
                continueButton.setAttribute('action', 'fadeIn:0.25');
                if (!pickedAutoFocused && continueButton.getAttribute("autoHighlight")=="true" ){
                    pickedAutoFocused = true;
                    let buttonToFocus = continueButton;
                    setTimeout(function(){
                           buttonToFocus.setAttribute("priority", "1");
                    }, 500);
                }
            }
        }
    }
}

// hover slide image controller
TemplateControllers.HoverSlideController = function(doc) {
    const activeDocument = doc;

    let btnTimeout;

    const txButtons = activeDocument.getElementsByTagName('txbutton');

    for (var i = 0; i < txButtons.length; i++) {
        const btn = txButtons.item(i);
        if (btn.getAttribute('id').indexOf('slide_button') > -1) {
          const slideId = btn.getAttribute('id').replace('button', 'image');

          btn.addEventListener('highlight', () => {
              clearTimeout(btnTimeout);
              btnTimeout = setTimeout(() => {
                  const slide = activeDocument.getElementById(slideId);
                  if (slide) {
                      hideSlides(doc, slideId);
                      slide.setAttribute('action', 'fadeIn:0.25');

                      const trackingArgs = {
                          "name": "show_slide",
                          "value": slideId
                      };
                      trackInteractionEvent(trackingArgs);
                  }
              }, 150);
          });

          // track button select
          btn.addEventListener("select", () => {
              const trackingArgs = {
                  "name": "slide_select",
                  "value": slideId
              };
              trackInteractionEvent(trackingArgs);
          });
        }
    }

    function hideSlides(doc, id) {
        const activeDocument = doc;

        const slides = activeDocument.getElementsByTagName('tximage');

        for (var i = 0; i < slides.length; i++) {
            const slide = slides.item(i);
            if (slide.getAttribute('id').indexOf('slide_image') > -1) {
                if (slide.getAttribute('id') !== id) {
                    const action = slide.attributes.getNamedItem('action');
                    if (action && action.value !== 'fadeOut:0.25') {
                        slide.setAttribute('action', 'fadeOut:0.25');
                    }
                }
            }
        }
    }
}

// inline player
TemplateControllers.InlineVideoPlayerController = function(doc) {
    console.log('inline video player controller');

    const activeDocument = doc;

    const videoPlayer = activeDocument.getElementsByTagName('txvideo');

    videoPlayer.item(0).addEventListener('videoEnded', onVideoEnded);

    const buttons = activeDocument.getElementsByTagName('txbutton');
    for (var i = 0; i < buttons.length; i++) {
        if (buttons.item(i).attributes.getNamedItem('video_src')) {
            buttons.item(i).addEventListener('select', onSelectVideo);
        }
    }

    function onVideoEnded(e) {
        e.target.setAttribute('action', 'remove');

        const videoAttrFullscreen = e.target.attributes.getNamedItem('fullscreen');
        const isFullscreen = (videoAttrFullscreen === undefined) ? false : (videoAttrFullscreen.value === 'true') ? true : false;

        if (isFullscreen) {
            e.target.setAttribute('fullscreen', false);

            enableTXButtons();
        }
    }

    function onSelectVideo(e) {
        if (e.target.attributes.getNamedItem('video_src')) {
            deselectTXButtons();
            e.target.setAttribute('selected', true);

            videoPlayer.item(0).setAttribute('src', e.target.attributes.getNamedItem('video_src').value);
            videoPlayer.item(0).setAttribute('action', 'play');
        }
    }
};

// inline thumbnail player
TemplateControllers.InlineVideoThumbnailController = function(doc) {
    console.log('inline video thumbnail controller');

    const activeDocument = doc;

    const videos = activeDocument.getElementsByTagName('txvideo');
    for (var i = 0; i < videos.length; i++) {
        const id = videos.item(i).attributes.getNamedItem('id').value;

        videos.item(i).addEventListener('videoEnded', onMinimizeVideo);
        videos.item(i).addEventListener('videoMinimize', onMinimizeVideo);
        videos.item(i).addEventListener('videoDidExitFullscreen', onVideoExitFullscreen);

        // find matching buttons
        const btnId = id.replace('inline_', '');
        const btn = activeDocument.getElementById(btnId);
        if (btn) {
            btn.addEventListener('select', onSelectVideo)
        }
    }

    function onVideoExitFullscreen(e) {
        e.target.setAttribute('hidden', true);
    }

    function onMinimizeVideo(e) {
        e.target.setAttribute('focusable', false);
        e.target.setAttribute('fullscreen', false);
        e.target.setAttribute('action', 'reset');

        enableTXButtons();

        setTimeout(() => {
            e.target.removeAttribute('priority');
            e.target.removeAttribute('action');
            e.target.removeAttribute('onAnimationEnd');
        }, 0);
    }

    function onSelectVideo(e) {
        const attrs = e.target.attributes;

        const id = 'inline_'+ attrs.getNamedItem('id').value;

        disableTXButtons();
        deselectTXButtons();
        e.target.setAttribute('selected', true);

        const videoPlayer = activeDocument.getElementById(id);
        videoPlayer.setAttribute('focusable', true);
        videoPlayer.setAttribute('hidden', false);

        let frame = attrs.getNamedItem('x').value +','+
                    attrs.getNamedItem('y').value +','+
                    attrs.getNamedItem('width').value +','+
                    attrs.getNamedItem('height').value;

        videoPlayer.setAttribute('frame', frame);

        setTimeout(() => {
            videoPlayer.setAttribute('fullscreen', true);
            videoPlayer.setAttribute('action', 'play');
            videoPlayer.setAttribute('priority', 1);
        }, 0);
    }
};

// setup for all txvideos
function setupTXVideos(document) {
    const txVideoPlayers = document.getElementsByTagName('txvideo');
    for (var i = 0; i < txVideoPlayers.length; i++) {
        videoPlayerManager.setNewNativePlayerWithElementId(txVideoPlayers.item(i).attributes.getNamedItem('id').value, txVideoPlayers.item(i));

        txVideoPlayers.item(i).addEventListener('videoStarted', (evt) => {
            var videoName = getNativeVideoNameOrUrl(evt);
            host.debugLog("TruexTvmlCore.js videoStarted videoName: "+ videoName);
            host.trackEventWithNameEventValue("trackVideoStartedWithVideoName", videoName);
        });

        txVideoPlayers.item(i).addEventListener('firstQuartile', (evt) => {
            var videoName = getNativeVideoNameOrUrl(evt);
            host.debugLog("TruexTvmlCore.js firstQuartile videoName: "+ videoName);
            host.trackEventWithNameEventValue("trackVideoFirstQuartileWithVideoName", videoName);
        });

        txVideoPlayers.item(i).addEventListener('secondQuartile', (evt) => {
            var videoName = getNativeVideoNameOrUrl(evt);
            host.debugLog("TruexTvmlCore.js secondQuartile videoName: "+ videoName);
            host.trackEventWithNameEventValue("trackVideoSecondQuartileWithVideoName", videoName);
        });

        txVideoPlayers.item(i).addEventListener('thirdQuartile', (evt) => {
            var videoName = getNativeVideoNameOrUrl(evt);
            host.debugLog("TruexTvmlCore.js thirdQuartile videoName: "+ videoName);
            host.trackEventWithNameEventValue("trackVideoThirdQuartileWithVideoName", videoName);
        });

        txVideoPlayers.item(i).addEventListener('videoEnded', (evt) => {
            var videoName = getNativeVideoNameOrUrl(evt);
            host.debugLog("TruexTvmlCore.js videoEnded videoName: "+ videoName);
            host.trackEventWithNameEventValue("trackVideoCompletedWithVideoName", videoName);
        });

        txVideoPlayers.item(i).addEventListener('videoDidEnterFullscreen', (evt) => {
            const videoName = getNativeVideoNameOrUrl(evt);
            const trackingArgs = {
                "name": "videoDidEnterFullscreen",
                "value": videoName
            };
            host.debugLog("TruexTvmlCore.js videoDidEnterFullscreen videoName: "+ videoName);
            trackInteractionEvent(trackingArgs);
        });

        txVideoPlayers.item(i).addEventListener('videoDidExitFullscreen', (evt) => {
            enableTXButtons();
            evt.target.setAttribute('fullscreen', false);

            const videoName = getNativeVideoNameOrUrl(evt);
            const trackingArgs = {
                "name": "videoDidExitFullscreen",
                "value": videoName
            };
            host.debugLog("TruexTvmlCore.js videoDidExitFullscreen videoName: "+ videoName);
            trackInteractionEvent(trackingArgs);
        });

        txVideoPlayers.item(i).addEventListener('videoDidLoop', (evt) => {
            const loopCountAttribute = evt.target.attributes.getNamedItem('loopCount');
            let loopCount = loopCountAttribute ? parseInt(loopCountAttribute.value) : 0;
            loopCount = (loopCount + 1);

            evt.target.setAttribute('loopCount', loopCount);

            // const videoName = getNativeVideoNameOrUrl(evt);
            // const trackingArgs = {
            //     "name": "videoLoopCount",
            //     "value": loopCount
            // };
            // trackInteractionEvent(trackingArgs);
        });

        txVideoPlayers.item(i).addEventListener('select', (evt) => {
            disableTXButtons();
            evt.target.setAttribute('focusable', true);

            setTimeout(() => {
                evt.target.setAttribute('fullscreen', true);
                evt.target.setAttribute('priority', 1);
            }, 0);
        });
    }

    if (txVideoPlayers.length>0){
        videoPlayerManager.pausedPlayers=[];
        document.addEventListener("disappear", function(event){
                                  videoPlayerManager.pauseAllPlayers();
                                  });
        document.addEventListener("appear", function(event){
                                  videoPlayerManager.resumePausedPlayers();
                                  });
    }
}

function setupTxgame(document) {
    const txgameElements = document.getElementsByTagName('txgame');

    for (let i = 0; i < txgameElements.length; i++) {
        document.addEventListener('appear', () => {
            txgameElements.item(i).setAttribute('action', 'documentDidAppear');
        });
    }
}

// sets focus to the selected txbutton
function setTXButtonPriority() {
    const activeDocument = getActiveDocument();

    const buttons = activeDocument.getElementsByTagName('txbutton');
    for (var i = 0; i < buttons.length; i++) {
        const buttonAttrSelected = buttons.item(i).attributes.getNamedItem('selected');
        const isSelected = (buttonAttrSelected && buttonAttrSelected.value === 'true') ? true : false;
        if (isSelected) {
            buttons.item(i).setAttribute('priority', 1);
        } else {
            buttons.item(i).setAttribute('priority', 0);
        }
    }
}

// disables interactions on all txbuttons
function disableTXButtons() {
    const activeDocument = getActiveDocument();

    const buttons = activeDocument.getElementsByTagName('txbutton');
    for (var i = 0; i < buttons.length; i++) {
        buttons.item(i).setAttribute('isDisabled', true);
        buttons.item(i).setAttribute('priority', 0);
    }
}

// enables interactions on all txbuttons and sets priority
function enableTXButtons() {
    const activeDocument = getActiveDocument();

    const buttons = activeDocument.getElementsByTagName('txbutton');
    for (var i = 0; i < buttons.length; i++) {
        buttons.item(i).setAttribute('isDisabled', false);
    }

    setTXButtonPriority();
}

// sets all txbuttons to deselected state
function deselectTXButtons() {
    const activeDocument = getActiveDocument();

    const buttons = activeDocument.getElementsByTagName('txbutton');
    for (var i = 0; i < buttons.length; i++) {
        buttons.item(i).setAttribute('selected', false);
    }
}


// handle old video to gallery
TemplateControllers.VideoToGalleryController = {
    step1: TemplateControllers.FullscreenVideoController,
    step2: TemplateControllers.HoverSlideController,
};

//add onhoveraudio/onselectaudio attributes that play an extra sound when an element is highlighted/selected
//The element needs to be able to trigger highlight/select event though
let highlightEventFiredOnce = false;                                //This boolean variable checks if the first element is automatically highlighted by system
var setupExtraSoundPlayerHandler = function (currentDoc) {
    currentDoc.addEventListener("appear", function (event) {
        highlightEventFiredOnce = false;
    });
    const elements = currentDoc.getElementsByTagName("*");
    for (let i = 0; i < elements.length; i++) {
        const current = elements.item(i);
        current.addEventListener("highlight", (event) => {
            if (highlightEventFiredOnce) {
                const onHoverAudioUrl = current.getAttribute("onhoveraudio");
                if (onHoverAudioUrl) {
                    host.debugLog("TruexTvmlCore.js onhighlightaudio playing: " + event.target.getAttribute("onhoveraudio"));
                    host.playForegroundSoundWithUrl(event.target.getAttribute("onhoveraudio"));
                }
            } else {
                console.log("highlighted trigged for the first time");
                highlightEventFiredOnce = true;
            }
        });
        const onSelectAudioUrl = current.getAttribute("onselectaudio");
        if (onSelectAudioUrl) {
            current.addEventListener("select", (event) => {
                host.debugLog("TruexTvmlCore.js onselectaudio playing: " + event.target.getAttribute("onselectaudio"));
                host.playForegroundSoundWithUrl(event.target.getAttribute("onselectaudio"));
            });
        }
    }
};



TemplateControllers.PollDrawerController = function(doc) {
    pollDrawerVoted = false;
    pollDrawerOpened = false;
};


var pollDrawerVoted = false;
var pollDrawerOpened = false;
var pollDrawerOpenCloseButtonClicked = function () {
    var document = getActiveDocument();
    pollDrawerOpened = !pollDrawerOpened;

    var pollDrawerOpenCloseButton = document.getElementById("pollDrawerOpenCloseButton");
    pollDrawerOpenCloseButton.setAttribute("src", pollDrawerOpened? "https://media.truex.com/image_assets/2018-02-02/609ec40d-7afb-4f2b-b389-0aabe402766e.png": "https://media.truex.com/image_assets/2018-02-02/30ddc25b-44ae-45a4-8c45-15e02f0efda8.png");
    pollDrawerOpenCloseButton.setAttribute("frame", pollDrawerOpened? "1300, 520, 40, 40" : "1850, 520, 40, 40");

    var pollDrawerBackgroundImage = document.getElementById("pollDrawerBackgroundImage");
    pollDrawerBackgroundImage.setAttribute("frame", pollDrawerOpened? "1380, 0, 540, 1080" : "1820, 0, 540, 1080");

    var answerButtons = document.getElementsByTagName("txbutton");
    for (var i = 0; i < answerButtons.length; i++){
        var answerButton = answerButtons.item(i);
        if (answerButton.hasAttribute("answerId")){
            // should not show vote button after user voted
            if (!pollDrawerVoted){
                answerButton.setAttribute("action", pollDrawerOpened? "fadeIn:0" : "fadeOut:0");
                var y = answerButton.getAttribute("y");
                var height = answerButton.getAttribute("height");
                var width = answerButton.getAttribute("width");

                var framePostPix = y + ", " + width + ", " + height;

                answerButton.setAttribute("frame", pollDrawerOpened? "1380, " + framePostPix : "1820, " + framePostPix);
            }
        }
    }

    // when closing the vote, close the result bar too
    if (!pollDrawerOpened) {
        var resultLables = document.getElementsByTagName("txlabel");
        for (var i =0; i < resultLables.length; i++){
            var resultLable = resultLables.item(i);
            if (resultLable.hasAttribute("answerId")){
                resultLable.setAttribute("action", "fadeOut:0");
            }
        }
    }
}

var pollDrawerVote = function (answerId) {
    var document = getActiveDocument();
    pollDrawerVoted = true;
    host.voteWithAnswerId(answerId);

    // hide answer buttons
    var answerButtons = document.getElementsByTagName("txbutton");
    for (var i =0; i < answerButtons.length; i++){
        var answerButton = answerButtons.item(i);
        if (answerButton.hasAttribute("answerId")){
            answerButton.setAttribute("action", "fadeOut:1");
        }
    }

    // get vote summary from host
    var voteSummary = host.getVoteSummary();
    if (voteSummary.length<=0){
        host.debugLog("voteSummary is null");
    }

    var totalVoteCount = 0;
    var maxVoteCount = 1;   // to avoid div by 0, TODO: better method on faking the data
    for (var voteDetailIndex in voteSummary){
        var voteDetail = voteSummary[voteDetailIndex];
        if (!voteDetail){
            continue;
        }
        if (Number(voteDetail.vote_count) > maxVoteCount){
            maxVoteCount = Number(voteDetail.vote_count);
        }
        totalVoteCount += Number(voteDetail.vote_count);
    }

    // normalize vote count
    var voteResultByAnswerId = {};
    for (var voteDetailIndex in voteSummary){
        var voteDetail = voteSummary[voteDetailIndex];
        if (!voteDetail){
            continue;
        }
        voteDetail.percentage = Number(voteDetail.vote_count/totalVoteCount*100).toFixed(0);
        voteResultByAnswerId[voteDetail.vote] = voteDetail;
    }

    // set uilabel
    var resultLables = document.getElementsByTagName("txlabel");
    for (var i =0; i < resultLables.length; i++){
        var resultLable = resultLables.item(i);
        if (resultLable.hasAttribute("answerId")){
            var answerId = resultLable.getAttribute("answerId");
            var percentage = voteResultByAnswerId[Number(answerId)].percentage;
            var resultLableText = resultLable.getAttribute("text").replace("TXPLACEHOLDER_PERCENT", percentage);
            resultLable.setAttribute("text", resultLableText);

            // need to set width
            if (resultLable.hasAttribute("answerOverlay")){
                var newWidth = Number(resultLable.getAttribute("maxWidth"))*percentage/100;
                resultLable.setAttribute("width", newWidth);
            }

            resultLable.setAttribute("action", "fadeIn:1");
        }
    }

    // dismiss result and change image src
    setTimeout(function(){
                var resultLables = document.getElementsByTagName("txlabel");
                for (var i =0; i < resultLables.length; i++){
                    var resultLable = resultLables.item(i);
                    if (resultLable.hasAttribute("answerId")){
                        resultLable.setAttribute("action", "fadeOut:0");
                    }
                }

                var pollDrawerBackgroundImage = document.getElementById("pollDrawerBackgroundImage");
                pollDrawerBackgroundImage.setAttribute("src", pollDrawerBackgroundImage.getAttribute("actionSrc") );

               }, 3000);

}

// this is a quick helper function for `host.openURLCallback`
// it tries the first url and open the 2nd one if we can't open the first one.
// one good use case would be try open up a 3rd party app, and if fail, open app store for download
// say, for a show in `foxnow` might look like this
// openUrlWithFallback("foxapp://seriesDetail/the-simpsons?landing=seasons&season=26&episode=3", "https://itunes.apple.com/us/app/fox-now-live-on-demand-tv/id571096102?mt=8");
//
// there's no tracking/ true[x] logic in this so different ads can implynment their own version with `host.openURLCallback`, to handle ad specific logic, like UI/UX behavior, or try all fox products before fall back to app store etc...
var openUrlWithFallback = function (url, fallbackUrl) {
    host.openURLCallback(url, (success)=>{
                             if (!success){
                                host.openURLCallback(fallbackUrl, ()=>{});
                             }
                         });
}
