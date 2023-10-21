#if 0
#elif defined(__arm64__) && __arm64__
// Generated by Apple Swift version 5.4.2 effective-4.2 (swiftlang-1205.0.28.2 clang-1205.0.19.57)
#ifndef INNOVIDADRENDERER_SWIFT_H
#define INNOVIDADRENDERER_SWIFT_H
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wgcc-compat"

#if !defined(__has_include)
# define __has_include(x) 0
#endif
#if !defined(__has_attribute)
# define __has_attribute(x) 0
#endif
#if !defined(__has_feature)
# define __has_feature(x) 0
#endif
#if !defined(__has_warning)
# define __has_warning(x) 0
#endif

#if __has_include(<swift/objc-prologue.h>)
# include <swift/objc-prologue.h>
#endif

#pragma clang diagnostic ignored "-Wauto-import"
#include <Foundation/Foundation.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#if !defined(SWIFT_TYPEDEFS)
# define SWIFT_TYPEDEFS 1
# if __has_include(<uchar.h>)
#  include <uchar.h>
# elif !defined(__cplusplus)
typedef uint_least16_t char16_t;
typedef uint_least32_t char32_t;
# endif
typedef float swift_float2  __attribute__((__ext_vector_type__(2)));
typedef float swift_float3  __attribute__((__ext_vector_type__(3)));
typedef float swift_float4  __attribute__((__ext_vector_type__(4)));
typedef double swift_double2  __attribute__((__ext_vector_type__(2)));
typedef double swift_double3  __attribute__((__ext_vector_type__(3)));
typedef double swift_double4  __attribute__((__ext_vector_type__(4)));
typedef int swift_int2  __attribute__((__ext_vector_type__(2)));
typedef int swift_int3  __attribute__((__ext_vector_type__(3)));
typedef int swift_int4  __attribute__((__ext_vector_type__(4)));
typedef unsigned int swift_uint2  __attribute__((__ext_vector_type__(2)));
typedef unsigned int swift_uint3  __attribute__((__ext_vector_type__(3)));
typedef unsigned int swift_uint4  __attribute__((__ext_vector_type__(4)));
#endif

#if !defined(SWIFT_PASTE)
# define SWIFT_PASTE_HELPER(x, y) x##y
# define SWIFT_PASTE(x, y) SWIFT_PASTE_HELPER(x, y)
#endif
#if !defined(SWIFT_METATYPE)
# define SWIFT_METATYPE(X) Class
#endif
#if !defined(SWIFT_CLASS_PROPERTY)
# if __has_feature(objc_class_property)
#  define SWIFT_CLASS_PROPERTY(...) __VA_ARGS__
# else
#  define SWIFT_CLASS_PROPERTY(...)
# endif
#endif

#if __has_attribute(objc_runtime_name)
# define SWIFT_RUNTIME_NAME(X) __attribute__((objc_runtime_name(X)))
#else
# define SWIFT_RUNTIME_NAME(X)
#endif
#if __has_attribute(swift_name)
# define SWIFT_COMPILE_NAME(X) __attribute__((swift_name(X)))
#else
# define SWIFT_COMPILE_NAME(X)
#endif
#if __has_attribute(objc_method_family)
# define SWIFT_METHOD_FAMILY(X) __attribute__((objc_method_family(X)))
#else
# define SWIFT_METHOD_FAMILY(X)
#endif
#if __has_attribute(noescape)
# define SWIFT_NOESCAPE __attribute__((noescape))
#else
# define SWIFT_NOESCAPE
#endif
#if __has_attribute(ns_consumed)
# define SWIFT_RELEASES_ARGUMENT __attribute__((ns_consumed))
#else
# define SWIFT_RELEASES_ARGUMENT
#endif
#if __has_attribute(warn_unused_result)
# define SWIFT_WARN_UNUSED_RESULT __attribute__((warn_unused_result))
#else
# define SWIFT_WARN_UNUSED_RESULT
#endif
#if __has_attribute(noreturn)
# define SWIFT_NORETURN __attribute__((noreturn))
#else
# define SWIFT_NORETURN
#endif
#if !defined(SWIFT_CLASS_EXTRA)
# define SWIFT_CLASS_EXTRA
#endif
#if !defined(SWIFT_PROTOCOL_EXTRA)
# define SWIFT_PROTOCOL_EXTRA
#endif
#if !defined(SWIFT_ENUM_EXTRA)
# define SWIFT_ENUM_EXTRA
#endif
#if !defined(SWIFT_CLASS)
# if __has_attribute(objc_subclassing_restricted)
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# else
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# endif
#endif
#if !defined(SWIFT_RESILIENT_CLASS)
# if __has_attribute(objc_class_stub)
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME) __attribute__((objc_class_stub))
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_class_stub)) SWIFT_CLASS_NAMED(SWIFT_NAME)
# else
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME)
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) SWIFT_CLASS_NAMED(SWIFT_NAME)
# endif
#endif

#if !defined(SWIFT_PROTOCOL)
# define SWIFT_PROTOCOL(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
# define SWIFT_PROTOCOL_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
#endif

