//
//  NYT360ViewController.h
//  NYT360Video
//
//  Created by Kyle Lam on 3/19/19.
//  Copyright © 2019 true[X]media. All rights reserved.
//

@import UIKit;
@import SceneKit;
@import AVFoundation;

#import "NYT360DataTypes.h"
#import "NYT360CameraController.h"
#import "NYT360PlayerScene.h"

@class NYT360CameraPanGestureRecognizer;
@class NYT360ViewControllerBase;

CGRect NYT360ViewControllerSceneFrameForContainingBounds(CGRect containingBounds, CGSize underlyingSceneSize);
CGRect NYT360ViewControllerSceneBoundsForScreenBounds(CGRect screenBounds);

NS_ASSUME_NONNULL_BEGIN

@protocol NYT360ViewControllerDelegate <NSObject>

/**
 *  Called when the compass angle is updated.
 *
 *  @param viewController The view controller that updated the angle.
 *  @param compassAngle The current compass angle. The value will be within the range of plus or minus one radian, non-inclusive, where a positive value is equivalent to a clockwise rotation.
 *
 *  @note This method is called synchronously from SCNSceneRendererDelegate; its implementation should return quickly to avoid performance implications.
 */
- (void)nyt360ViewController:(NYT360ViewControllerBase *)viewController didUpdateCompassAngle:(float)compassAngle;

/**
 *  Called when the user first moves the camera.
 *
 *  @param viewController   The view controller with which the user interacted.
 *  @param method           The method by which the user moved the camera.
 */
- (void)videoViewController:(NYT360ViewControllerBase *)viewController userInitallyMovedCameraViaMethod:(NYT360UserInteractionMethod)method;

@end

/**
 *  NYT360ViewController plays 360º video from an AVPlayer and handles user interaction to move the camera around the video.
 *
 *  NYT360ViewController should be initialized and then embedded in your application UI via view controller containment.
 *
 *  This class is the entry point for the NYT360Video library.
 */
@interface NYT360ViewControllerBase : UIViewController <SCNSceneRendererDelegate>

/**
 *  The delegate of the view controller.
 *
 *  @seealso NYT360ViewControllerDelegate
 */
@property (nullable, nonatomic, weak) id <NYT360ViewControllerDelegate> delegate;

#pragma mark - Playback

/**
 *  Play the view controller's video.
 */
- (void)play;

/**
 *  Pause the view controller's video.
 */
- (void)pause;

#pragma mark - Camera Movement

/**
 *  Returns the current compass angle.
 *
 *  The value will be within the range of plus or minus one radian, non-inclusive, where a positive value is equivalent to a clockwise rotation.
 */
@property (nonatomic, readonly) float compassAngle;

/**
 *  An otherwise vanilla subclass of UIPanGestureRecognizer used by NYT360Video to enable manual camera panning. This class is exposed so that host applications can more easily configure interaction with other gesture recognizers without having to have references to specific instances of an NYT360Video pan recognizer.
 */
@property (nonatomic, readonly) NYT360CameraPanGestureRecognizer *panRecognizer;

/**
 *  Changing this property will allow you to suppress undesired range of motion along either the x or y axis for device motion input. For example, y axis input might be suppressed when a 360 video is playing inline in a scroll view.
 
 *  When this property is set, any disallowed axis will cause the current camera angles to be clamped to zero for that axis. Existing angles for the any allowed axes will not be affected.
 
 *  Defaults to NYT360PanningAxisHorizontal | NYT360PanningAxisVertical.
 */
@property (nonatomic, assign) NYT360PanningAxis allowedDeviceMotionPanningAxes;

/**
 *  Changing this property will allow you to suppress undesired range of motion along either the x or y axis for pan gesture recognizer input. For example, y axis input should probably be suppressed when a 360 video is playing inline in a scroll view.
 
 *  When this property is set, any disallowed axis will cause the current camera angles to be clamped to zero for that axis. Existing angles for the any allowed axes will not be affected.
 
 *  Defaults to NYT360PanningAxisHorizontal | NYT360PanningAxisVertical.
 */
@property (nonatomic, assign) NYT360PanningAxis allowedPanGesturePanningAxes;

/**
 *  Reorients the camera's vertical angle component so it's pointing directly at the horizon.
 *
 *  @param animated Passing `YES` will animate the change with a standard duration.
 */
- (void)reorientVerticalCameraAngleToHorizon:(BOOL)animated;

@end

NS_ASSUME_NONNULL_END


@interface NYT360ViewControllerBase () <NYT360CameraControllerDelegate>

@property (nonatomic) CGSize underlyingSceneSize;
@property (nonatomic) SCNView *sceneView;
@property (nonatomic) NYT360PlayerScene *playerScene;
@property (nonatomic) NYT360CameraController *cameraController;

@end
