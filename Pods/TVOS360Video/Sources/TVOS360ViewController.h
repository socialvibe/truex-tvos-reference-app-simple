//
//  NYT360ViewController.h
//  NYT360Video
//
//  Created by Kyle Lam on 3/19/19.
//  Copyright © 2019 true[X]media. All rights reserved.
//
#import "NYT360ViewControllerBase.h"

@interface TVOS360ViewController : NYT360ViewControllerBase
#pragma mark - Initializers

/**
 *  Initialize a new 360 playback view controller, with the given AVPlayer instance.
 */
- (id)initWithAVPlayer:(AVPlayer *)player;

/**
 *  Allow programmatically orient camera's angle component with x, y as input
 *
 *  @param animated Passing `YES` will animate the change with a standard duration.
 */
- (void)orientCameraAngleToHorizontal:(CGFloat)horizontalDegree vertical:(CGFloat)verticalDegree animated:(BOOL)animated;

/**
 *  Allow programmatically transform camera's angle component with x, y as input
 *
 *  @param animated Passing `YES` will animate the change with a standard duration.
 */
- (void)transformCameraAngleWithDeltaHorizontal:(CGFloat)horizontalDegree deltaVertical:(CGFloat)verticalDegree animated:(BOOL)animated;

/**
 *  Allow caller request the current viewing angle
 */
- (SCNVector3)getEulerAngles;

@end
