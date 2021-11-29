import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Transaction } from 'src/app/common/data-types/transaction';
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

  columnsToDisplay: string[] = [
    'TransactionId',
    'Username',
    'TransactionDate',
    'TransactionAmount',
    'IsDeposit',
    'TransactionStatus',
  ];
  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.getPaginatedTransactions(0, this.recordsPerPage);
  }

  onPageChange(event: PageEvent) {
    this.recordsPerPage = event.pageSize;
    this.getPaginatedTransactions(event.pageIndex, this.recordsPerPage);
  }

  getPaginatedTransactions(currentPagination: number, recordsPerPage: number) {
    this.transactionService.getAllTransactions(currentPagination, recordsPerPage).then((transactions: Transaction[]) => {
      this.transactions = transactions;
    });
  }
}