#if !defined(SWIFT_EXTENSION)
# define SWIFT_EXTENSION(M) SWIFT_PASTE(M##_Swift_, __LINE__)
#endif

#if !defined(OBJC_DESIGNATED_INITIALIZER)
# if __has_attribute(objc_designated_initializer)
#  define OBJC_DESIGNATED_INITIALIZER __attribute__((objc_designated_initializer))
# else
#  define OBJC_DESIGNATED_INITIALIZER
# endif
#endif
#if !defined(SWIFT_ENUM_ATTR)
# if defined(__has_attribute) && __has_attribute(enum_extensibility)
#  define SWIFT_ENUM_ATTR(_extensibility) __attribute__((enum_extensibility(_extensibility)))
# else
#  define SWIFT_ENUM_ATTR(_extensibility)
# endif
#endif
#if !defined(SWIFT_ENUM)
# define SWIFT_ENUM(_type, _name, _extensibility) enum _name : _type _name; enum SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# if __has_feature(generalized_swift_name)
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) enum _name : _type _name SWIFT_COMPILE_NAME(SWIFT_NAME); enum SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# else
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) SWIFT_ENUM(_type, _name, _extensibility)
# endif
#endif
#if !defined(SWIFT_UNAVAILABLE)
# define SWIFT_UNAVAILABLE __attribute__((unavailable))
#endif
#if !defined(SWIFT_UNAVAILABLE_MSG)
# define SWIFT_UNAVAILABLE_MSG(msg) __attribute__((unavailable(msg)))
#endif
#if !defined(SWIFT_AVAILABILITY)
# define SWIFT_AVAILABILITY(plat, ...) __attribute__((availability(plat, __VA_ARGS__)))
#endif
#if !defined(SWIFT_WEAK_IMPORT)
# define SWIFT_WEAK_IMPORT __attribute__((weak_import))
#endif
#if !defined(SWIFT_DEPRECATED)
# define SWIFT_DEPRECATED __attribute__((deprecated))
#endif
#if !defined(SWIFT_DEPRECATED_MSG)
# define SWIFT_DEPRECATED_MSG(...) __attribute__((deprecated(__VA_ARGS__)))
#endif
#if __has_feature(attribute_diagnose_if_objc)
# define SWIFT_DEPRECATED_OBJC(Msg) __attribute__((diagnose_if(1, Msg, "warning")))
#else
# define SWIFT_DEPRECATED_OBJC(Msg) SWIFT_DEPRECATED_MSG(Msg)
#endif
#if !defined(IBSegueAction)
# define IBSegueAction
#endif
#if __has_feature(modules)
#if __has_warning("-Watimport-in-framework-header")
#pragma clang diagnostic ignored "-Watimport-in-framework-header"
#endif
@import AVFoundation;
@import Foundation;
@import ObjectiveC;
#endif

#pragma clang diagnostic ignored "-Wproperty-attribute-mismatch"
#pragma clang diagnostic ignored "-Wduplicate-method-arg"
#if __has_warning("-Wpragma-clang-attribute")
# pragma clang diagnostic ignored "-Wpragma-clang-attribute"
#endif
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma clang diagnostic ignored "-Wnullability"

#if __has_attribute(external_source_symbol)
# pragma push_macro("any")
# undef any
# pragma clang attribute push(__attribute__((external_source_symbol(language="Swift", defined_in="InnovidAdRenderer",generated_declaration))), apply_to=any(function,enum,objc_interface,objc_category,objc_protocol))
# pragma pop_macro("any")
#endif

@class NSString;

@interface AVPlayer (SWIFT_EXTENSION(InnovidAdRenderer))
@property (nonatomic, readonly, copy) NSString * _Nonnull debugDescription;
@end


@interface AVPlayerItem (SWIFT_EXTENSION(InnovidAdRenderer))
@property (nonatomic, readonly, copy) NSString * _Nonnull debugDescription;
@end


@interface AVURLAsset (SWIFT_EXTENSION(InnovidAdRenderer))
@property (nonatomic, readonly, copy) NSString * _Nonnull debugDescription;
@end

@class NSNumber;

/// Button on choice card screen
SWIFT_CLASS("_TtC17InnovidAdRenderer16ChoiceCardButton")
@interface ChoiceCardButton : NSObject
- (nonnull instancetype)initWithX:(NSInteger)x y:(NSInteger)y imageURI:(NSString * _Nonnull)imageURI OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end


SWIFT_CLASS("_TtC17InnovidAdRenderer15InnovidAdParams")
@interface InnovidAdParams : NSObject
- (nonnull instancetype)initWithShowName:(NSString * _Nullable)showName showGenre:(NSString * _Nullable)showGenre OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end

@class UIViewController;

