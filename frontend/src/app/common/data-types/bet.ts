export interface Bet {
  betId?: string;
  userId: string;
  username: string;
  gameRoundId: string;
  gameName: string;
  betDate?: Date;
  betAmount: number;
  betPayout?: number;
  betStake: string;
}
