export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  port: process.env.PORT || 3000,
  defaultLimit: process.env.DEFAULT_LIMIT || 5,
});