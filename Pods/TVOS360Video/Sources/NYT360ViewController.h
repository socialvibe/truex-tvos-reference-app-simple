//
//  NYT360ViewController.h
//  NYT360Video
//
//  Created by Thiago on 7/12/16.
//  Copyright © 2016 The New York Times Company. All rights reserved.
//
#import "NYT360ViewControllerBase.h"
#import "NYT360MotionManagement.h"



@interface NYT360ViewController : NYT360ViewControllerBase
    #pragma mark - Initializers
    /**
     *  Initialize a new 360 playback view controller, with the given AVPlayer instance and device motion manager.
     */
    - (id)initWithAVPlayer:(AVPlayer *)player motionManager:(id<NYT360MotionManagement>)motionManager;
@end
