source 'https://rubygems.org'

gem 'locomotivecms_wagon', '~> 2.4.0.rc2'
gem 'celluloid', '0.16.0'

# Local development
# gem 'locomotivecms_steam', path: '/usr/local/src/locomotivecms_steam'
# gem 'locomotivecms_wagon', path: '/usr/local/src/locomotivecms_wagon'

group :development do
  # Mac OS X
  # gem 'rb-fsevent', '~> 0.9.1', require: RUBY_PLATFORM.include?('darwin') && 'rb-fsevent'

  # Unix
  # gem 'therubyracer', require: 'v8', platforms: :ruby unless RUBY_PLATFORM.include?('darwin')
  # gem 'rb-inotify', '~> 0.9', require: RUBY_PLATFORM.include?('linux') && 'rb-inotify'

  # Windows
  # gem 'wdm', '>= 0.1.0', require: RUBY_PLATFORM =~ /mswin|mingw/i && 'wdm'
end

group :misc do
  # Add your extra gems here
  # gem 'susy', require: 'susy'
  # gem 'redcarpet', require: 'redcarpet'
  gem 'mann_liquid_extensions', :git => 'git@github.com:cul-it/mann_liquid_extensions', :tag => 'v1.3.0'
end

# Temp override of locomotivecms engine/steam dependency to address vulnerabilities
gem 'sprockets', '~> 3.7.2'
