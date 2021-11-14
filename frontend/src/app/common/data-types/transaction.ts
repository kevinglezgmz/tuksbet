export interface Transaction {
  _id?: string;
  userId?: string;
  username?: string;
  amount?: number;
  isDeposit?: boolean;
  status?: string;
  transactionDate?: Date;
}
