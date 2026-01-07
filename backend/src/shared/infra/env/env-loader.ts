export const CheckEnvVariables = () => {
  if (!process.env.WRITE_DB_HOST) {
    throw new Error('WRITE_DB_HOST is not set');
  }
  if (!process.env.WRITE_DB_PORT) {
    throw new Error('WRITE_DB_PORT is not set');
  }
  if (!process.env.WRITE_DB_USERNAME) {
    throw new Error('WRITE_DB_USERNAME is not set');
  }
  if (!process.env.WRITE_DB_PASSWORD) {
    throw new Error('WRITE_DB_PASSWORD is not set');
  }
  if (!process.env.WRITE_DB_DATABASE) {
    throw new Error('WRITE_DB_DATABASE is not set');
  }
  if (!process.env.READ_DB_HOST) {
    throw new Error('READ_DB_HOST is not set');
  }
  if (!process.env.READ_DB_PORT) {
    throw new Error('READ_DB_PORT is not set');
  }
  if (!process.env.READ_DB_USERNAME) {
    throw new Error('READ_DB_USERNAME is not set');
  }
  if (!process.env.READ_DB_PASSWORD) {
    throw new Error('READ_DB_PASSWORD is not set');
  }
  if (!process.env.READ_DB_DATABASE) {
    throw new Error('READ_DB_DATABASE is not set');
  }
  if (!process.env.RABBITMQ_URL) {
    throw new Error('RABBITMQ_URL is not set');
  }
  if (!process.env.SNAPSHOT_FREQUENCY) {
    throw new Error('SNAPSHOT_FREQUENCY is not set');
  }
  if (!process.env.INTEGRATION_EVENT_BUS_INTERVAL) {
    throw new Error('INTEGRATION_EVENT_BUS_INTERVAL is not set');
  }
  if (!process.env.PROCESSED_EVENT_DELETION_INTERVAL) {
    throw new Error('PROCESSED_EVENT_DELETION_INTERVAL is not set');
  }
  if (!process.env.RUSH_MODE_SERVICE_PORT) {
    throw new Error('RUSH_MODE_SERVICE_PORT is not set');
  }
  if (!process.env.ADMIN_API_KEY) {
    throw new Error('ADMIN_API_KEY is not set');
  }
  if (!process.env.CLIENT_API_KEY) {
    throw new Error('CLIENT_API_KEY is not set');
  }
  if (process.env.ENABLE_DEMO === undefined) {
    throw new Error('ENABLE_DEMO is not set');
  }
};
