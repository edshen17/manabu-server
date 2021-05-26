declare namespace Express {
  interface Request {
    userId: string;
    role: string;
    isVerified: boolean;
  }
}
