//
//  TruexApiJsSrcHandler.h
//  TruexApiJsSrcHandler
//
//  Created by Kyle Lam on 4/17/18.
//  Copyright © 2018 true[X]media. All rights reserved.
//
@interface TruexApiJsSrcHandler : NSObject

@property (strong, nonatomic) NSDictionary* _Nullable parsedConfig;
@property (weak, nonatomic) NSURLSession* urlSession;

- (_Nullable id)initWithUrlSession:(NSURLSession* _Nonnull)urlSession;

- (NSURL* _Nullable)getTruexApiJsSrcResourceURL:(NSString*)mainCardXMLString;

@end
