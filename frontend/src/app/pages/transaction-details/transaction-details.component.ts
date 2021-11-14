import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Transaction } from 'src/app/common/data-types/transaction';
import { TransactionService } from 'src/app/common/services/transaction.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  transactionId: string = '';
  transaction: Transaction | undefined = undefined;

  constructor(private activatedRoute: ActivatedRoute, private transactionService: TransactionService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.transactionId = params.transactionId;
      this.transactionService.getTransactionDetails(this.transactionId).then((transaction: Transaction) => {
        this.transaction = transaction;
      }).catch((err) => {
        
      })
    })
  }

}
