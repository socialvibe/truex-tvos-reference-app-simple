//
//  HoverImage.h
//
//  Created by David Harrison on 2/27/18.
//

#import "TXBaseView.h"


@interface TXButtonView : TXBaseView

@property (strong, nonatomic) UIImageView* defaultImage;
@property (nonatomic, readonly) BOOL isSelected;

- (BOOL)hoverEffectEnabled:(NSDictionary*)attrs;
- (void)onTap;
- (void)unselect;

@end
