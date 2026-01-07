Feature: Rush Characters synchronization

  @real-infrastructure
  Scenario: Rush Characters are persisted in database after synchronization
    Given a rush characters "KTV x JL" tracking
    And a default rooster for rush "KTV x JL"
    When I synchronize the rush "KTV x JL" characters status
    Then the rush "KTV x JL" characters projection should be saved in the database
    And all player of rush "KTV x JL" should match the synchronized data

  @real-infrastructure
  Scenario: Close rush characters
    Given a rush characters "KTV x JL" tracking
    And a default rooster for rush "KTV x JL"
    When I close the rush "KTV x JL" characters
    Then the rush "KTV x JL" characters should be closed

  @real-infrastructure
  Scenario: Clean up rush characters
    Given a rush characters "KTV x JL" tracking
    And a default rooster for rush "KTV x JL"
    When I clean up the rush "KTV x JL" characters
    Then the rush "KTV x JL" characters should be cleaned up

  @real-infrastructure
  Scenario: Error - attempt to register a rush that already exists
    Given a rush characters "KTV x JL" tracking
    When I try to register the rush "KTV x JL" characters again
    Then an error should be thrown

  @real-infrastructure
  Scenario: Error - attempt to synchronize a rush that does not exist
    When I try to synchronize a rush that does not exist
    Then an error should be thrown