SWIFT_PROTOCOL("_TtP17InnovidAdRenderer17InnovidAdRenderer_")
@protocol InnovidAdRenderer
/// show the innovid renderer from presentingViewController; we will keep a weak reference to presentingViewController
- (void)playWithPresentingViewController:(UIViewController * _Nonnull)presentingViewController;
/// shutdown and dismiss innovid
- (void)stop;
/// callback for ssai ad video playback progress; required for SSAI integrations
- (void)onSSAIAdPlaybackWithRemainingTime:(NSTimeInterval)remainingTime duration:(NSTimeInterval)duration;
/// callback for ssai ad video completion; required for SSAI integrations
- (void)onSSAIAdComplete;
@end


SWIFT_PROTOCOL("_TtP17InnovidAdRenderer25InnovidAdRendererDelegate_")
@protocol InnovidAdRendererDelegate
/// Innovid is complete: timeSpent > 0 if they completed any interactive requirements
- (void)innovidDidCompleteWithTimeSpent:(NSNumber * _Nullable)timeSpent;
/// Innovid is complete: User exited Innovid ad by pressing menu button (Innovid is complete)
- (void)innovidUserDidCancelStream;
/// Innovid is complete: failed with error
- (void)innovidDidFail:(NSString * _Nonnull)error;
@optional
/// when we have started rendering
- (void)innovidDidStart;
/// user chooses interactive ad on choice card
- (void)innovidUserDidOptIn;
/// user chooses regular playback on choice card
- (void)innovidUserDidOptOut;
/// choice card screen times out
- (void)innovidUserDidTimeout;
/// user presses back from interactive ad
- (void)innovidUserDidCancelInteractiveAd;
/// user satisfies interactive ad requirements
- (void)innovidUserDidAchieveCredit;
@end

enum Renderer : NSInteger;
@class TrueXAdParams;
@class LiveAdParams;

/// Innovid parameters object
SWIFT_CLASS("_TtC17InnovidAdRenderer23InnovidAdRendererParams")
@interface InnovidAdRendererParams : NSObject
- (nonnull instancetype)initWithAdIdentifier:(NSString * _Nonnull)adIdentifier renderer:(enum Renderer)renderer trueXAdParams:(TrueXAdParams * _Nonnull)trueXAdParams liveAdParams:(LiveAdParams * _Nullable)liveAdParams innovidAdParams:(InnovidAdParams * _Nullable)innovidAdParams OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithAdIdentifier:(NSString * _Nonnull)adIdentifier trueXAdParams:(TrueXAdParams * _Nonnull)trueXAdParams;
- (nonnull instancetype)initWithAdIdentifier:(NSString * _Nonnull)adIdentifier liveAdParams:(LiveAdParams * _Nonnull)liveAdParams;
- (nonnull instancetype)initWithAdIdentifier:(NSString * _Nonnull)adIdentifier innovidAdParams:(InnovidAdParams * _Nonnull)innovidAdParams;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end

typedef SWIFT_ENUM(NSInteger, ProductType, open) {
  ProductTypeNone = 0,
  ProductTypeSponsoredStream = 1,
  ProductTypeSponsoredAdBreak = 2,
  ProductTypeContinueProduct = 3,
};

typedef SWIFT_ENUM(NSInteger, Renderer, open) {
  RendererIRoll = 0,
  RendererTrueX = 1,
  RendererSsai = 2,
  RendererLive = 3,
};

enum VideoEvent : NSInteger;
enum LifecycleEvent : NSInteger;
enum InteractionEvent : NSInteger;

/// Callbacks provided by InnovidAdRenderer
SWIFT_PROTOCOL("_TtP17InnovidAdRenderer15InnovidDelegate_")
@protocol InnovidDelegate
@optional
/// videoEvent callbacks
- (void)innovidOnVideoEvent:(enum VideoEvent)event videoName:(NSString * _Nonnull)videoName value:(NSString * _Nullable)value;
/// lifecycle callbacks
- (void)innovidOnLifecycleEvent:(enum LifecycleEvent)event value:(NSString * _Nullable)value;
/// user interaction callbacks
- (void)innovidOnInteractionEvent:(enum InteractionEvent)event value:(NSString * _Nullable)value;
@end


/// InnovidProvider instantiates and provides an InnovidAdRenderer instance for public use
SWIFT_CLASS("_TtC17InnovidAdRenderer15InnovidProvider")
@interface InnovidProvider : NSObject
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end

@class SSAIAdParams;

@interface InnovidProvider (SWIFT_EXTENSION(InnovidAdRenderer))
/// iRoll
+ (id <InnovidAdRenderer> _Nonnull)instantiateWithAdIdentifier:(NSString * _Nonnull)adIdentifier adURI:(NSString * _Nonnull)adURI delegate:(id <InnovidDelegate> _Nonnull)delegate params:(InnovidAdParams * _Nonnull)params isAdURIJSON:(BOOL)isAdURIJSON SWIFT_WARN_UNUSED_RESULT;
/// TrueX
+ (id <InnovidAdRenderer> _Nonnull)instantiateTrueXWithAdIdentifier:(NSString * _Nonnull)adIdentifier adURI:(NSString * _Nonnull)adURI delegate:(id <InnovidAdRendererDelegate> _Nonnull)delegate params:(TrueXAdParams * _Nonnull)params SWIFT_WARN_UNUSED_RESULT;
/// Live
+ (id <InnovidAdRenderer> _Nonnull)instantiateLiveWithAdIdentifier:(NSString * _Nonnull)adIdentifier adURI:(NSString * _Nonnull)adURI delegate:(id <InnovidDelegate> _Nonnull)delegate params:(LiveAdParams * _Nonnull)params isAdURIJSON:(BOOL)isAdURIJSON SWIFT_WARN_UNUSED_RESULT;
/// SSAI
+ (id <InnovidAdRenderer> _Nonnull)instantiateSSAIWithAdIdentifier:(NSString * _Nonnull)adIdentifier adURI:(NSString * _Nonnull)adURI delegate:(id <InnovidDelegate> _Nonnull)delegate params:(SSAIAdParams * _Nonnull)params SWIFT_WARN_UNUSED_RESULT;
@end

