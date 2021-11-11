import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/common/data-types/game';
import { GameService } from 'src/app/common/services/game.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  games: Game[] = [];
  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.getAllGames().then((games: Game[]) => {
      console.log(games);
      this.games = games;
    })
  }

}
