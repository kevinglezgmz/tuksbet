import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Bet } from '../data-types/bet';
import { AuthService } from './auth.service';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class BetHistoryService extends ParentService {
  betsEndpoint = '/bets';

  constructor(httpClient: HttpClient, private authService: AuthService) {
    super(httpClient);
  }

  getAllBets(gameRoundId: string, page: number, limit: number): Promise<any> {
    return this.get(this.betsEndpoint + '?gameRoundId=' + gameRoundId + '&page=' + page + '&limit=' + limit);
  }

  getBetDetails(betId: string): Promise<any> {
    return this.get(this.betsEndpoint + '/' + betId);
  }

  createBet(bet: Bet): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.create(this.betsEndpoint, bet, headers);
  }

  deleteBet(betId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.delete(this.betsEndpoint + '/' + betId, headers);
  }

  updateBet(bet: Bet, betId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.update(this.betsEndpoint + '/' + betId, bet, headers);
  }
}