/// User interaction events
typedef SWIFT_ENUM(NSInteger, InteractionEvent, open) {
  InteractionEventAcceptInvitation = 0,
/// user engaged with the ad
  InteractionEventExpand = 1,
/// interactive ad was expanded
  InteractionEventCollapse = 2,
};

/// Lifecycle events
/// start and one of the following will always be called: cancel, fail, complete
typedef SWIFT_ENUM(NSInteger, LifecycleEvent, open) {
  LifecycleEventStart = 0,
/// renderer is ready
  LifecycleEventImpression = 1,
/// intro video started
  LifecycleEventCancel = 2,
/// ad was canceled by the user (by pressing the menu button)
  LifecycleEventFail = 3,
/// an error occured; ad is complete
  LifecycleEventComplete = 4,
};

@class NSDate;

SWIFT_CLASS("_TtC17InnovidAdRenderer12LiveAdParams")
@interface LiveAdParams : NSObject
- (nonnull instancetype)initWithLiveAdSlotStartDate:(NSDate * _Nonnull)liveAdSlotStartDate liveAdDuration:(NSTimeInterval)liveAdDuration showName:(NSString * _Nullable)showName showGenre:(NSString * _Nullable)showGenre OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end



SWIFT_CLASS("_TtC17InnovidAdRenderer12SSAIAdParams")
@interface SSAIAdParams : InnovidAdParams
- (nonnull instancetype)initWithShowName:(NSString * _Nullable)showName showGenre:(NSString * _Nullable)showGenre OBJC_DESIGNATED_INITIALIZER;
@end


SWIFT_CLASS("_TtC17InnovidAdRenderer13TrueXAdParams")
@interface TrueXAdParams : NSObject
- (nonnull instancetype)initWithProduct:(enum ProductType)product showSkipCardImmediately:(BOOL)showSkipCardImmediately episodeThumbnailImageURI:(NSString * _Nullable)episodeThumbnailImageURI episodeName:(NSString * _Nullable)episodeName interactiveAdTimeRequiredSeconds:(NSInteger)interactiveAdTimeRequiredSeconds skipCardImageURI:(NSString * _Nullable)skipCardImageURI autoAdvanceTimerSeconds:(NSInteger)autoAdvanceTimerSeconds choiceCardBackgroundImageURI:(NSString * _Nullable)choiceCardBackgroundImageURI choiceCardBackgroundVideoURI:(NSString * _Nullable)choiceCardBackgroundVideoURI choiceCardVoiceoverURI:(NSString * _Null_unspecified)choiceCardVoiceoverURI choiceCardInteractButton:(ChoiceCardButton * _Nullable)choiceCardInteractButton choiceCardWatchButton:(ChoiceCardButton * _Nullable)choiceCardWatchButton choiceCardButtonDelayTimeInterval:(NSTimeInterval)choiceCardButtonDelayTimeInterval surveyConfigURI:(NSString * _Nullable)surveyConfigURI podIndex:(NSInteger)podIndex trueXURI:(NSString * _Nullable)trueXURI trueXParams:(NSString * _Nullable)trueXParams OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end











/// video events
/// progress events are called every second
typedef SWIFT_ENUM(NSInteger, VideoEvent, open) {
  VideoEventStart = 0,
/// video started
  VideoEventFirstQuartile = 1,
/// first quartile played
  VideoEventMidpoint = 2,
/// midpoint reached
  VideoEventThirdQuartile = 3,
/// third quartile played
  VideoEventComplete = 4,
/// video complete
  VideoEventProgress = 5,
};

#if __has_attribute(external_source_symbol)
# pragma clang attribute pop
#endif
#pragma clang diagnostic pop
#endif

#elif defined(__x86_64__) && __x86_64__
// Generated by Apple Swift version 5.4.2 effective-4.2 (swiftlang-1205.0.28.2 clang-1205.0.19.57)
#ifndef INNOVIDADRENDERER_SWIFT_H
#define INNOVIDADRENDERER_SWIFT_H
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wgcc-compat"

#if !defined(__has_include)
# define __has_include(x) 0
#endif
#if !defined(__has_attribute)
# define __has_attribute(x) 0
#endif
#if !defined(__has_feature)
# define __has_feature(x) 0
#endif
#if !defined(__has_warning)
# define __has_warning(x) 0
#endif

