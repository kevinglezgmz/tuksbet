import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { ConfirmDialogContentComponent } from 'src/app/common/components/confirm-dialog-content/confirm-dialog-content.component';
import { Transaction } from 'src/app/common/data-types/transaction';
import { AuthService } from 'src/app/common/services/auth.service';
import { TransactionService } from 'src/app/common/services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  currentPage: string = 'transactions';

  transactions: Transaction[] = [];
  recordsPerPage: number = 10;
  currentPagePagination: number = 0;
  subscriptions: Subscription;

  roles: string = '';

  columnsToDisplay: string[] = [
    'TransactionId',
    'Username',
    'TransactionDate',
    'TransactionAmount',
    'IsDeposit',
    'TransactionStatus',
    'Actions',
  ];
  constructor(private transactionService: TransactionService, private authService: AuthService, private dialog: MatDialog) {
    this.subscriptions = this.authService.isLoggedIn().subscribe((isLoggedIn) => {
      this.roles = authService.getUserDetails().roles || '';
    });
  }

  ngOnInit(): void {
    this.getPaginatedTransactions(0, this.recordsPerPage);
  }

  onPageChange(event: PageEvent) {
    this.recordsPerPage = event.pageSize;
    this.currentPagePagination = event.pageIndex;
    this.getPaginatedTransactions(event.pageIndex, this.recordsPerPage);
  }

  getPaginatedTransactions(currentPagination: number, recordsPerPage: number) {
    this.transactionService.getAllTransactions(currentPagination, recordsPerPage).then((transactions: Transaction[]) => {
      this.transactions = transactions;
    });
  }

  deleteBet(transactionId: string): void {
    this.transactionService
      .deleteTransaction(transactionId)
      .then((msg) => {
        this.transactionService
          .getAllTransactions(this.currentPagePagination, this.recordsPerPage)
          .then((transactions: Transaction[]) => {
            this.transactions = transactions;
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
