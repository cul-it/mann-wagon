require 'locomotive/wagon'
require 'locomotive/steam'
require 'locomotive/steam/server'
require 'capybara/cucumber'
require 'capybara/poltergeist'

# Run wagon in background process
Before do
  @@pid = Process.spawn("bundle exec wagon serve")
  Process.detach @@pid
  sleep(3)
end
Capybara.default_driver = :poltergeist
Capybara.run_server = false
Capybara.app_host = "http://localhost:3333"

# Stop server after test
  After do
    Process.kill("INT", @@pid)
  end
