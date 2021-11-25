export interface Bet {
  _id?: string;
  userId: string;
  username?: string;
  gameRoundId: string;
  gameName?: string;
  betDate?: Date;
  betAmount: number;
  betPayout?: number;
  betStake?: string;
}
