import { Injectable } from '@angular/core';
import { ParentService } from './parent.service';
import { Game } from '../data-types/game';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GameService extends ParentService{
  gamesEndpoint = '/games/';
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllGames(): Promise<any> {
    return this.get(this.gamesEndpoint);
  }

  createNewGame(gameName: String): Promise<any> {
    return this.create(this.gamesEndpoint, gameName);
  }

  updateGame(gameId: String, gameName: String): Promise<any> {
    return this.update(this.gamesEndpoint + gameId, gameName);
  }

  deleteGame(gameId: String): Promise<any> {
    return this.delete(this.gamesEndpoint + gameId);
  }
}
