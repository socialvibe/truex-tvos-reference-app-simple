//
//  TruexTVMLAdRenderer.h
//  TruexAdRenderer
//
//  Created by Simon Asselin on 2/24/18.
//  Copyright © 2018 true[X]media. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import <TVMLKit/TVMLKit.h>
#import "TruexTVMLRendererBase.h"
#import "TruexFooter.h"
#import "TruexAreYouSureViewController.h"
#import "TXGameView.h"
#import "TXDeviceLinkView.h"
#import "TruexLinkedSession.h"
#import "TruexExperimentationManager.h"


@interface TruexTVMLAdRenderer : TruexTVMLRendererBase <TruexFooterDelegate, TruexAreYouSureDelegate, TXGameViewDelegate, TruexPausableDelegate>

@property (assign, atomic) BOOL didAchieveTrueAttention;

- (_Nullable id)initWithParsedConfig:(NSDictionary* _Nonnull)parsedConfig
                  selectedCardConfig:(NSDictionary* _Nonnull)cardConfig
                            delegate:(id<TruexTVMLRendererDelegate> _Nullable)delegate
                          urlSession:(NSURLSession* _Nonnull)urlSession
                     trackingHandler:(TruexTrackingHandler* _Nullable)trackingHandler
                          vastConfig:vastConfig
                          deviceLink:(TruexLinkedSession* _Nullable)deviceLink
              experimentationManager:(TruexExperimentationManager* _Nonnull)experimentationManager
                              userId:(NSString* _Nonnull)userId NS_DESIGNATED_INITIALIZER;
- (_Nullable id)initWithParsedConfig:(NSDictionary* _Nonnull)parsedConfig
                            delegate:(id<TruexTVMLRendererDelegate> _Nullable)delegate
                          urlSession:(NSURLSession* _Nonnull)urlSession
                     trackingHandler:(TruexTrackingHandler* _Nullable)trackingHandler
                          vastConfig:(NSDictionary* _Nonnull)vastConfig
                          deviceLink:(TruexLinkedSession* _Nullable)deviceLink
              experimentationManager:(TruexExperimentationManager* _Nullable)experimentationManager
    __attribute((deprecated("This inherited init is not supported by this class. Must use TruexTVMLAdRenderer designated initializer instead!")));

- (void)playWithPresentingViewController:(UIViewController* _Nonnull)presentingViewController;
- (void)stop;

- (void)dismissWithCompletion:(void (^_Nullable)(void))completion;
- (void)cancelAd;
- (void)cancelStream;

- (void)startTimers;
- (void)pauseTimers;
- (void)resumeTimers;
- (BOOL)resumeTimersAsAppropriate;
- (void)cancelTimers;
- (void)resumeVideoPlayers;

- (void)flagAchievedTrueAttention;
- (void)trackDisplayAreYouSure;
- (void)trackDismissAreYouSure;

- (void)openURL:(NSString*)urlString callback:(JSValue*)callback withOnResumeFromDeeplinkCallback:(JSValue*)resumeFromDeeplinkCallback;
- (void)resumeFromDeeplinkAsAppropriate;

- (void)requestIAP:(NSString*)productIdentifier forQuantity:(NSInteger)quantity completionHandler:(JSValue*)callback;

- (NSArray*)getVoteSummary;
- (NSDictionary*)getAdVarsConfig;

- (void)disableFooterWatchButton;
- (void)restoreFooter;
- (void)changeFooterMessageWithPreTimeRequirementMessage:(NSString*)preTimeRequirementMessage
                              postTimeRequirementMessage:(NSString*)postTimeRequirementMessage;
- (BOOL)creativeWantsToCompleteAds;

- (BOOL)isPresentingViewController:(UIViewController*)controller;

- (void)onTimeRequirementMet;

// exposing these for child
- (void)handleCompletedAd;
- (void)sendJSLifeCycleEvents:(NSString*)key;
- (void)enableInteractivity;
- (void)onPlayWithPresentingViewControllerShowTvmlStepStart;
- (void)onPlayWithPresentingViewControllerShowTvmlStepEnd;
- (NSTimeInterval)trueAttentionSecs;
- (void)initFooter:(NSNumber*)time;
- (void)resetFooter:(NSNumber*)time;
- (void)setupEngagementVars:(NSDictionary* _Nonnull)cardConfig;
- (void)pauseVideoPlayersAYS;
- (void)resumeVideoPlayersAYS;
- (void)trackCompletedAd;
- (void)trackCancelAd;
- (void)showAreYouSureScreen;
- (void)cancel;

@end
