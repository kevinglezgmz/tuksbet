import { Component, Inject, Input, OnInit } from '@angular/core';
import { GameRound } from 'src/app/common/data-types/gameRounds';
import { GameRoundsService } from 'src/app/common/services/game-rounds.service';
import { PageEvent } from '@angular/material/paginator';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface AvailableGames {
  gameName: 'Roulette' | 'Crash' | 'Blackjack';
}

@Component({
  selector: 'app-game-history',
  templateUrl: './game-history.component.html',
  styleUrls: ['./game-history.component.scss'],
})
export class GameHistoryComponent implements OnInit {
  recordsPerPage: number = 10;

  gameRounds: GameRound[] = [];
  columnsToDisplay: string[] = ['GameRoundId', 'GameRoundResult', 'GameRoundDate', 'GameRoundAcceptingBets'];

  constructor(private gameRoundsService: GameRoundsService, @Inject(MAT_DIALOG_DATA) public data: AvailableGames) {}

  ngOnInit(): void {
    this.getPaginatedGameRounds(0, this.recordsPerPage);
  }

  onPageChange(event: PageEvent) {
    this.recordsPerPage = event.pageSize;
    this.getPaginatedGameRounds(event.pageIndex, this.recordsPerPage);
  }

  getPaginatedGameRounds(currentPage: number, recordsPerPage: number) {
    this.gameRoundsService
      .getAllGameRounds(this.data.gameName, currentPage, recordsPerPage)
      .then((gameRounds: GameRound[]) => {
        this.gameRounds = gameRounds;
      });
  }
}
