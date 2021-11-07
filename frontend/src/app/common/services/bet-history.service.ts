import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bet } from '../data-types/bet';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class BetHistoryService extends ParentService {
  betsEndpoint = '/bets/';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllBets(): Promise<any> {
    return this.get(this.betsEndpoint);
  }

  getBetDetails(betId: string): Promise<any> {
    return this.get(this.betsEndpoint + betId);
  }

  createBet(bet: Bet): Promise<any> {
    return this.create(this.betsEndpoint, bet);
  }

  deleteBet(betId: string): Promise<any> {
    return this.delete(this.betsEndpoint + betId);
  }

  updateBet(bet: Bet, betId: string): Promise<any> {
    return this.update(this.betsEndpoint + betId, bet);
  }
}
