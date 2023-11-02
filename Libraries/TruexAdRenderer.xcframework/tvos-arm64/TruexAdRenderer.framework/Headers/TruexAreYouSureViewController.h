//
//  TruexAreYouSureViewController.h
//  TruexAdRenderer
//
//  Created by Simon Asselin on 3/4/18.
//  Copyright © 2018 true[X]media. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol TruexAreYouSureDelegate
- (void)areYouSureYesPushed;
- (void)areYouSureNevermindPushed;
@optional
- (void)trackDisplayAreYouSure;
- (void)trackDismissAreYouSure;
@end


@interface TruexAreYouSureViewController : UIViewController

- (void)setupViewControllerWithDelegate:(id<TruexAreYouSureDelegate> _Nullable)delegate didAchieveTrueAttention:(BOOL)didAchieveTrueAttention;
- (void)setupViewControllerWithDelegate:(id<TruexAreYouSureDelegate> _Nullable)delegate didAchieveTrueAttention:(BOOL)didAchieveTrueAttention withLegacyUI:(BOOL)isLegacySetting;

@end
