//
//  ViewController.m
//  TruexSimpleReferenceApp
//
//  Copyright © 2021 true[X]. All rights reserved.
//

#import "ViewController.h"

@import AVKit;

@interface ViewController ()

@property AVPlayer *player;
@property AVPlayerViewController *playerController;

@end

@implementation ViewController

static NSString* const StreamURLString = @"https://ctv.truex.com/assets/reference-app-stream-no-ads-720p.mp4";

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.playerController = [AVPlayerViewController new];
    NSURL* streamUrl = [NSURL URLWithString:StreamURLString];
    self.player = [AVPlayer playerWithURL:streamUrl];
    self.playerController.player = self.player;
    [self.view addSubview:self.playerController.view];
    self.playerController.view.frame = self.view.frame;
    [self.player play];
}

@end