#if __has_include(<swift/objc-prologue.h>)
# include <swift/objc-prologue.h>
#endif

#pragma clang diagnostic ignored "-Wauto-import"
#include <Foundation/Foundation.h>
#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>

#if !defined(SWIFT_TYPEDEFS)
# define SWIFT_TYPEDEFS 1
# if __has_include(<uchar.h>)
#  include <uchar.h>
# elif !defined(__cplusplus)
typedef uint_least16_t char16_t;
typedef uint_least32_t char32_t;
# endif
typedef float swift_float2  __attribute__((__ext_vector_type__(2)));
typedef float swift_float3  __attribute__((__ext_vector_type__(3)));
typedef float swift_float4  __attribute__((__ext_vector_type__(4)));
typedef double swift_double2  __attribute__((__ext_vector_type__(2)));
typedef double swift_double3  __attribute__((__ext_vector_type__(3)));
typedef double swift_double4  __attribute__((__ext_vector_type__(4)));
typedef int swift_int2  __attribute__((__ext_vector_type__(2)));
typedef int swift_int3  __attribute__((__ext_vector_type__(3)));
typedef int swift_int4  __attribute__((__ext_vector_type__(4)));
typedef unsigned int swift_uint2  __attribute__((__ext_vector_type__(2)));
typedef unsigned int swift_uint3  __attribute__((__ext_vector_type__(3)));
typedef unsigned int swift_uint4  __attribute__((__ext_vector_type__(4)));
#endif

#if !defined(SWIFT_PASTE)
# define SWIFT_PASTE_HELPER(x, y) x##y
# define SWIFT_PASTE(x, y) SWIFT_PASTE_HELPER(x, y)
#endif
#if !defined(SWIFT_METATYPE)
# define SWIFT_METATYPE(X) Class
#endif
#if !defined(SWIFT_CLASS_PROPERTY)
# if __has_feature(objc_class_property)
#  define SWIFT_CLASS_PROPERTY(...) __VA_ARGS__
# else
#  define SWIFT_CLASS_PROPERTY(...)
# endif
#endif

#if __has_attribute(objc_runtime_name)
# define SWIFT_RUNTIME_NAME(X) __attribute__((objc_runtime_name(X)))
#else
# define SWIFT_RUNTIME_NAME(X)
#endif
#if __has_attribute(swift_name)
# define SWIFT_COMPILE_NAME(X) __attribute__((swift_name(X)))
#else
# define SWIFT_COMPILE_NAME(X)
#endif
#if __has_attribute(objc_method_family)
# define SWIFT_METHOD_FAMILY(X) __attribute__((objc_method_family(X)))
#else
# define SWIFT_METHOD_FAMILY(X)
#endif
#if __has_attribute(noescape)
# define SWIFT_NOESCAPE __attribute__((noescape))
#else
# define SWIFT_NOESCAPE
#endif
#if __has_attribute(ns_consumed)
# define SWIFT_RELEASES_ARGUMENT __attribute__((ns_consumed))
#else
# define SWIFT_RELEASES_ARGUMENT
#endif
#if __has_attribute(warn_unused_result)
# define SWIFT_WARN_UNUSED_RESULT __attribute__((warn_unused_result))
#else
# define SWIFT_WARN_UNUSED_RESULT
#endif
#if __has_attribute(noreturn)
# define SWIFT_NORETURN __attribute__((noreturn))
#else
# define SWIFT_NORETURN
#endif
#if !defined(SWIFT_CLASS_EXTRA)
# define SWIFT_CLASS_EXTRA
#endif
#if !defined(SWIFT_PROTOCOL_EXTRA)
# define SWIFT_PROTOCOL_EXTRA
#endif
#if !defined(SWIFT_ENUM_EXTRA)
# define SWIFT_ENUM_EXTRA
#endif
#if !defined(SWIFT_CLASS)
# if __has_attribute(objc_subclassing_restricted)
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_subclassing_restricted)) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# else
#  define SWIFT_CLASS(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
#  define SWIFT_CLASS_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_CLASS_EXTRA
# endif
#endif
#if !defined(SWIFT_RESILIENT_CLASS)
# if __has_attribute(objc_class_stub)
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME) __attribute__((objc_class_stub))
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) __attribute__((objc_class_stub)) SWIFT_CLASS_NAMED(SWIFT_NAME)
# else
#  define SWIFT_RESILIENT_CLASS(SWIFT_NAME) SWIFT_CLASS(SWIFT_NAME)
#  define SWIFT_RESILIENT_CLASS_NAMED(SWIFT_NAME) SWIFT_CLASS_NAMED(SWIFT_NAME)
# endif
#endif

#if !defined(SWIFT_PROTOCOL)
# define SWIFT_PROTOCOL(SWIFT_NAME) SWIFT_RUNTIME_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
# define SWIFT_PROTOCOL_NAMED(SWIFT_NAME) SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_PROTOCOL_EXTRA
#endif

