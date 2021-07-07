//
//  TruexAdRenderer.h
//  TruexAdRenderer v3.9.9
//
//  Created by Jesse Albini on 8/30/17.
//  Copyright © 2017 true[X]media. All rights reserved.
//

#import <UIKit/UIKit.h>

//! Project version number for TruexAdRenderer.
FOUNDATION_EXPORT double TruexAdRendererVersionNumber;

//! Project version string for TruexAdRenderer.
FOUNDATION_EXPORT const unsigned char TruexAdRendererVersionString[];

#import "TruexConstants.h"
#import "TruexShared.h"
#import "TruexTVMLRenderer.h"

@import InnovidAdRenderer;

/* =====================================
 TruexAdRenderer
 ===================================== */
static NSString* const FI_CARD_KEY = @"FI_card";
static NSString* const FI_CARD_FIPRIMEINSIGHTS_KEY = @"FI_card_v2";
static NSString* const SHOWBOAT_CARD_KEY = @"Showboat_card";

// ADLAB-494: Promo - Ad free solution (client)
static NSString* const TRUEX_SHOWBOAT_PROMO_CONFIG = @"truexShowboatConfig";


@interface TruexAdRenderer : NSObject <InnovidAdRendererDelegate, TruexTVMLRendererDelegate>
+ (void)setDebugMode:(bool)mode;
+ (NSString* _Nonnull)getUserId;

@property (nonatomic, weak) _Nullable id<TruexAdRendererDelegate> delegate;

- (_Nullable id)initWithUrl:(NSString* _Nullable)creativeUrl
               adParameters:(NSDictionary* _Nonnull)adParameters
                   slotType:(NSString* _Nonnull)slotType;

- (_Nullable id)initWithUrl:(NSString* _Nullable)creativeUrl
               adParameters:(NSDictionary* _Nonnull)adParameters
                   slotType:(NSString* _Nonnull)slotType
        optimizelyProjectId:(NSString* _Nullable)optimizelyProjectId
           optimizelyUserId:(NSString* _Nullable)userId
    __attribute((deprecated("Optimizely has been removed from TruexAdRenderer. Please use `initWithUrl:adParameters:slotType` instead.")));

- (_Nullable id)initWithUrlSession:(NSURLSession* _Nullable)session
                      tvmlRenderer:(TruexTVMLRenderer* _Nullable)tvmlRenderer
                       creativeUrl:(NSString* _Nullable)creativeUrl
                      adParameters:(NSDictionary* _Nonnull)adParameters
                          slotType:(NSString* _Nonnull)slotType;

- (_Nullable id)initWithUrlSession:(NSURLSession* _Nullable)session
                      tvmlRenderer:(TruexTVMLRenderer* _Nullable)tvmlRenderer
                       creativeUrl:(NSString* _Nullable)creativeUrl
                      adParameters:(NSDictionary* _Nonnull)adParameters
                          slotType:(NSString* _Nonnull)slotType
               optimizelyProjectId:(NSString* _Nullable)optimizelyProjectId
                  optimizelyUserId:(NSString* _Nullable)userId
    __attribute((deprecated("Optimizely has been removed from TruexAdRenderer. Please use `initWithUrlSession:tvmlRenderer:creativeUrl:adParameters:slotType` instead.")));

- (void)start:(UIViewController* _Null_unspecified)baseViewController;
- (void)stop;
- (void)pause;
- (void)resume;

- (void)adRequestedIAPResult:(BOOL)succeed withMessage:(NSString*)message;

// InnovidAdRendererDelegate methods
- (void)innovidDidCompleteWithTimeSpent:(NSNumber* _Nullable)timeSpent;
- (void)innovidDidFail:(NSString* _Nonnull)error;
- (void)innovidDidStart;
- (void)innovidUserDidAchieveCredit;
- (void)innovidUserDidCancelInteractiveAd;
- (void)innovidUserDidCancelStream;
- (void)innovidUserDidOptIn;
- (void)innovidUserDidOptOut;
- (void)innovidUserDidTimeout;

// TruexTVMLRendererDelegate
- (void)tvmlDidStart;
- (void)tvmlUserDidOptIn;
- (void)tvmlUserDidOptOut;
- (void)tvmlUserDidTimeout;
- (void)tvmlUserDidCancelInteractiveAd;
- (void)tvmlUserDidAchieveCredit;
- (void)tvmlUserDidAchieveCreditWithNoFreePod;
- (void)tvmlDidCompleteWithTimeSpent:(NSNumber* _Nullable)timeSpent;
- (void)tvmlDidFail:(NSString* _Nonnull)error;
- (void)tvmlOverlayDidComplete;
- (void)tvmlAdRequestIAP:(NSString*)productIdentifier forQuantity:(NSInteger)quantity withPresentingViewController:(UIViewController*)presentingViewController completionHandler:(void (^)(BOOL, NSString*))callback;
- (void)tvmlRequestShow:(NSString*)action withParameter:(NSDictionary*)parameter;

@end
