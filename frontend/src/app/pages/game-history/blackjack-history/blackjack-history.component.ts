import { Component, OnInit } from '@angular/core';
import { GameRound } from 'src/app/common/data-types/gameRounds';
import { GameRoundsService } from 'src/app/common/services/game-rounds.service';

@Component({
  selector: 'app-blackjack-history',
  templateUrl: './blackjack-history.component.html',
  styleUrls: ['./blackjack-history.component.scss'],
})
export class BlackjackHistoryComponent implements OnInit {
  gamerounds: GameRound[] = [];
  constructor(private gameRoundService: GameRoundsService) {}

  ngOnInit(): void {
    this.gameRoundService.getAllGameRounds().then((gamerounds: GameRound[]) => {
      this.gamerounds = gamerounds.filter((gameround) => gameround.gameName === 'Blackjack').reverse();
    });
  }
}
