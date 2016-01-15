Feature: Breadcrumbs
  In order to navigate using the breadcrumbs
  I want to be able to click on the breadcrumbs and navigate to parent page

  Scenario: Navigation using Breadcrumbs
    Given I am on a subpage "/use/computing"
    And I see "Use the Library"
    When I click on a "Use the Library" to navigate
    Then I should see the page heading "Use the Library"
