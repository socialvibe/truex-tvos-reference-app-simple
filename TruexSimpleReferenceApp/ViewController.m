//
//  ViewController.m
//  TruexSimpleReferenceApp
//
//  Copyright © 2021 true[X]. All rights reserved.
//

#import "ViewController.h"

@import AVKit;
@import TruexAdRenderer;

@interface ViewController () <TruexAdRendererDelegate>

@property AVPlayer *player;
@property AVPlayerViewController *playerController;
@property TruexAdRenderer *adRenderer;
@property NSString *currentAdSlotType;

@end

@implementation ViewController

static NSString* const StreamURLString = @"https://ctv.truex.com/assets/reference-app-stream-no-cards-1080p.mp4";

// business logic constants:
static int const AdBreakEndSeconds = 93;
static int const MidrollAdBreakDimensionValue = 2;

- (void)viewDidLoad {
    [super viewDidLoad];

    self.playerController = [AVPlayerViewController new];
    NSURL* streamUrl = [NSURL URLWithString:StreamURLString];
    self.player = [AVPlayer playerWithURL:streamUrl];
    self.playerController.player = self.player;
    [self.view addSubview:self.playerController.view];
    self.playerController.view.frame = self.view.frame;

    [self setAdBreaks:self.player];

    self.adRenderer = [self initializeAdRenderer:MIDROLL];
}

- (void)setAdBreaks:(AVPlayer *)player {
    AVPlayerItem *content = player.currentItem;
    content.interstitialTimeRanges = @[
        // time: 0:00
        [[AVInterstitialTimeRange alloc] initWithTimeRange:CMTimeRangeMake(kCMTimeZero, CMTimeMake(90, 1))],
        // time: 9:52
        [[AVInterstitialTimeRange alloc] initWithTimeRange:CMTimeRangeMake(CMTimeMake(592, 1), CMTimeMake(90, 1))]
    ];
}

- (TruexAdRenderer*)initializeAdRenderer:(NSString *)adSlotType {
    TruexAdRenderer *renderer = [[TruexAdRenderer alloc] initWithUrl:@"https://media.truex.com/placeholder.js"
                                                        adParameters:[self getFakeAdParams]
                                                            slotType:adSlotType];
    self.currentAdSlotType = adSlotType;
    renderer.delegate = self;
    return renderer;
}

// Fake response from an ad server
- (NSDictionary*)getFakeAdParams {
    // workaround to always show the ad (simulates a different user each time):
    NSString *userId = [NSUUID UUID].UUIDString;
    
    // final string should format to (network_user_id parameter will change value each time):
    NSString *innovidTvosVastConfigUrl = [NSString stringWithFormat:@"https://qa-get.truex.com/bdfe2ba97e74172a75e325d307db6cfc16f92325/vast/config?dimension_1=test&dimension_2=%d&stream_position=%@ network_user_id=%@",
                               MidrollAdBreakDimensionValue,
                               MIDROLL,
                               userId];
    NSString *tvmlVastConfigUrl = [NSString stringWithFormat:@"https://qa-get.truex.com/c250f9806e2c0c310fc5a62e86c9805d55c1ac07/vast/config?dimension_1=test&dimension_2=%d&stream_position=%@ network_user_id=%@",
                               MidrollAdBreakDimensionValue,
                               MIDROLL,
                               userId];
    NSString *vastConfigUrl = tvmlVastConfigUrl;
    NSLog(@"[TRUEX DEBUG] requesting ad from Vast Config URL: %@", vastConfigUrl);

    // TODO: make this configurable outside the source code
    return @{
          @"placement_hash" : @"bdfe2ba97e74172a75e325d307db6cfc16f92325",
          @"vast_config_url" : vastConfigUrl,
          @"user_id" : userId
    };
}

// MARK: - true[X] Ad Renderer Delegate Methods
-(void) onAdStarted:(NSString*)campaignName {
    NSLog(@"Showing ad: %@", campaignName);
}

-(void) onAdFreePod {
    CMTime seekTime = CMTimeMakeWithSeconds(AdBreakEndSeconds, 1000);
    [self.player seekToTime:seekTime toleranceBefore:kCMTimeZero toleranceAfter:kCMTimeZero];
    // TODO: add logic to handle skip linear ads not at start of video
}

-(void) onAdCompleted:(NSInteger)timeSpent {
    [self.player play];
}

-(void) onAdError:(NSString *)errorMessage {
    [self.player play];
}

-(void) onNoAdsAvailable {
    [self.player play];
}

-(void) onUserCancelStream {
    [self dismissViewControllerAnimated:YES completion:nil];
}

-(void) onFetchAdComplete {
    [self.adRenderer start:self.playerController];
}

@end
