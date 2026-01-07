Feature: Progression global application behavior

  @real-infrastructure
  Scenario: Snapshots are created
    Given a snapshot strategy of every "3" events
    And a rush characters "KTV x JL" tracking
    And a default rooster for rush "KTV x JL"
    When I synchronize the rush "KTV x JL" characters status
    And character "Legolas" died in rush "KTV x JL"
    Then a snapshot should be created for rush "KTV x JL"

  @real-infrastructure
  Scenario: Events are stored in audit log
    Given a rush characters "KTV x JL" tracking
    And a default rooster for rush "KTV x JL"
    When I synchronize the rush "KTV x JL" characters status
    Then the rush "KTV x JL" events should be stored in the audit log

  @real-infrastructure
  Scenario: Concurrency — two synchronizations executed at the same time
    Given a rush characters "KTV x JL" tracking
    And a default rooster for rush "KTV x JL"
    When two synchronization processes in rush "KTV x JL" are started simultaneously
    Then exactly one should succeed

  @real-infrastructure
  Scenario: Event - Non critical base domain events handler should not throw
    Given a rush characters "KTV x JL" tracking
    And a default rooster for rush "KTV x JL"
    And a throwing non critical domain event handler
    When I synchronize the rush "KTV x JL" characters status
    Then no error should be thrown

  @real-infrastructure
  Scenario: Event - No changes on character status updated
    Given a rush characters "KTV x JL" tracking
    And a default rooster for rush "KTV x JL"
    When I synchronize the rush "KTV x JL" characters status
    And I clear domain events cache
    And I synchronize the rush "KTV x JL" characters status
    Then No new events should be emitted