#if !defined(SWIFT_EXTENSION)
# define SWIFT_EXTENSION(M) SWIFT_PASTE(M##_Swift_, __LINE__)
#endif

#if !defined(OBJC_DESIGNATED_INITIALIZER)
# if __has_attribute(objc_designated_initializer)
#  define OBJC_DESIGNATED_INITIALIZER __attribute__((objc_designated_initializer))
# else
#  define OBJC_DESIGNATED_INITIALIZER
# endif
#endif
#if !defined(SWIFT_ENUM_ATTR)
# if defined(__has_attribute) && __has_attribute(enum_extensibility)
#  define SWIFT_ENUM_ATTR(_extensibility) __attribute__((enum_extensibility(_extensibility)))
# else
#  define SWIFT_ENUM_ATTR(_extensibility)
# endif
#endif
#if !defined(SWIFT_ENUM)
# define SWIFT_ENUM(_type, _name, _extensibility) enum _name : _type _name; enum SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# if __has_feature(generalized_swift_name)
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) enum _name : _type _name SWIFT_COMPILE_NAME(SWIFT_NAME); enum SWIFT_COMPILE_NAME(SWIFT_NAME) SWIFT_ENUM_ATTR(_extensibility) SWIFT_ENUM_EXTRA _name : _type
# else
#  define SWIFT_ENUM_NAMED(_type, _name, SWIFT_NAME, _extensibility) SWIFT_ENUM(_type, _name, _extensibility)
# endif
#endif
#if !defined(SWIFT_UNAVAILABLE)
# define SWIFT_UNAVAILABLE __attribute__((unavailable))
#endif
#if !defined(SWIFT_UNAVAILABLE_MSG)
# define SWIFT_UNAVAILABLE_MSG(msg) __attribute__((unavailable(msg)))
#endif
#if !defined(SWIFT_AVAILABILITY)
# define SWIFT_AVAILABILITY(plat, ...) __attribute__((availability(plat, __VA_ARGS__)))
#endif
#if !defined(SWIFT_WEAK_IMPORT)
# define SWIFT_WEAK_IMPORT __attribute__((weak_import))
#endif
#if !defined(SWIFT_DEPRECATED)
# define SWIFT_DEPRECATED __attribute__((deprecated))
#endif
#if !defined(SWIFT_DEPRECATED_MSG)
# define SWIFT_DEPRECATED_MSG(...) __attribute__((deprecated(__VA_ARGS__)))
#endif
#if __has_feature(attribute_diagnose_if_objc)
# define SWIFT_DEPRECATED_OBJC(Msg) __attribute__((diagnose_if(1, Msg, "warning")))
#else
# define SWIFT_DEPRECATED_OBJC(Msg) SWIFT_DEPRECATED_MSG(Msg)
#endif
#if !defined(IBSegueAction)
# define IBSegueAction
#endif
#if __has_feature(modules)
#if __has_warning("-Watimport-in-framework-header")
#pragma clang diagnostic ignored "-Watimport-in-framework-header"
#endif
@import AVFoundation;
@import Foundation;
@import ObjectiveC;
#endif

#pragma clang diagnostic ignored "-Wproperty-attribute-mismatch"
#pragma clang diagnostic ignored "-Wduplicate-method-arg"
#if __has_warning("-Wpragma-clang-attribute")
# pragma clang diagnostic ignored "-Wpragma-clang-attribute"
#endif
#pragma clang diagnostic ignored "-Wunknown-pragmas"
#pragma clang diagnostic ignored "-Wnullability"

#if __has_attribute(external_source_symbol)
# pragma push_macro("any")
# undef any
# pragma clang attribute push(__attribute__((external_source_symbol(language="Swift", defined_in="InnovidAdRenderer",generated_declaration))), apply_to=any(function,enum,objc_interface,objc_category,objc_protocol))
# pragma pop_macro("any")
#endif

@class NSString;

@interface AVPlayer (SWIFT_EXTENSION(InnovidAdRenderer))
@property (nonatomic, readonly, copy) NSString * _Nonnull debugDescription;
@end


@interface AVPlayerItem (SWIFT_EXTENSION(InnovidAdRenderer))
@property (nonatomic, readonly, copy) NSString * _Nonnull debugDescription;
@end


@interface AVURLAsset (SWIFT_EXTENSION(InnovidAdRenderer))
@property (nonatomic, readonly, copy) NSString * _Nonnull debugDescription;
@end

@class NSNumber;

/// Button on choice card screen
SWIFT_CLASS("_TtC17InnovidAdRenderer16ChoiceCardButton")
@interface ChoiceCardButton : NSObject
- (nonnull instancetype)initWithX:(NSInteger)x y:(NSInteger)y imageURI:(NSString * _Nonnull)imageURI OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end


SWIFT_CLASS("_TtC17InnovidAdRenderer15InnovidAdParams")
@interface InnovidAdParams : NSObject
- (nonnull instancetype)initWithShowName:(NSString * _Nullable)showName showGenre:(NSString * _Nullable)showGenre OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end

@class UIViewController;

