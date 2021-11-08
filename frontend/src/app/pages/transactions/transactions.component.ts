import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/common/data-types/transaction';
import { TransactionService } from 'src/app/common/services/transaction.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.transactionService.getAllTransactions().then((transactions: Transaction[]) => {
      this.transactions = transactions.reverse();
    });
  }
}
