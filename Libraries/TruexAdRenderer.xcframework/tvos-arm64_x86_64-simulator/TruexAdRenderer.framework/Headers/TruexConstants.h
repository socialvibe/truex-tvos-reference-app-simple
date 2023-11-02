//
//  TruexConstants.h
//  TruexAdRenderer
//
//  Created by Jesse Albini on 8/30/17.
//  Copyright © 2017 true[X]media. All rights reserved.
//

#ifndef TruexConstants_h
#define TruexConstants_h

typedef NS_ENUM(NSInteger, RendererMode) {
    RendererModeQA,
    RendererModeProd
};

extern NSString* const MIDROLL;
extern NSString* const PREROLL;
extern NSString* const PAUSELIVE;
extern NSString* const OVERLAYLIVE;

// version
extern NSString* const TRUEX_AD_RENDERER_VERSION;
extern NSString* const TRUEX_AD_RENDERER_XCODE_BUILD_VERSION;
extern NSString* const TRUEX_NO_TRACK_USER_ID_KEY;

extern NSString* const TruexAdRendererDomain;

#endif /* TruexConstants_h */
