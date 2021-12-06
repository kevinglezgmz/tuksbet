import { Component, Inject, Input, OnInit } from '@angular/core';
import { GameRound } from 'src/app/common/data-types/gameRounds';
import { GameRoundsService } from 'src/app/common/services/game-rounds.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmDialogContentComponent } from '../confirm-dialog-content/confirm-dialog-content.component';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

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
  currentPage: number = 0;
  roles: string = '';

  gameRounds: GameRound[] = [];
  columnsToDisplay: string[] = ['GameRoundId', 'GameRoundResult', 'GameRoundDate', 'GameRoundAcceptingBets', 'Actions'];

  subscriptions: Subscription;
  constructor(
    private gameRoundsService: GameRoundsService,
    @Inject(MAT_DIALOG_DATA) public data: AvailableGames,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.subscriptions = this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.roles = authService.getUserDetails().roles || '';
    });
  }

  ngOnInit(): void {
    this.getPaginatedGameRounds(0, this.recordsPerPage);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPageChange(event: PageEvent) {
    this.recordsPerPage = event.pageSize;
    this.getPaginatedGameRounds(event.pageIndex, this.recordsPerPage);
  }

  getPaginatedGameRounds(currentPage: number, recordsPerPage: number) {
    this.currentPage = currentPage;
    this.gameRoundsService
      .getAllGameRounds(this.data.gameName, currentPage, recordsPerPage)
      .then((gameRounds: GameRound[]) => {
        this.gameRounds = gameRounds;
      });
  }

  deleteGameRound(gameRoundId: string): void {
    this.gameRoundsService
      .deleteGameRound(gameRoundId)
      .then((msg) => {
        this.gameRoundsService
          .getAllGameRounds(this.data.gameName, this.currentPage, this.recordsPerPage)
          .then((gameRounds: GameRound[]) => {
            this.gameRounds = gameRounds;
          });
      })
      .catch((err) => {
        console.log('Hubo un problema en la eliminación de la apuesta');
      });
  }

  openDeleteConfirmDialog(gameRoundId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogContentComponent, {
      data: {
        title: '¿Borrar ronda?',
        body: '¿Está seguro que desea eliminar la ronda con id ' + gameRoundId + '? Esta acción no puede deshacerse.',
        isDelete: true,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteGameRound(gameRoundId);
      }
    });
  }
}
