import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/common/data-types/game';
import { GameService } from 'src/app/common/services/game.service';

@Component({
  selector: 'app-game-showcase',
  templateUrl: './game-showcase.component.html',
  styleUrls: ['./game-showcase.component.scss']
})
export class GameShowcaseComponent implements OnInit {
  games: Game[] = [];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getAllGames().then((games: Game[]) => {
      this.games = games;
    });
    
  }

}
