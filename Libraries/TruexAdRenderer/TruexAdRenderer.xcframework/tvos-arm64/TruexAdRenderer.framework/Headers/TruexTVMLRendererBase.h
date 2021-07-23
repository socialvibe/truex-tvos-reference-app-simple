//
//  TruexTVMLRendererBase.h
//  TruexAdRenderer
//
//  Created by Simon Asselin on 2/24/18.
//  Copyright © 2018 true[X]media. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <TVMLKit/TVMLKit.h>
#import "TruexConstants.h"
#import "TruexPausable.h"
#import "TruexTrackingHandler.h"
#import "TruexExperimentationManager.h"


@class TruexFooter;
@class TruexMotionObserver;
@class TruexTVMLBridge;
@class TruexLinkedSession;
@class TXExtendedInterfaceDelegate;
@class TruexLinkMinifyClient;

static NSString* defaultIAPErrorMessage = @"Not Valid";

@protocol TruexTVMLRendererDelegate

- (void)tvmlDidStart;
- (void)tvmlUserDidOptIn;
- (void)tvmlUserDidOptOut;
- (void)tvmlUserDidTimeout;
- (void)tvmlUserDidCancelInteractiveAd;
- (void)tvmlUserDidAchieveCredit;
- (void)tvmlUserDidAchieveCreditWithNoFreePod;
- (void)tvmlDidCompleteWithTimeSpent:(NSNumber* _Nullable)timeSpent;
- (void)tvmlDidFail:(NSString* _Nonnull)error;
- (void)tvmlUserCancelStream;
- (void)tvmlVideoEventWithParameter:(NSDictionary*)parameter;
- (void)tvmlOverlayDidComplete;
- (void)tvmlAdRequestIAP:(NSString*)productIdentifier forQuantity:(NSInteger)quantity withPresentingViewController:(UIViewController*)presentingViewController completionHandler:(void (^)(BOOL, NSString*))callback;
- (void)tvmlRequestShow:(NSString*)action withParameter:(NSDictionary*)parameter;

- (NSArray*)getVoteSummaryForDisplay;
- (NSDictionary*)getAdVarsConfig;
- (RendererMode)getMode;

@end


@interface TruexTVMLRendererBase : NSObject <TVApplicationControllerDelegate, TruexPausable>

@property (strong, nonatomic) TVApplicationController* _Nullable appController;
@property (weak, nonatomic) UIViewController* _Nullable presentingViewController;
@property (weak, nonatomic) _Nullable id<TruexTVMLRendererDelegate> delegate;
@property (weak, nonatomic) TruexTrackingHandler* _Nullable trackingHandler;
@property (weak, nonatomic) TruexExperimentationManager* _Nullable experimentationManager;
@property (strong, nonatomic) TruexFooter* _Nullable footer;
@property (strong, nonatomic) NSDictionary* _Nullable parsedConfig;
@property (strong, nonatomic) NSDictionary* _Nullable vastConfig;
@property (strong, nonatomic) NSString* _Nullable templateUrl;
@property (assign, atomic) BOOL isPaused;
@property (assign, atomic) BOOL hasFailed;
// The following block (function pointer) is used to track callback for the completion of a showCard operation.
// This enables us to drive certain behaviors, for instance countdown timers, from the time
// a card actually appears on screen.
@property (nonatomic, copy) void (^_Nullable showTvmlCompletionBlock)(void);
@property (assign, atomic) BOOL isSupportingCancelStream;
@property (assign, atomic) BOOL isPauseLive;
@property (assign, atomic) BOOL shouldSendInitialEvent;
@property (strong, nonatomic) TruexMotionObserver* motionObserver;
@property (strong, nonatomic) TruexLinkedSession* _Nullable deviceLink;
@property (strong, nonatomic) TruexLinkMinifyClient* _Nullable minifyClient;

// This is the designated initializer.
- (_Nullable id)initWithParsedConfig:(NSDictionary* _Nonnull)parsedConfig
                            delegate:(id<TruexTVMLRendererDelegate> _Nullable)delegate
                          urlSession:(NSURLSession* _Nonnull)urlSession
                     trackingHandler:(TruexTrackingHandler* _Nullable)trackingHandler
                          vastConfig:(NSDictionary* _Nonnull)vastConfig
                          deviceLink:(TruexLinkedSession* _Nullable)deviceLink
              experimentationManager:(TruexExperimentationManager* _Nullable)experimentationManager
                              userId:(NSString*)userId NS_DESIGNATED_INITIALIZER;
- (void)resetTVMLAppController;
- (void)dismissWithCompletion:(void (^_Nullable)(void))completion;

- (NSDictionary* _Nullable)selectBestCard;
- (NSString* _Nullable)getCardWithName:(NSString* _Nonnull)name;
- (void)showTvmlStep:(NSString* _Nonnull)stepTVML
                        stepName:(NSString* _Nonnull)stepName
                   shouldReplace:(BOOL)replace
          shouldUseLoadingScreen:(BOOL)useLoadingScreen
    flagStepTransitionAsInteract:(BOOL)transitionIsInteract
                   startCallback:(void (^_Nullable)(void))startCallback
                     endCallback:(void (^_Nullable)(void))endCallback;
- (void)onShowTvmlStepCompleteWithName:(NSString* _Nullable)stepName;
- (void)runMessageHandler:(NSString* _Nonnull)messageHandlerJS forMessage:(NSDictionary* _Nullable)message;
- (void)evaluateJavaScript:(NSString* _Nonnull)jsFunctionStr;

+ (BOOL)is4K;
- (BOOL)isInEngagement;

- (void)playBackgroundSoundWithUrl:(NSString* _Nullable)soundUrl loop:(BOOL)loop;
- (void)stopBackgroundSound;
- (void)playForegroundSoundWithUrl:(NSString* _Nullable)soundUrl;

- (BOOL)isPresentedOnScreen;
- (NSString*)getUserId;
- (NSString*)getVersion;
- (TruexTVMLBridge* _Nonnull)setupTVMLBridge;
- (void)setupMinifyClient:(TruexLinkMinifyClient* _Nonnull)minifyClient;

+ (NSArray* _Nonnull)prioritizedSupportedCardNames;

- (void)initExtendedInterfaceCreator;
- (TXExtendedInterfaceDelegate* _Nonnull)createInterfaceDelegate;

@end
