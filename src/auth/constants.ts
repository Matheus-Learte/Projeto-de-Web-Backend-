import 'dotenv/config';

if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error('JWT_SECRET e JWT_REFRESH_SECRET devem estar definidos no .env');
}

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  refreshSecret: process.env.JWT_REFRESH_SECRET,
};
