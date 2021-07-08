//
//  ViewController.m
//  TruexSimpleReferenceApp
//
//  Copyright © 2021 true[X]. All rights reserved.
//

#import "ViewController.h"

@import AVKit;
@import TruexAdRenderer;

@interface ViewController ()

@property AVPlayer *player;
@property AVPlayerViewController *playerController;
@property TruexAdRenderer *adRenderer;

@end

@implementation ViewController

static NSString* const StreamURLString = @"https://ctv.truex.com/assets/reference-app-stream-no-cards-1080p.mp4";

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.playerController = [AVPlayerViewController new];
    NSURL* streamUrl = [NSURL URLWithString:StreamURLString];
    self.player = [AVPlayer playerWithURL:streamUrl];
    self.playerController.player = self.player;
    [self.view addSubview:self.playerController.view];
    self.playerController.view.frame = self.view.frame;
    
    [self setAdBreaks:self.player];
    
    [self.player play];
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

- (void)initializeAdRenderer:(NSString *)adSlotType {
    self.adRenderer = [[TruexAdRenderer alloc] initWithUrl:@"https://media.truex.com/placeholder.js"
                                              adParameters:@{}
                                                  slotType:adSlotType];
}

@end
