import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GameRound } from '../data-types/gameRounds';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class GameRoundsService extends ParentService {
  gameRoundsEndpoint = '/gameRounds/';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllGameRounds(): Promise<any> {
    return this.get(this.gameRoundsEndpoint);
  }

  getGameRoundDetails(gameRoundId: string): Promise<any> {
    return this.get(this.gameRoundsEndpoint + gameRoundId);
  }

  createGameRound(gameRound: GameRound): Promise<any> {
    return this.create(this.gameRoundsEndpoint, gameRound);
  }

  deleteGameRound(gameRoundId: string): Promise<any> {
    return this.delete(this.gameRoundsEndpoint + gameRoundId);
  }

  updateGameRound(gameRound: GameRound, gameRoundId: string): Promise<any> {
    return this.update(this.gameRoundsEndpoint + gameRoundId, gameRound);
  }
}
