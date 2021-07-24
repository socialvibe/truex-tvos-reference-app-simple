Pod::Spec.new do |s|
  s.name             = "InnovidAdRenderer_xcodeXCODE_VERSION"
  s.version          = '1.5.34'
  s.summary          = 'Innovid Ad Renderer TvOS xcframework'
  s.module_name      = "InnovidAdRenderer"
  s.swift_version    = '4.2'

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage      = 'https://github.com/Innovid/tvos-framework-docs'
  s.license       = 'Copyright © 2020 Innovid. All rights reserved.'
  s.authors       = { 'jake' => 'lavenj@gmail.com', 'Victor Sima' => 'vic.sima@gmail.com'}

  s.tvos.deployment_target = '13.0'
  
  s.frameworks = 'UIKit', 'AVKit'
  
  s.source = {
    :http => "https://s-video.innovid.com/common/tvos/releases/InnovidAdRenderer.xcframework-#{s.version}-xcodeXCODE_VERSION.zip?cachebuster=#{Time.now.to_i}"
  }

  s.vendored_frameworks = 'InnovidAdRenderer.xcframework'
  
end
