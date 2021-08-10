//
//  TruexPauseable.h
//  TruexAdRenderer
//
//  Created by Isaiah Mann on 4/15/19.
//  Copyright © 2019 true[X]media. All rights reserved.
//

@protocol TruexPausableDelegate

- (void)subscribeToPauseState:(void (^)(BOOL))handler;

@end

@protocol TruexPausable

@property (assign, atomic) BOOL isPaused;

- (void)pause;
- (void)resume;

@end
