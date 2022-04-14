//
//  TruexTvmlCore.js
//
//  Created by Simon Asselin on 1/27/18.
//  Copyright © 2018 true[X]. All rights reserved.
//

// Backfill for unit test
if (typeof module !== 'undefined'){
    if (typeof App === 'undefined') { 
        App = {};
    }
    if (typeof host === 'undefined') {
        host = {
            debugLog: console.log,
            isChoiceCard: function(){ return false; },
            trackEventWithNameEventValue: function(eventName, eventValue){
                console.log("trackEventWithNameEventValue: eventName= " + eventName + ", eventValue: " + eventValue);
            },
            emitVideoEventWithValue: function(event){ 
                console.log("emitVideoEventWithValue: type= " + event.type);
            }
        };
    }
}

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
    videoPlayerManager.stopAllPlayers();
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
        // choice card's video might resume when resume from background
        if (host.isPresentedOnScreen() && getActiveDocument()){
            videoPlayerManager.resumePausedPlayers(getActiveDocument().dataItem['uuid']);
        }
        host.resumeTimersAsAppropriate();
    }
    host.resumeFromDeeplinkAsAppropriate();
}

App.onSuspend = function(options) {
    console.log("onSuspend");
    host.debugLog("TruexTvmlCore.js onSuspend");
    if (getActiveDocument()){
        videoPlayerManager.pauseAllPlayers(getActiveDocument().dataItem['uuid']);
    }
}

// MARK: - Video Player Manager & Related

var videoPlayerManager;
var VideoPlayerManager = function() {
    this.videoPlayers = {};
    this.videoHistory = new Set([]);
    this.videoPlayerManagerPausedPlayers = {};
    this.getAllPlayers = function() {
        return this.videoPlayers;
    };
    this.getPlayerByKey = function(key){
        return this.videoPlayers[key];
    };
    this.setNewPlayer = function(key, player){
        if (this.videoPlayers[key] && this.videoPlayers[key].playbackState==="playing"){     // if there is an existing player, stop it first before creating a new one
            this.videoPlayers[key].truexPauseOverride = true;
            this.videoPlayers[key].pause();
        }
        this.videoPlayers[key] = player;
        return this.videoPlayers[key];
    };
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
    };
    this.setNewNativePlayerWithElementId = function(key, element){
        var nativeVideoPlayer = new nativeVideoPlayerAdapter(element);
        this.videoPlayers[key] = nativeVideoPlayer;
        return this.videoPlayers[key];
    };
    this.videoIsPlaying = function(elementId) {
        this.videoPlayers[elementId].playbackState = "playing";
    };
    this.videoEnded = function(elementId) {
        this.videoPlayers[elementId].playbackState = "end";
    };
    this.videoPaused = function(elementId) {
        this.videoPlayers[elementId].playbackState = "paused";
    };
    this.pauseAllPlayers = function(uuid){
        host.debugLog("TruexTvmlCore.js pauseAllPlayers");
        if (!(uuid && this.videoPlayerManagerPausedPlayers[uuid] && Array.isArray(this.videoPlayerManagerPausedPlayers[uuid]))){
            this.videoPlayerManagerPausedPlayers[uuid] = [];
        }
        
        for (var key in this.videoPlayers){
            host.debugLog("TruexTvmlCore.js pauseAllPlayers key: " + key);
            if (this.videoPlayers[key] &&
                this.videoPlayers[key].playbackState==="playing" &&     // only pause if the videoplayer status is playing
                (this.videoPlayers[key].truexVideoPlayerType != "native" ||             // and this video is on the current document (for native/txvideo type of videos)
                this.videoPlayers[key].videoElement.ownerDocument.dataItem['uuid'] == uuid)) {  // by checking it's parent document's uuid
                this.videoPlayers[key].truexPauseOverride = true;
                this.videoPlayers[key].pause();
                if (this.videoPlayerManagerPausedPlayers[uuid].indexOf(this.videoPlayers[key])===-1){
                    this.videoPlayerManagerPausedPlayers[uuid].push(this.videoPlayers[key]);
                }
            }
        }
    };
    this.resumePausedPlayers = function(uuid) {
        host.debugLog("TruexTvmlCore.js resumePausedPlayers");
        var activeDocument = getActiveDocument();
        while (this.videoPlayerManagerPausedPlayers[uuid].length > 0) {
            var videoPlayer = this.videoPlayerManagerPausedPlayers[uuid].pop();
            if (videoPlayer && videoPlayer.playbackState === "paused") {
                videoPlayer.truexPauseOverride = false;
                // make sure video's owner is on the screen
                if (videoPlayer.truexVideoPlayerType != "native" ||
                    (videoPlayer.videoElement &&
                        videoPlayer.videoElement.ownerDocument == activeDocument)) {
                    videoPlayer.play();
                }
            }
        }
    };
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
        this.videoPlayerManagerPausedPlayers = {};
    };
    this.stopAllPlayers = function(){
        for (var key in this.videoPlayers){
            if (this.videoPlayers[key]){
                this.videoPlayers[key].stop();
            }
        }
        this.videoPlayerManagerPausedPlayers = {};
    };
    this.setAllPlayersInteractiveOverlayDismissable = function(dismissable){
        for (var key in this.videoPlayers){
            if (this.videoPlayers[key]){
                this.videoPlayers[key].interactiveOverlayDismissable = dismissable;
            }
        }
    };
    this.clearPlayerByKey = function(key){
        if (this.videoPlayers[key] && this.videoPlayers[key].playbackState==="playing"){
            this.videoPlayers[key].truexPauseOverride = true;
            this.videoPlayers[key].pause();
        }
        this.videoPlayers[key] = null;
    };
    this.resetActionOnPlayer = function(key) {
        const videoPlayer = this.videoPlayers[key];
        if (videoPlayer) {
            videoPlayer.resetAction();
        }
    };
    this.setVideoDidPlayed = function(videoUrl) {
        if (this.videoHistory && videoUrl){
            if (!this.videoHistory.has(videoUrl)) {
                this.videoHistory.add(videoUrl);
            }
            let videoKeys = Object.keys(this.videoPlayers);
            for (var i=0; i < videoKeys.length; i++) {
                let videoKey = videoKeys[i];
                let src = this.videoPlayers[videoKey].getVideoSrc();
                if (src == videoUrl) {
                    this.videoPlayers[videoKey].didReplay = true;
                }
            }
        }
    };
    this.getVideoDidPlayed = function(videoUrl) {
        if (this.videoHistory && videoUrl){
            return this.videoHistory.has(videoUrl);
        }
        return false;
    };
};

