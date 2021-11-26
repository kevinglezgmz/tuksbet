export interface GameRound {
  _id?: string;
  gameId?: string;
  gameName?: string;
  result?: string;
  roundDate?: Date;
  acceptingBets?: boolean;
  totalCount?: number;
}
