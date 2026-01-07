# 🎮 **Rush Mode App**

Welcome to the **Rush Mode App**, a CQRS (Command Query Responsibility Segregation) and Event Sourcing application designed to track player events during a rush in **World of Warcraft Classic Hardcore**. This application ensures a high level of auditability to detect any player misconduct or cheating effectively.

## 🎯 **Purpose**

The primary goal of the **Rush Mode App** is to capture and monitor each in-game event involving players using data collected from a dedicated addon **Rush Mode**. By analyzing these events, the application helps maintain integrity by comparing player states, identifying inconsistencies, and triggering necessary actions.

## 🚀 **Key Features**

- **Event Tracking**: Every player action is monitored through distinct events, allowing comprehensive audits.
- **Player State Comparison**: Accurately compares player statuses to ensure fair play and identify cheating.
- **Seamless Integration**: Gathers data from the dedicated [**Rush_Mode**](https://github.com/Zando74/Rush_Mode) addon and streamlines it into the infrastructure.

## 📊 **Tracked Events**

The application identifies and processes the following events for players:

### Character Events:

- **CharacterDeadEvent**: Triggered when a character dies.
- **CharacterEarnGoldsEvent**: Recorded when a character earns gold.
- **CharacterEquippedItemEvent**: Occurs when a character equips an item.
- **CharacterForgotProfessionEvent**: Logged when a character forgets a profession.
- **CharacterJoinedTheRushEvent**: Triggered when a character joins the rush.
- **CharacterLearnedProfessionEvent**: Occurs when a character learns a new profession.
- **CharacterLeveledUpEvent**: Recorded when a character levels up.
- **CharacterLostGoldsEvent**: Triggered when a character loses gold.
- **CharacterPlayerNameChangedEvent**: Noted when a character's player name changes.
- **CharacterProfessionLeveledUpEvent**: Occurs when a character's profession levels up.
- **CharacterRemovedItemEvent**: Logged when a character removes an item.
- **CharacterRenamedEvent**: Triggered when a character is renamed.
- **CharacterStatusUpdatedEvent**: Occurs when a character's status updates.
- **CharacterTeamChangedEvent**: Recorded when a character changes teams.

### Fraud Detection Events:

- **RushFraudMailRegisteredEvent**: Triggered when a fraud mail is registered.
- **RushFraudTradeRegisteredEvent**: Occurs when a fraud trade is registered.

### Progression Events:

- **RushProgressionRegisteredEvent**: Triggered when a progression is registered.

## **Usage & Contact**

The code for Rush Mode is public for reference, but the system is not free to use. If you want to organize your own event or set up this system, please contact me directly to discuss implementation and licensing.

- **Twitter**: [@zandodev](https://twitter.com/zandodev)
- **Buy Me a Coffee**: [Support Me](https://www.buymeacoffee.com/zandodev)

This ensures proper setup and support, and helps maintain fair play for all events using the system.
