//
//  TruexTrackingHandler.h
//  TruexAdRenderer
//
//  Created by Simon Asselin on 2/21/18.
//  Copyright © 2018 true[X]media. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TruexTrackingConfiguration.h"
#import "TruexExperimentationManager.h"


@interface TruexTrackingHandler : NSObject

@property (readonly, strong, nonatomic) NSURL* _Nonnull baseUrl;
@property (readonly, strong, nonatomic) NSURL* _Nonnull choiceCardBaseUrl;
@property (strong, nonatomic) NSString* _Nonnull trackingCategorySuffix;
@property (strong, nonatomic) NSString* _Nonnull fiVideoDuration;
@property (strong, nonatomic) NSString* _Nonnull fiVideoCurrentTime;
@property (strong, nonatomic) NSString* _Nonnull fiVideoProgress;

- (_Nullable id)initWithUrlSession:(NSURLSession* _Nonnull)urlSession serviceUrl:(NSString* _Nonnull)serviceUrl serviceParams:(NSString* _Nonnull)serviceParams choiceCardSessionId:(NSString* _Nonnull)choiceCardSessionId experimentationManager:(TruexExperimentationManager* _Nullable)experimentationManager userId:(NSString* _Nullable)userId options:(NSDictionary* _Nonnull)options;
- (TruexTrackingConfiguration* _Nonnull)getConfiguration;
// Separate setter because ad vars may not be available at init
- (void)setAdVarsConfig:(NSDictionary* _Nonnull)adVars;
- (void)setTrueAttentionTime:(NSNumber* _Nonnull)sec;

- (void)reset;

- (void)trackEventWithPath:(NSString* _Nonnull)path arguments:(NSDictionary* _Nonnull)arguments isChoiceEvent:(BOOL)isChoiceEvent;
- (void)trackEventWithTrackingUrl:(NSURL*)trackingUrl;
- (void)trackInteractionEvent:(NSDictionary* _Nonnull)args;

- (void)trackPlayerLoaded;
- (void)trackFiPlayerLoaded;
- (void)trackChoiceCardSelectedUnit;
- (void)trackChoiceCardSelectedWatch;
- (void)trackChoiceCardAutoAdvanced;
- (void)trackUnitClosedByBackAfterCredit;
- (void)trackUnitClosedByWsAfterCredit;
- (void)trackUnitClosedByBackBeforeCredit;

- (void)trackBrowseWithValue:(NSString* _Nonnull)value;
- (void)trackSlateOpen;
- (void)trackSlateClose;

- (void)trackVideoClickToPlayWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoReplayWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoStartedWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoResumedWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoFirstQuartileWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoSecondQuartileWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoThirdQuartileWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoCompletedWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoStartedReplayWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoFirstQuartileReplayWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoSecondQuartileReplayWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoThirdQuartileReplayWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoCompletedReplayWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoPausedWithVideoName:(NSString* _Nonnull)videoName;
- (void)trackVideoMetric:(NSString* _Nonnull)metricName videoName:(NSString* _Nonnull)videoName value:(NSString* _Nonnull)value;

- (void)trackSkipCardLoad:(NSString* _Nonnull)podIndex;
- (void)trackGotoWithStep:(NSString* _Nonnull)step;
- (void)trackStepLoadTime:(double)loadTimeInSecs stepName:(NSString* _Nonnull)stepName;

- (void)trackAdClosedByTimeoutDuringLoad:(NSString* _Nonnull)direction;
- (void)trackAdClosedByBackDuringLoad:(NSString* _Nonnull)direction;
- (void)trackAdClosedByExternal;

- (void)trackRemoteNavigation:(NSString* _Nonnull)direction;
- (void)trackRemoteSelect;
- (void)trackRemoteMenu;
- (void)trackRemotePlayPause;

- (void)trackLoad;
- (void)trackCredit;

- (void)trackTotalTimeSpentWithTiming:(NSString* _Nonnull)timing;
- (void)trackTotalTimeSpentWithTimingIncludingPausedTime:(NSString* _Nonnull)timing;
- (void)trackTotalTimeSpentCancelWithTiming:(NSString* _Nonnull)timing;
- (void)trackTotalTimeSpentCancelWithTimingIncludingPausedTime:(NSString* _Nonnull)timing;
- (void)trackDisplayAreYouSureWithTiming:(NSString* _Nonnull)timing;
- (void)trackDismissAreYouSureWithTiming:(NSString* _Nonnull)timing;

