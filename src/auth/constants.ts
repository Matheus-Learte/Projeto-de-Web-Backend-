export const jwtConstants = {
  secret: process.env.JWT_SECRET ?? 'Super-secret-key',
  refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'Super-refresh-secret-key',
};
