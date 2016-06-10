source 'https://rubygems.org'

# Temporarily using GitHub repos to accommodate LabStats API
# https://github.com/locomotivecms/steam/pull/67
gem 'locomotivecms_steam', :github => 'cappadona/steam', :branch => 'consume-headers'
gem 'locomotivecms_wagon', :github => 'locomotivecms/wagon'
# gem 'locomotivecms_wagon', '2.1.0'
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
  gem 'mann_liquid_extensions', :git => 'git@github.com:cul-it/mann_liquid_extensions', :ref => '5ecae21'
end
