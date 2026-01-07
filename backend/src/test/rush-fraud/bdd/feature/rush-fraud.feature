Feature: Rush Fraud synchronization

  @real-infrastructure
  Scenario: Rush Fraud are persisted in database after synchronization
    Given a rush fraud "KTV x JL" tracking
    And a default fraud set for rush "KTV x JL"
    When I synchronize the rush "KTV x JL" fraud
    Then the rush "KTV x JL" fraud should be saved in the database

  @real-infrastructure
  Scenario: Close rush fraud
    Given a rush fraud "KTV x JL" tracking
    When I close the rush "KTV x JL" fraud
    Then the rush "KTV x JL" fraud should be closed

  @real-infrastructure
  Scenario: Clean up rush fraud
    Given a rush fraud "KTV x JL" tracking
    When I clean up the rush "KTV x JL" fraud
    Then the rush "KTV x JL" fraud should be cleaned up

  @real-infrastructure
  Scenario: Error - attempt to register a rush fraud that already exists
    Given a rush fraud "KTV x JL" tracking
    When I try to register the rush "KTV x JL" fraud again
    Then an error should be thrown

  @real-infrastructure
  Scenario: Error - attempt to synchronize a rush fraud that does not exist
    When I try to synchronize a rush fraud that does not exist
    Then an error should be thrown