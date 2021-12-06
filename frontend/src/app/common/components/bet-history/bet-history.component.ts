import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { Bet } from '../../data-types/bet';
import { AuthService } from '../../services/auth.service';
import { BetHistoryService } from '../../services/bet-history.service';
import { ConfirmDialogContentComponent } from '../confirm-dialog-content/confirm-dialog-content.component';

@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.scss'],
})
export class BetHistoryComponent implements OnInit {
  bets: Bet[] = [];
  columnsToDisplay: string[] = [
    'GameName',
    'Username',
    'BetDate',
    'BetId',
    'BetAmount',
    'BetMultiplier',
    'BetPayout',
    'Actions',
  ];
  roles: string = '';
  currentPage = 0;
  recordsPerPage = 10;
  subscriptions: Subscription;

  constructor(private betService: BetHistoryService, private authService: AuthService, private dialog: MatDialog) {
    this.subscriptions = this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.roles = authService.getUserDetails().roles || '';
    });
  }

  ngOnInit(): void {
    this.betService.getAllBets('', 0, this.recordsPerPage).then((bets: Bet[]) => {
      this.bets = bets;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onPageChange(event: PageEvent) {
    this.recordsPerPage = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getPaginatedGameRounds(event.pageIndex, this.recordsPerPage);
  }

  getPaginatedGameRounds(currentPage: number, recordsPerPage: number) {
    this.betService.getAllBets('', currentPage, recordsPerPage).then((bets: Bet[]) => {
      this.bets = bets;
    });
  }

  deleteBet(betId: string): void {
    this.betService
      .deleteBet(betId)
      .then((msg) => {
        this.betService.getAllBets('', this.currentPage, this.recordsPerPage).then((bets: Bet[]) => {
          this.bets = bets;
        });
      })
      .catch((err) => {
        console.log('Hubo un problema en la eliminación de la apuesta');
      });
  }

  openDeleteConfirmDialog(betId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogContentComponent, {
      data: {
        title: '¿Borrar apuesta?',
        body: '¿Está seguro que desea eliminar la apuesta con id ' + betId + '? Esta acción no puede deshacerse.',
        isDelete: true,
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteBet(betId);
      }
    });
  }
}