SWIFT_PROTOCOL("_TtP17InnovidAdRenderer17InnovidAdRenderer_")
@protocol InnovidAdRenderer
/// show the innovid renderer from presentingViewController; we will keep a weak reference to presentingViewController
- (void)playWithPresentingViewController:(UIViewController * _Nonnull)presentingViewController;
/// shutdown and dismiss innovid
- (void)stop;
/// callback for ssai ad video playback progress; required for SSAI integrations
- (void)onSSAIAdPlaybackWithRemainingTime:(NSTimeInterval)remainingTime duration:(NSTimeInterval)duration;
/// callback for ssai ad video completion; required for SSAI integrations
- (void)onSSAIAdComplete;
@end


SWIFT_PROTOCOL("_TtP17InnovidAdRenderer25InnovidAdRendererDelegate_")
@protocol InnovidAdRendererDelegate
/// Innovid is complete: timeSpent > 0 if they completed any interactive requirements
- (void)innovidDidCompleteWithTimeSpent:(NSNumber * _Nullable)timeSpent;
/// Innovid is complete: User exited Innovid ad by pressing menu button (Innovid is complete)
- (void)innovidUserDidCancelStream;
/// Innovid is complete: failed with error
- (void)innovidDidFail:(NSString * _Nonnull)error;
@optional
/// when we have started rendering
- (void)innovidDidStart;
/// user chooses interactive ad on choice card
- (void)innovidUserDidOptIn;
/// user chooses regular playback on choice card
- (void)innovidUserDidOptOut;
/// choice card screen times out
- (void)innovidUserDidTimeout;
/// user presses back from interactive ad
- (void)innovidUserDidCancelInteractiveAd;
/// user satisfies interactive ad requirements
- (void)innovidUserDidAchieveCredit;
@end

enum Renderer : NSInteger;
@class TrueXAdParams;
@class LiveAdParams;

/// Innovid parameters object
SWIFT_CLASS("_TtC17InnovidAdRenderer23InnovidAdRendererParams")
@interface InnovidAdRendererParams : NSObject
- (nonnull instancetype)initWithAdIdentifier:(NSString * _Nonnull)adIdentifier renderer:(enum Renderer)renderer trueXAdParams:(TrueXAdParams * _Nonnull)trueXAdParams liveAdParams:(LiveAdParams * _Nullable)liveAdParams innovidAdParams:(InnovidAdParams * _Nullable)innovidAdParams OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)initWithAdIdentifier:(NSString * _Nonnull)adIdentifier trueXAdParams:(TrueXAdParams * _Nonnull)trueXAdParams;
- (nonnull instancetype)initWithAdIdentifier:(NSString * _Nonnull)adIdentifier liveAdParams:(LiveAdParams * _Nonnull)liveAdParams;
- (nonnull instancetype)initWithAdIdentifier:(NSString * _Nonnull)adIdentifier innovidAdParams:(InnovidAdParams * _Nonnull)innovidAdParams;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end

typedef SWIFT_ENUM(NSInteger, ProductType, open) {
  ProductTypeNone = 0,
  ProductTypeSponsoredStream = 1,
  ProductTypeSponsoredAdBreak = 2,
  ProductTypeContinueProduct = 3,
};

typedef SWIFT_ENUM(NSInteger, Renderer, open) {
  RendererIRoll = 0,
  RendererTrueX = 1,
  RendererSsai = 2,
  RendererLive = 3,
};

enum VideoEvent : NSInteger;
enum LifecycleEvent : NSInteger;
enum InteractionEvent : NSInteger;

/// Callbacks provided by InnovidAdRenderer
SWIFT_PROTOCOL("_TtP17InnovidAdRenderer15InnovidDelegate_")
@protocol InnovidDelegate
@optional
/// videoEvent callbacks
- (void)innovidOnVideoEvent:(enum VideoEvent)event videoName:(NSString * _Nonnull)videoName value:(NSString * _Nullable)value;
/// lifecycle callbacks
- (void)innovidOnLifecycleEvent:(enum LifecycleEvent)event value:(NSString * _Nullable)value;
/// user interaction callbacks
- (void)innovidOnInteractionEvent:(enum InteractionEvent)event value:(NSString * _Nullable)value;
@end


/// InnovidProvider instantiates and provides an InnovidAdRenderer instance for public use
SWIFT_CLASS("_TtC17InnovidAdRenderer15InnovidProvider")
@interface InnovidProvider : NSObject
- (nonnull instancetype)init OBJC_DESIGNATED_INITIALIZER;
@end

@class SSAIAdParams;

