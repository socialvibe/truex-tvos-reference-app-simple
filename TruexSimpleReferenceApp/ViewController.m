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
static int const PrerollAdBreakEndSeconds = 93;

- (void)viewDidLoad {
    [super viewDidLoad];

    self.playerController = [AVPlayerViewController new];
    NSURL* streamUrl = [NSURL URLWithString:StreamURLString];
    self.player = [AVPlayer playerWithURL:streamUrl];
    self.playerController.player = self.player;
    [self.view addSubview:self.playerController.view];
    self.playerController.view.frame = self.view.frame;

    [self setAdBreaks:self.player];

    self.adRenderer = [self initializeAdRenderer:PREROLL];
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
    TruexAdRenderer *renderer = [[TruexAdRenderer alloc] initWithUrl:@""
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
    
    // TODO: make this configurable outside the source code
    return @{
          @"placement_hash" : @"bdfe2ba97e74172a75e325d307db6cfc16f92325",
          @"vast_config_url" : [NSString stringWithFormat:@"qa-get.truex.com/bdfe2ba97e74172a75e325d307db6cfc16f92325/vast/config?asnw=&cpx_url=&%@&fw_key_values=&metr=0&network_user_id=%@&prof=g_as3_truex&ptgt=a&pvrn=&resp=vmap1&slid=fw_truex&ssnw=&stream_id=136083572&vdur=&vprn=",
                                @"dimension_2=0&flag=%2Bamcb%2Bemcr%2Bslcb%2Bvicb%2Baeti-exvt",
                                userId],
          @"user_id" : userId
    };
}

// MARK: - true[X] Ad Renderer Delegate Methods
-(void) onAdStarted:(NSString*)campaignName {
    NSLog(@"Showing ad: %@", campaignName);
}

-(void) onAdFreePod {
    if ([self.currentAdSlotType isEqualToString:PREROLL]) {
        CMTime seekTime = CMTimeMakeWithSeconds(PrerollAdBreakEndSeconds, 1000);
        [self.player seekToTime:seekTime toleranceBefore:kCMTimeZero toleranceAfter:kCMTimeZero];
    }
    // TODO: add logic to handle skip linear ads in MIDROLL
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
