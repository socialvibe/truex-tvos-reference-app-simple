//
//  TruexTrackingConfiguration.h
//  TruexAdRenderer
//
//  Created by Isaiah Mann on 1/4/19.
//  Copyright © 2019 true[X]media. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TruexExperimentationManager.h"


@interface TruexTrackingConfiguration : NSObject

@property (readonly) NSString* url;
@property (readonly) NSString* params;
@property (readonly) NSString* sessionId;
@property (readonly) NSString* userId;

- (instancetype)initWithURL:(NSString*)url
                     params:(NSString*)params
                  sessionId:(NSString*)sessionId
     experimentationManager:(TruexExperimentationManager* _Nullable)experimentationManager
                     userId:(NSString*)userId;

- (void)setAdVarsConfig:(NSDictionary*)adVars;

- (NSString*)getParam:(NSString*)name;
- (NSString* _Nullable)getVariationFromExperiment:(NSString* _Nonnull)experimentName;

- (NSString*)getAdWidth;
- (NSString*)getAdHeight;

#pragma MARK Ad Vars Config
- (NSString*)getCurrencyLabel;
- (NSString*)getPlacementId;
- (NSString*)getPartnerId;
- (NSString*)getPartnerConfigHash;
- (NSString*)getUserAgent;

@end