// this object keep track of a <txvideo>
var nativeVideoPlayerAdapter = function(element){
    this.videoElement = element;
    this.truexVideoPlayerType = "native";
    this.playbackState = "playing";
    let videoUrl = element.attributes.getNamedItem("src") ? element.attributes.getNamedItem("src").value : null;
    this.didReplay = videoPlayerManager.getVideoDidPlayed(videoUrl);

    this.play = function() {
        this.playbackState = "playing";
        host.debugLog("TruexTvmlCore.js this.videoElement playing: " + this.videoElement);
        this.videoElement.setAttribute('action', 'play');
    };

    this.pause = function() {
        this.playbackState = "paused";
        this.videoElement.setAttribute('action', 'pause');
        host.debugLog("TruexTvmlCore.js this.videoElement paused: " + this.videoElement);
        console.log(this.videoElement);
    };

    this.stop = function() {
        this.playbackState = "end";
        this.videoElement.setAttribute('action', 'pause');
    };

    // native only functions
    this.setVideoSrc = function(videoUrl) {
        this.playbackState = "playing";
        this.videoElement.setAttribute('src', videoUrl);
        this.didReplay = videoPlayerManager.getVideoDidPlayed(videoUrl);
    };

    this.getVideoSrc = function() {
        return this.videoElement.getAttribute('src');
    };

    this.resetAction = function() {
        this.videoElement.setAttribute('action', '');
    };
};

var resetActionOnPlayer = function(key) {
    if (videoPlayerManager) {
        return videoPlayerManager.resetActionOnPlayer(key);
    }
};

