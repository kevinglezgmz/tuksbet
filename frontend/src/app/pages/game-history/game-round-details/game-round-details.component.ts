import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameRound } from 'src/app/common/data-types/gameRounds';
import { GameRoundsService } from 'src/app/common/services/game-rounds.service';
import { Bet } from 'src/app/common/data-types/bet';
import { BetHistoryService } from 'src/app/common/services/bet-history.service';

@Component({
  selector: 'app-game-round-details',
  templateUrl: './game-round-details.component.html',
  styleUrls: ['./game-round-details.component.scss'],
})
export class GameRoundDetailsComponent implements OnInit {
  gameRoundId: string = '';
  gameRound: GameRound | undefined = undefined;
  bets: Bet[] = [];
  constructor(
    private activatedRoute: ActivatedRoute,
    private gameRoundService: GameRoundsService,
    private betHistory: BetHistoryService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.gameRoundId = params.gameRoundId;
      this.gameRoundService.getGameRoundDetails(this.gameRoundId).then((gameRound: GameRound) => {
        console.log(gameRound);
        this.gameRound = gameRound;
      });
      this.betHistory.getAllBets().then((bets: Bet[]) => {
        this.bets = bets.filter((bet) => bet.gameRoundId === this.gameRoundId).reverse();
      });
    });
  }
}
