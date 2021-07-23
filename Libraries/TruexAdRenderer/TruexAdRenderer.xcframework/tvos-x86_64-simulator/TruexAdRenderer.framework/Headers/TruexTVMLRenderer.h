//
//  TruexTVMLRenderer.h
//  TruexAdRenderer
//
//  Created by Simon Asselin on 2/6/18.
//  Copyright © 2018 true[X]media. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "TruexTVMLRendererBase.h"


@interface TruexTVMLRenderer : TruexTVMLRendererBase

// Override for the super class designated initializer.
- (_Nullable id)initWithParsedConfig:(NSDictionary* _Nonnull)parsedConfig
                            delegate:(id<TruexTVMLRendererDelegate> _Nullable)delegate
                          urlSession:(NSURLSession* _Nonnull)urlSession
                     trackingHandler:(TruexTrackingHandler* _Nullable)trackingHandler
                          vastConfig:(NSDictionary* _Nonnull)vastConfig
                          deviceLink:(TruexLinkedSession* _Nullable)deviceLink
              experimentationManager:(TruexExperimentationManager* _Nullable)experimentationManager
                              userId:(NSString*)userId NS_DESIGNATED_INITIALIZER;
- (void)playWithPresentingViewController:(UIViewController* _Nonnull)presentingViewController;
- (void)stop;

- (void)dismissWithCompletion:(void (^_Nullable)(void))completion;
- (void)cancelTimer;
- (void)resumeTimer;
- (BOOL)resumeTimerAsAppropriate;
- (void)pauseTimer;

- (void)processTemplateUrl:(NSString* _Nullable)url;

- (void)menuKeyPushed:(UITapGestureRecognizer* _Nullable)sender;

- (BOOL)isInEngagement;

- (NSTimeInterval)choiceCardTimeout;

@end
