//
//  NYT360ViewController.m
//  NYT360Video
//
//  Created by Thiago on 7/12/16.
//  Copyright © 2016 The New York Times Company. All rights reserved.
//

#import "NYT360ViewController.h"
#import "NYT360CameraController.h"
#import "NYT360PlayerScene.h"


@implementation NYT360ViewController

#pragma mark - Init

- (instancetype)initWithAVPlayer:(AVPlayer *)player motionManager:(id<NYT360MotionManagement>)motionManager {
    self = [super init];
    if (self) {
        CGRect screenBounds = [[UIScreen mainScreen] bounds];
        CGRect initialSceneFrame = NYT360ViewControllerSceneBoundsForScreenBounds(screenBounds);
        self.underlyingSceneSize = initialSceneFrame.size;
        self.sceneView = [[SCNView alloc] initWithFrame:initialSceneFrame];
        self.playerScene = [[NYT360PlayerScene alloc] initWithAVPlayer:player boundToView:self.sceneView];
        self.cameraController = [[NYT360CameraController alloc] initWithView:self.sceneView motionManager:motionManager];
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

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    
    [self.cameraController startMotionUpdates];
}

- (void)viewDidDisappear:(BOOL)animated {
    [super viewDidDisappear:animated];
    
    [self.cameraController stopMotionUpdates];
}

#pragma mark - SCNSceneRendererDelegate

- (void)renderer:(id <SCNSceneRenderer>)renderer updateAtTime:(NSTimeInterval)time {
    [self.cameraController updateCameraAngleForCurrentDeviceMotion];
}


#pragma mark - NYT360CameraControllerDelegate

- (void)cameraController:(NYT360CameraController *)controller userInitallyMovedCameraViaMethod:(NYT360UserInteractionMethod)method {
    [self.delegate videoViewController:self userInitallyMovedCameraViaMethod:method];
}

@end