- (void)trackAdClosedByBackBeforeCredit;
- (void)trackAdClosedByBackAfterCredit;
- (void)trackAdClosedByFooterAfterCredit;
- (void)trackAdClosedByCreativeAfterCredit;

- (void)trackTrueAttentionTimeRequirementMet:(NSString* _Nonnull)timing;
- (void)trackTrueAttentionTimeRequirementMetIncludingPausedTime:(NSString* _Nonnull)timing;
- (void)trackTrueAttentionInteractionRequirementMet:(NSString* _Nonnull)timing;
- (void)trackTrueAttentionInteractionRequirementMetIncludingPausedTime:(NSString* _Nonnull)timing;

- (void)trackEngagementQuartileStarted;
- (void)trackEngagementFirstQuartile;
- (void)trackEngagementSecondQuartile;
- (void)trackEngagementThirdQuartile;
- (void)trackEngagementQuartileCompleted;

- (void)trackOverlayPlayerLoaded;
- (void)trackOverlayAutoAdvanced;

- (void)trackDeeplinkRedirectWithUrl:(NSString*)urlString;
- (void)trackDeeplinkRedirectFailedWithUrl:(NSString*)urlString;
- (void)trackDeeplinkResumeWithUrl:(NSString*)urlString timeSpentWithTiming:(NSString*)timing;

- (void)trackFiChoiceCardSelectedUnit;
- (void)trackFiCardAutoAdvanced;
- (void)trackFiAction:(NSString*)actionName withExtra:(NSString*)extra;
- (void)trackFiCardMenuKeyPressed;
- (void)trackFiTotalTimeSpentWithTiming:(NSString*)timing;
- (void)trackShowboatSkipCard:(NSString*)actionName withExtra:(NSString*)extra;
- (void)trackSetShowboatSetting:(NSString*)showboatSettings withCreditExpiresIn:(NSString*)minutes;

- (void)trackRequestIAP:(NSString*)productIdentifier forQuantity:(NSInteger)quantity;
- (void)trackResumeFromRequestIAP:(BOOL)succeeded withMessage:(NSString*)message withTimeSpent:(NSString*)timing;

- (void)trackTrueTargetingStart:(NSString*)question;
- (void)trackTrueTargetingComplete:(NSString*)question;
- (void)trackTrueTargetingPNA:(NSString*)question;
- (void)trackTrueTargetingMenuExit:(NSString*)question;
- (void)trackTrueTargetingSelectedAgeRange:(NSString*)ageRange onQuestion:(NSString*)question;
- (void)trackTrueTargetingShowFallback:(NSString*)url;
- (void)trackTrueTargetingError:(NSString*)value;

- (void)trackUserEventWithValue:(NSString*)value;
- (void)trackUserEvent:(NSString*)eventIdentifier withValue:(NSString*)value;

- (BOOL)trackEventWithName:(NSString* _Nonnull)eventName
                eventValue:(NSString* _Nonnull)eventValue;

- (void)setVoteResponse:(NSDictionary* _Nonnull)voteResponse;

#pragma mark External Tags
- (void)updateExternalTagsWithContainerArgs:(NSDictionary* _Nonnull)containerArgs;
- (NSDictionary* _Nullable)getExternalTagMatch:(NSString* _Nullable)label;
- (void)fireExternalTag:(NSDictionary* _Nonnull)rawTag
        optTrackingName:(NSString* _Nullable)trackingName
               callback:(void (^_Nullable)(NSURL* _Nullable, BOOL, NSInteger, NSTimeInterval))callback;

#pragma mark Linked Session Events
- (void)trackLinkedSessionEvent:(NSString* _Nonnull)eventName value:(NSString* _Nullable)value;

#pragma mark Click Through Support
- (NSURL* _Nullable)clickThroughUrlForLabel:(NSString* _Nonnull)label;
- (NSArray<NSURL*>* _Nonnull)requestClickThroughPixelsByLabel:(NSString* _Nullable)label
                                                  destination:(NSString* _Nonnull)clickThroughDestination;

#pragma mark JS Bridge Support
- (NSString* _Nullable)insertTrackingMacros:(NSString* _Nullable)urlStr
                                eventMacros:(NSDictionary* _Nullable)eventMacros;

#pragma mark Mock Support
- (BOOL)isMocked;

@end
