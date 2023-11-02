//
//  TruexShared.h
//  TruexAdRenderer
//
//  Created by Jesse Albini on 8/30/17.
//  Copyright © 2017 true[X]media. All rights reserved.
//

#ifndef TruexShared_h
#define TruexShared_h

/* =====================================
 TruexAdRendererDelegate
 ===================================== */
@protocol TruexAdRendererDelegate <NSObject>
- (void)onAdStarted:(NSString*)campaignName;
- (void)onAdCompleted:(NSInteger)timeSpent;
- (void)onAdError:(NSString*)errorMessage;
- (void)onNoAdsAvailable;
- (void)onAdFreePod;

@optional
- (void)onOptIn:(NSString*)campaignName adId:(NSInteger)adId;
- (void)onOptOut:(BOOL)userInitiated;
- (void)onSkipCardShown;
- (void)onUserCancel;
- (void)onFetchAdComplete;
- (void)onUserCancelStream;
- (void)onVideoEventWithParameter:(NSDictionary*)parameter;
- (void)onOverlayCompleted;
- (void)onAdRequestIAP:(NSString*)productIdentifier forQuantity:(NSInteger)quantity withPresentingViewController:(UIViewController*)presentingViewController;
- (void)onRequestShow:(NSString*)action withParameter:(NSDictionary*)parameter;
@end

#endif /* TruexShared_h */
