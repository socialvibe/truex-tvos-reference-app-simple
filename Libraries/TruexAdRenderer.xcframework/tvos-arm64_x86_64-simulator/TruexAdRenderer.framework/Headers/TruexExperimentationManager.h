//
//  TruexExperimentationManager.h
//  TruexAdRenderer
//
//  Created by Simon Asselin on 5/22/18.
//  Copyright © 2018 true[X]media. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "TruexSharedInternal.h"


@interface TruexExperimentationManager : NSObject
// Active First Impression variation for the current user. Set as part of init flow.
@property (strong, nonatomic) NSString* firstImpressionExperimentVariation;
// Active Showboat Promo variation for the current user. Set as part of init flow.
@property (strong, nonatomic) NSString* showboatPromoExperimentVariation;

// True Targeting variations. Set as part of init flow.
@property (strong, nonatomic) NSString* trueTargetingAgeGenderOrderExperimentVariation;
@property (strong, nonatomic) NSString* trueTargetingSurveyFileExperimentVariation;

// Init the experimentation manager.
- (id)init;
// This is the designated initializer, accepts an RTB ad payload, with an expected `variations` node containing
// the activated experiments.
- (id)initWithAdConfig:(NSDictionary*)parsedConfig;
// Return the variation activated for a given experiment.
- (NSString*)getVariationFromExperiment:(NSString*)experimentName;
// Is the First Impression active where the FI Flow, but not the normal behavior (CC+E) is expected?
- (BOOL)isFirstImpressionActive;
// Are we in the `t2` First Impression experiment variation where the normal behavior (CC+E) is expected?
- (BOOL)isFirstImpressionVariationChoiceCard;
// Is the Showboat experiment active where the Promo Flow, but not the normal behavior (CC+E) is expected?
- (BOOL)isShowboatPromoActive;

@end
