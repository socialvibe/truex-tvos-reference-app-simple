//
//  NYT360MotionManager.m
//  NYT360Video
//
//  Created by Jared Sinclair on 8/3/16.
//  Copyright © 2016 The New York Times Company. All rights reserved.
//

#import "NYT360MotionManager.h"

///-----------------------------------------------------------------------------
/// NYT360MotionManagerObserverItem
///-----------------------------------------------------------------------------

@interface NYT360MotionManagerObserverItem: NSObject

@property (nonatomic, readonly) NSUUID *token;
@property (nonatomic, readonly) NSTimeInterval preferredUpdateInterval;

@end

@implementation NYT360MotionManagerObserverItem

- (instancetype)initWithPreferredUpdateInterval:(NSTimeInterval)interval {
    self = [super init];
    if (self) {
        _token = [NSUUID new];
        _preferredUpdateInterval = interval;
    }
    return self;
}

@end

///-----------------------------------------------------------------------------
/// NYT360MotionManager
///-----------------------------------------------------------------------------

static const NSTimeInterval NYT360MotionManagerPreferredMotionUpdateInterval = (1.0 / 60.0);

@interface NYT360MotionManager ()

@property (nonatomic, readonly) NSMutableDictionary <__kindof NSUUID *, NYT360MotionManagerObserverItem *> *observerItems;

#if !TARGET_OS_TV
@property (nonatomic, readonly) CMMotionManager *motionManager;
#endif

@end

@implementation NYT360MotionManager

#pragma mark - Singleton

+ (instancetype)sharedManager {
    static dispatch_once_t once;
    static NYT360MotionManager *sharedManager;
    dispatch_once(&once, ^ { sharedManager = [[self alloc] init]; });
    return sharedManager;
}

#pragma mark - Init

- (instancetype)init {
    self = [super init];
    if (self) {
        _observerItems = [NSMutableDictionary new];
#if !TARGET_OS_TV
        _motionManager = ({
            CMMotionManager *manager = [CMMotionManager new];
            manager.deviceMotionUpdateInterval = NYT360MotionManagerPreferredMotionUpdateInterval;
            manager;
        });
#endif
    }
    return self;
}

#pragma mark - NYT360MotionManagement

- (BOOL)isDeviceMotionAvailable {
#if !TARGET_OS_TV
    return self.motionManager.isDeviceMotionAvailable;
#endif
    return NO;
}

- (BOOL)isDeviceMotionActive {
#if !TARGET_OS_TV
    return self.motionManager.isDeviceMotionActive;
#endif
    return NO;
}

#if !TARGET_OS_TV
- (CMDeviceMotion *)deviceMotion {
    return self.motionManager.deviceMotion;
}
#endif

- (NSUUID *)startUpdating:(NSTimeInterval)preferredUpdateInterval {
    NSAssert([NSOperationQueue currentQueue] == [NSOperationQueue mainQueue], @"NYT360MotionManager may only be used on the main queue.");
    NSUInteger previousCount = self.observerItems.count;
    NYT360MotionManagerObserverItem *item = [[NYT360MotionManagerObserverItem alloc] initWithPreferredUpdateInterval:preferredUpdateInterval];
    self.observerItems[item.token] = item;
#if !TARGET_OS_TV
    self.motionManager.deviceMotionUpdateInterval = self.resolvedUpdateInterval;
    if (self.observerItems.count > 0 && previousCount == 0) {
        [self.motionManager startDeviceMotionUpdates];
    }
#endif
    return item.token;
}

- (void)stopUpdating:(NSUUID *)token {
    NSAssert([NSOperationQueue currentQueue] == [NSOperationQueue mainQueue], @"NYT360MotionManager may only be used on the main queue.");
    NSParameterAssert(token);
    NSUInteger previousCount = self.observerItems.count;
    [self.observerItems removeObjectForKey:token];
#if !TARGET_OS_TV
    self.motionManager.deviceMotionUpdateInterval = self.resolvedUpdateInterval;
    if (self.observerItems.count == 0 && previousCount > 0) {
        [self.motionManager stopDeviceMotionUpdates];
    }
#endif
}

#pragma mark - Internal

- (NSUInteger)numberOfObservers {
    return self.observerItems.count;
}

- (NSTimeInterval)resolvedUpdateInterval {
    NSArray *allItems = self.observerItems.allValues;
    if (allItems.count == 0) {
        return NYT360MotionManagerPreferredMotionUpdateInterval;
    }
    return [[allItems valueForKeyPath:@"@min.preferredUpdateInterval"] doubleValue];
}

@end
