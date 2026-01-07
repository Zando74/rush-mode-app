Feature: Rush progression synchronization

  @real-infrastructure
  Scenario: Rush progression are persisted in database after synchronization
    Given a rush progression "KTV x JL" tracking
    And a default progression set for rush "KTV x JL"
    When I synchronize the rush "KTV x JL" progression
    Then the rush "KTV x JL" progression should be saved in the database

  @real-infrastructure
  Scenario: Close rush progression
    Given a rush progression "KTV x JL" tracking
    When I close the rush "KTV x JL" progression
    Then the rush "KTV x JL" progression should be closed

  @real-infrastructure
  Scenario: Clean up rush progression
    Given a rush progression "KTV x JL" tracking
    When I clean up the rush "KTV x JL" progression
    Then the rush "KTV x JL" progression should be cleaned up

  @real-infrastructure
  Scenario: Error - attempt to register a rush progression that already exists
    Given a rush progression "KTV x JL" tracking
    When I try to register the rush "KTV x JL" progression again
    Then an error should be thrown

  @real-infrastructure
  Scenario: Error - attempt to synchronize a rush progression that does not exist
    When I try to synchronize a rush progression that does not exist
    Then an error should be thrown