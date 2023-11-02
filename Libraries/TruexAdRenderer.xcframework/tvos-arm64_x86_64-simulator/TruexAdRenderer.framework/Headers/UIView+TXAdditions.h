//
//  UIView+TXAdditions.h
//
//  Created by David Harrison on 5/4/18.
//

#import <UIKit/UIKit.h>
#import <TVMLKit/TVMLKit.h>


@interface UIView (TXAdditions)

- (void)handleFocusPriority:(int)priority;
- (void)disableParentInteractions;
- (void)enableParentInteractions;

@end