var truexVideoBackgroundEval = function(truexVideoBackgroundEvalExpression){
    videoPlayerManager.stopAllPlayers();

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
                              videoPlayerManager.stopAllPlayers();
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

let getNativeVideoUrl = function(videoElement){
    return videoElement.target.attributes.getNamedItem("src").value;
};

let getNativeVideoNameOrUrl = function (videoElement){
    var videoUrl = getNativeVideoUrl(videoElement);
    var videoName = videoElement.target.getAttribute("truexVideoName");
    if (!videoName || videoName===""){
        videoName = videoUrl;
    }
    return videoName;
};

function getTxVideoNameOrUrl(txVideoElement) {
    let videoUrl, videoName;
    const videoSrcAttribute = txVideoElement.attributes.getNamedItem("src");
    if (videoSrcAttribute) {
        videoUrl = videoSrcAttribute.value;
    }
    const truexVideoNameAttribute = txVideoElement.attributes.getNamedItem("truexVideoName");
    if (truexVideoNameAttribute) {
        videoName = truexVideoNameAttribute.value;
    }
    if (!videoName || videoName === "") {
        return videoUrl;
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
                                  videoPlayerManager.stopAllPlayers();
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

    if (getActiveDocument()){
        videoPlayerManager.pauseAllPlayers(getActiveDocument().dataItem['uuid']);
    }
    
    const loadingDoc = createLoadingDocument();

    if (typeof navigationDocument === "undefined"){
        host.debugLog("TruexTvmlCore.js parseAndPush error: no navigationDocument");
        return;
    }

    if (shouldUseLoadingScreen) {
        showDocument(loadingDoc, shouldReplace);
    }

    try {
        var parser = new DOMParser();
        var currentDoc = parser.parseFromString(xmlString, "application/xml");

        if (currentDoc) {
            currentDoc.dataItem = { 'uuid': stepName + ":" + UUID() };
            
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
                if (host.isInEngagement()) {
                    if (typeof(LAST_STEP_NAME) === "undefined") {
                        LAST_STEP_NAME = "";
                    }
                    host.trackEventWithNameEventValue("trackBrowseWithValue", (truexStepName + ";" + LAST_STEP_NAME));
                    LAST_STEP_NAME = truexStepName;
                }
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
                                    
// Choice Card can override this to show custom timer/logic
var choiceCardTimerDidTicked = function(remainingTime) {
    var txChoiceCardTimerLabel = getActiveDocument().getElementById("txChoiceCardTimerLabel");
    if (txChoiceCardTimerLabel) {
        txChoiceCardTimerLabel.setAttribute("text", remainingTime);
    }
}

var trackInteractionEvent = function(args) {
    host.trackInteractionEvent(args);
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

        // track button select
        continueButton.addEventListener("select", () => {
            video.setAttribute('action', 'pause');
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

// setup for all txvideos, as well as other child of txvideo
function setupTXVideos(document) {
    const videoTypes = ['txvideo', 'tx360video'];
    var numberOfPlayers = 0;
    var shouldTrackVideoEvents = !host.isChoiceCard();
    for (var type=0; type<videoTypes.length; type++){
        const txVideoElements = document.getElementsByTagName(videoTypes[type]);
        numberOfPlayers += txVideoElements.length;
        for (var i = 0; i < txVideoElements.length; i++) {
            const txVideoElement = txVideoElements.item(i);
            const txVideoElementId = txVideoElement.attributes.getNamedItem('id').value;
            const nativeVideoPlayerAdapter = videoPlayerManager.setNewNativePlayerWithElementId(txVideoElementId, txVideoElement);

            connectPlayButton(document, txVideoElement, nativeVideoPlayerAdapter);

            txVideoElement.addEventListener('videoStarted', (videoElement) => {
                let videoName = getNativeVideoNameOrUrl(videoElement);
                let videoUrl = getNativeVideoUrl(videoElement);
                host.debugLog("TruexTvmlCore.js videoStarted videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    let eventName = nativeVideoPlayerAdapter.didReplay ? "trackVideoStartedReplayWithVideoName" : "trackVideoStartedWithVideoName";
                    host.trackEventWithNameEventValue(eventName, videoName);
                }
                host.emitVideoEventWithValue({
                    type : "VIDEO_STARTED",
                    videoName : videoName,
                    url : videoUrl
                });

                videoPlayerManager.videoIsPlaying(txVideoElementId);
            });

            txVideoElement.addEventListener('videoResumed', (evt) => {
                var videoName = getNativeVideoNameOrUrl(evt);
                host.debugLog("TruexTvmlCore.js videoResumed videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    host.trackEventWithNameEventValue("trackVideoResumedWithVideoName", videoName);
                }

                videoPlayerManager.videoIsPlaying(txVideoElementId);
            });

            txVideoElement.addEventListener('firstQuartile', (evt) => {
                var videoName = getNativeVideoNameOrUrl(evt);
                var videoUrl = getNativeVideoUrl(evt);
                host.debugLog("TruexTvmlCore.js firstQuartile videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    let eventName = nativeVideoPlayerAdapter.didReplay ? "trackVideoFirstQuartileReplayWithVideoName" : "trackVideoFirstQuartileWithVideoName";
                    host.trackEventWithNameEventValue(eventName, videoName);
                }
                host.emitVideoEventWithValue({
                    type : "VIDEO_FIRST_QUARTILE",
                    videoName : videoName,
                    url : videoUrl
                });
            });

            txVideoElement.addEventListener('secondQuartile', (evt) => {
                var videoName = getNativeVideoNameOrUrl(evt);
                var videoUrl = getNativeVideoUrl(evt);
                host.debugLog("TruexTvmlCore.js secondQuartile videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    let eventName = nativeVideoPlayerAdapter.didReplay ? "trackVideoSecondQuartileReplayWithVideoName" : "trackVideoSecondQuartileWithVideoName";
                    host.trackEventWithNameEventValue(eventName, videoName);
                }
                host.emitVideoEventWithValue({
                    type : "VIDEO_SECOND_QUARTILE",
                    videoName : videoName,
                    url : videoUrl
                });
            });

            txVideoElement.addEventListener('thirdQuartile', (evt) => {
                var videoName = getNativeVideoNameOrUrl(evt);
                var videoUrl = getNativeVideoUrl(evt);
                host.debugLog("TruexTvmlCore.js thirdQuartile videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    let eventName = nativeVideoPlayerAdapter.didReplay ? "trackVideoThirdQuartileReplayWithVideoName" : "trackVideoThirdQuartileWithVideoName";
                    host.trackEventWithNameEventValue(eventName, videoName);
                }
                host.emitVideoEventWithValue({
                    type : "VIDEO_THIRD_QUARTILE",
                    videoName : videoName,
                    url : videoUrl
                });
            });

            txVideoElement.addEventListener('videoEnded', (videoElement) => {
                var videoName = getNativeVideoNameOrUrl(videoElement);
                var videoUrl = getNativeVideoUrl(videoElement);
                host.debugLog("TruexTvmlCore.js videoEnded videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    let eventName = nativeVideoPlayerAdapter.didReplay ? "trackVideoCompletedReplayWithVideoName" : "trackVideoCompletedWithVideoName";
                    host.trackEventWithNameEventValue(eventName, videoName);
                }
                host.emitVideoEventWithValue({
                    type : "VIDEO_COMPLETED",
                    name : videoName,
                    url : videoUrl
                });
                                            
                videoPlayerManager.setVideoDidPlayed(videoUrl);

                videoPlayerManager.videoEnded(txVideoElementId);
            });
            
            txVideoElement.addEventListener('videoPaused', (evt) => {
                var videoName = getNativeVideoNameOrUrl(evt);
                host.debugLog("TruexTvmlCore.js videoPaused videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    host.trackEventWithNameEventValue("trackVideoPausedWithVideoName", videoName);
                }

                videoPlayerManager.videoPaused(txVideoElementId);
            });

            txVideoElement.addEventListener('videoDidEnterFullscreen', (evt) => {
                var videoName = getNativeVideoNameOrUrl(evt);
                const trackingArgs = {
                    "name": "videoDidEnterFullscreen",
                    "value": videoName
                };
                host.debugLog("TruexTvmlCore.js videoDidEnterFullscreen videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    trackInteractionEvent(trackingArgs);
                }
            });

            txVideoElement.addEventListener('videoDidExitFullscreen', (evt) => {
                enableTXButtons();
                evt.target.setAttribute('fullscreen', false);

                var videoName = getNativeVideoNameOrUrl(evt);
                const trackingArgs = {
                    "name": "videoDidExitFullscreen",
                    "value": videoName
                };
                host.debugLog("TruexTvmlCore.js videoDidExitFullscreen videoName: "+ videoName);
                if (shouldTrackVideoEvents) {
                    trackInteractionEvent(trackingArgs);
                }
            });

            txVideoElement.addEventListener('videoDidLoop', (evt) => {
                const loopCountAttribute = evt.target.attributes.getNamedItem('loopCount');
                let loopCount = loopCountAttribute ? parseInt(loopCountAttribute.value) : 0;
                loopCount = (loopCount + 1);

                evt.target.setAttribute('loopCount', loopCount);

                let videoUrl = evt.target.attributes.getNamedItem('src').value;
                videoPlayerManager.setVideoDidPlayed(videoUrl);
            });

            txVideoElement.addEventListener('videoReplay', (evt) => {
                let videoUrl = evt.target.attributes.getNamedItem('src').value;
                videoPlayerManager.setVideoDidPlayed(videoUrl);
            });

            if (txVideoElement.getAttribute('clickToFullscreen') == "true") {
                txVideoElement.addEventListener('select', (evt) => {
                    disableTXButtons();
                    evt.target.setAttribute('focusable', true);

                    setTimeout(() => {
                        evt.target.setAttribute('fullscreen', true);
                        evt.target.setAttribute('priority', 1);
                    }, 0);
                });
            }
        }
    }

    if (numberOfPlayers>0){
        videoPlayerManager.videoPlayerManagerPausedPlayers[document.dataItem['uuid']]=[];
        document.addEventListener("disappear", function(event){
                                      if (event && event.target && event.target.ownerDocument && event.target.ownerDocument.dataItem) {
                                        videoPlayerManager.pauseAllPlayers(event.target.ownerDocument.dataItem['uuid']);
                                      }
                                  });
        document.addEventListener("appear", function(event){
                                      if (event && event.target && event.target.ownerDocument && event.target.ownerDocument.dataItem) {
                                        videoPlayerManager.resumePausedPlayers(event.target.ownerDocument.dataItem['uuid']);
                                      }
                                  });
    }
}

function connectPlayButton(document, txVideoElement, nativeVideoPlayerAdapter) {
    const playButtonAttribute = txVideoElement.attributes.getNamedItem('playbutton');
    if (!playButtonAttribute) {
        return;
    }
    const playButton = document.getElementById(playButtonAttribute.value);
    if (!playButton) {
        return;
    }

    playButton.addEventListener('select', () => {
        nativeVideoPlayerAdapter.play();
        const eventName = nativeVideoPlayerAdapter.didReplay ? "trackVideoReplayWithVideoName" : "trackVideoClickToPlayWithVideoName";
        const videoName = getTxVideoNameOrUrl(txVideoElement);
        host.trackEventWithNameEventValue(eventName, videoName);
    });
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
// there's no tracking/ true[x] logic in this so different ads can implynment their own version with `host.openURLCallback`, to handle ad specify logic, like UI/UX behavior, or try all fox products before fall back to app store etc...
var openUrlWithFallback = function (url, fallbackUrl) {
    host.openURLCallback(url, (success)=>{
                             if (!success){
                                host.openURLCallback(fallbackUrl, ()=>{});
                             }
                         });
}

// MARK: - FI V2 PrimeInsights
var onFIPrimeInsightsCancelAd = function () {
    // The FI V2 PrimeInsights engagements are support to override this.
    host.debugLog("FI V2 PrimeInsights engagements are support to override the onFIPrimeInsightsCancelAd function");
}

var FIPrimeInsightsSetup = function () {
    currentDoc=getActiveDocument();
    initial_video=currentDoc.getElementById('initial_video');
    initial_video.addEventListener('updateProgress', function(event) {
                                   host.updateFiVideoProgressForTrackingWithDurationCurrentTimeProgress(event.duration, event.currentTime, event.progress);
                                   });
}

// For unit testing purposes:
if (typeof module !== 'undefined') {
    module.exports = {
        getVideoPlayerManager: () => {
            return videoPlayerManager;
        },
        setupTXVideos: setupTXVideos,
        App: App
    };
}