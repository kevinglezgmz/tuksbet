export interface User {
  userId: string;
  username: string;
  email: string;
  roles?: string;
  password?: string;
  balance?: number;
}
