export enum RouteEnum {
  // rush characters tracking
  RegisterRushCharacters = '/api/rush-characters/register',
  PlayersStatusUpdate = '/api/rush-characters/players-status-update',
  CloseRushCharacters = '/api/rush-characters/close-rush',
  OpenRushCharacters = '/api/rush-characters/open-rush',
  CleanUpRushCharacters = '/api/rush-characters/clean-up',
  GetRushCharacters = '/api/rush-characters/get-rush-characters',
  GetRushCharactersEvents = '/api/rush-characters/get-rush-characters-events',
  GetRushNames = '/api/rush-characters/get-rush-names',

  // rush fraud tracking
  RegisterRushFraud = '/api/rush-fraud/register',
  CloseRushFraud = '/api/rush-fraud/close-rush',
  OpenRushFraud = '/api/rush-fraud/open-rush',
  CleanUpRushFraud = '/api/rush-fraud/clean-up',
  GetRushFraud = '/api/rush-fraud/get-rush-fraud',
  registerRushFraudEmail = '/api/rush-fraud/register-rush-fraud-email',
  registerRushFraudTrade = '/api/rush-fraud/register-rush-fraud-trade',

  // rush progression tracking
  RegisterRushProgression = '/api/rush-progression/register',
  CloseRushProgression = '/api/rush-progression/close-rush',
  OpenRushProgression = '/api/rush-progression/open-rush',
  CleanUpRushProgression = '/api/rush-progression/clean-up',
  GetRushProgression = '/api/rush-progression/get-rush-progression',
  registerRushProgressionEvents = '/api/rush-progression/register-rush-progression-events',
}