@interface InnovidProvider (SWIFT_EXTENSION(InnovidAdRenderer))
/// iRoll
+ (id <InnovidAdRenderer> _Nonnull)instantiateWithAdIdentifier:(NSString * _Nonnull)adIdentifier adURI:(NSString * _Nonnull)adURI delegate:(id <InnovidDelegate> _Nonnull)delegate params:(InnovidAdParams * _Nonnull)params isAdURIJSON:(BOOL)isAdURIJSON SWIFT_WARN_UNUSED_RESULT;
/// TrueX
+ (id <InnovidAdRenderer> _Nonnull)instantiateTrueXWithAdIdentifier:(NSString * _Nonnull)adIdentifier adURI:(NSString * _Nonnull)adURI delegate:(id <InnovidAdRendererDelegate> _Nonnull)delegate params:(TrueXAdParams * _Nonnull)params SWIFT_WARN_UNUSED_RESULT;
/// Live
+ (id <InnovidAdRenderer> _Nonnull)instantiateLiveWithAdIdentifier:(NSString * _Nonnull)adIdentifier adURI:(NSString * _Nonnull)adURI delegate:(id <InnovidDelegate> _Nonnull)delegate params:(LiveAdParams * _Nonnull)params isAdURIJSON:(BOOL)isAdURIJSON SWIFT_WARN_UNUSED_RESULT;
/// SSAI
+ (id <InnovidAdRenderer> _Nonnull)instantiateSSAIWithAdIdentifier:(NSString * _Nonnull)adIdentifier adURI:(NSString * _Nonnull)adURI delegate:(id <InnovidDelegate> _Nonnull)delegate params:(SSAIAdParams * _Nonnull)params SWIFT_WARN_UNUSED_RESULT;
@end

/// User interaction events
typedef SWIFT_ENUM(NSInteger, InteractionEvent, open) {
  InteractionEventAcceptInvitation = 0,
/// user engaged with the ad
  InteractionEventExpand = 1,
/// interactive ad was expanded
  InteractionEventCollapse = 2,
};

/// Lifecycle events
/// start and one of the following will always be called: cancel, fail, complete
typedef SWIFT_ENUM(NSInteger, LifecycleEvent, open) {
  LifecycleEventStart = 0,
/// renderer is ready
  LifecycleEventImpression = 1,
/// intro video started
  LifecycleEventCancel = 2,
/// ad was canceled by the user (by pressing the menu button)
  LifecycleEventFail = 3,
/// an error occured; ad is complete
  LifecycleEventComplete = 4,
};

@class NSDate;

SWIFT_CLASS("_TtC17InnovidAdRenderer12LiveAdParams")
@interface LiveAdParams : NSObject
- (nonnull instancetype)initWithLiveAdSlotStartDate:(NSDate * _Nonnull)liveAdSlotStartDate liveAdDuration:(NSTimeInterval)liveAdDuration showName:(NSString * _Nullable)showName showGenre:(NSString * _Nullable)showGenre OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end



SWIFT_CLASS("_TtC17InnovidAdRenderer12SSAIAdParams")
@interface SSAIAdParams : InnovidAdParams
- (nonnull instancetype)initWithShowName:(NSString * _Nullable)showName showGenre:(NSString * _Nullable)showGenre OBJC_DESIGNATED_INITIALIZER;
@end


SWIFT_CLASS("_TtC17InnovidAdRenderer13TrueXAdParams")
@interface TrueXAdParams : NSObject
- (nonnull instancetype)initWithProduct:(enum ProductType)product showSkipCardImmediately:(BOOL)showSkipCardImmediately episodeThumbnailImageURI:(NSString * _Nullable)episodeThumbnailImageURI episodeName:(NSString * _Nullable)episodeName interactiveAdTimeRequiredSeconds:(NSInteger)interactiveAdTimeRequiredSeconds skipCardImageURI:(NSString * _Nullable)skipCardImageURI autoAdvanceTimerSeconds:(NSInteger)autoAdvanceTimerSeconds choiceCardBackgroundImageURI:(NSString * _Nullable)choiceCardBackgroundImageURI choiceCardBackgroundVideoURI:(NSString * _Nullable)choiceCardBackgroundVideoURI choiceCardVoiceoverURI:(NSString * _Null_unspecified)choiceCardVoiceoverURI choiceCardInteractButton:(ChoiceCardButton * _Nullable)choiceCardInteractButton choiceCardWatchButton:(ChoiceCardButton * _Nullable)choiceCardWatchButton choiceCardButtonDelayTimeInterval:(NSTimeInterval)choiceCardButtonDelayTimeInterval surveyConfigURI:(NSString * _Nullable)surveyConfigURI podIndex:(NSInteger)podIndex trueXURI:(NSString * _Nullable)trueXURI trueXParams:(NSString * _Nullable)trueXParams OBJC_DESIGNATED_INITIALIZER;
- (nonnull instancetype)init SWIFT_UNAVAILABLE;
+ (nonnull instancetype)new SWIFT_DEPRECATED_MSG("-init is unavailable");
@end











/// video events
/// progress events are called every second
typedef SWIFT_ENUM(NSInteger, VideoEvent, open) {
  VideoEventStart = 0,
/// video started
  VideoEventFirstQuartile = 1,
/// first quartile played
  VideoEventMidpoint = 2,
/// midpoint reached
  VideoEventThirdQuartile = 3,
/// third quartile played
  VideoEventComplete = 4,
/// video complete
  VideoEventProgress = 5,
};

#if __has_attribute(external_source_symbol)
# pragma clang attribute pop
#endif
#pragma clang diagnostic pop
#endif

#endif
