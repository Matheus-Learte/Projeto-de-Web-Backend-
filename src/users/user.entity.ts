// Mantido por compatibilidade. O modelo real está em prisma/schema.prisma
export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  refreshToken: string | null;
  role: string;
}
