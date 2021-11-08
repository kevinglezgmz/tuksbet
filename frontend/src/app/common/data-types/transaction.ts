export interface Transaction {
  userId?: string;
  username?: string;
  amount?: number;
  isDeposit?: boolean;
  status?: string;
  transactionDate?: Date;
}
