Given(/^I am on a subpage "(.*?)"$/) do |path|
  visit(path)
end

Given(/^I see "(.*?)"$/) do |link|
    within(".breadcrumbs") do
      expect(page).to have_selector(:link, link)
    end
end

When(/^I click on a "(.*?)" to navigate$/) do |link|
  within(".breadcrumbs") do
    click_link(link)
  end
end

Then(/^I should see the page heading "(.*?)"$/) do |heading|
  within(".page-title") do
    expect(page).to have_content(heading)
  end
end
