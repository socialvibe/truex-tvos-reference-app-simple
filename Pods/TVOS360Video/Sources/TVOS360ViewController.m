//
//  NYT360ViewController.m
//  NYT360Video
//
//  Created by Kyle Lam on 3/19/19.
//  Copyright © 2019 true[X]media. All rights reserved.
//

#import "TVOS360ViewController.h"

@implementation TVOS360ViewController

#pragma mark - Init

- (instancetype)initWithAVPlayer:(AVPlayer *)player{
    self = [super init];
    if (self) {
        CGRect screenBounds = [[UIScreen mainScreen] bounds];
        CGRect initialSceneFrame = NYT360ViewControllerSceneBoundsForScreenBounds(screenBounds);
        self.underlyingSceneSize = initialSceneFrame.size;
        self.sceneView = [[SCNView alloc] initWithFrame:initialSceneFrame];
        self.playerScene = [[NYT360PlayerScene alloc] initWithAVPlayer:player boundToView:self.sceneView];
        self.cameraController = [[NYT360CameraController alloc] initWithView:self.sceneView motionManager:nil];
        self.cameraController.delegate = self;

        typeof(self) __weak weakSelf = self;
        self.cameraController.compassAngleUpdateBlock = ^(float compassAngle) {
            typeof(self) strongSelf = weakSelf;
            if (!strongSelf) {
                return;
            }

            [strongSelf.delegate nyt360ViewController:strongSelf didUpdateCompassAngle:strongSelf.compassAngle];
        };

    }
    return self;
}

- (void)orientCameraAngleToHorizontal:(CGFloat)horizontalDegree vertical:(CGFloat)verticalDegree animated:(BOOL)animated {
    [self.cameraController orientCameraAngleToHorizontal:(CGFloat)horizontalDegree vertical:(CGFloat)verticalDegree animated:(BOOL)animated];
}

- (void)transformCameraAngleWithDeltaHorizontal:(CGFloat)horizontalDegree deltaVertical:(CGFloat)verticalDegree animated:(BOOL)animated {
    [self.cameraController transformCameraAngleWithDeltaHorizontal:horizontalDegree deltaVertical:verticalDegree animated:(BOOL)animated];
}

- (SCNVector3)getEulerAngles {
    SCNVector3 eulerAngles = self.sceneView.pointOfView.eulerAngles;
    return eulerAngles;
}

@end
