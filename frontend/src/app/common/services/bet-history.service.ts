import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bet } from '../data-types/bet';
import { AuthService } from './auth.service';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class BetHistoryService extends ParentService {
  betsEndpoint = '/bets/';

  constructor(httpClient: HttpClient, private authService: AuthService) {
    super(httpClient);
  }

  getAllBets(): Promise<any> {
    return this.get(this.betsEndpoint);
  }

  getBetDetails(betId: string): Promise<any> {
    return this.get(this.betsEndpoint + betId);
  }

  createBet(bet: Bet): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.create(this.betsEndpoint, bet, headers);
  }

  deleteBet(betId: string): Promise<any> {
    return this.delete(this.betsEndpoint + betId);
  }

  updateBet(bet: Bet, betId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.update(this.betsEndpoint + betId, bet, headers);
  }
}
