import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { TransactionService } from 'src/app/common/services/transaction.service';

declare var paypal: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent implements OnInit {
  userId: string = '';
  // Default deposit of 1 USD
  inputDepositString: string = '1.00';
  inputDeposit: number = +this.inputDepositString;
  transactionId: string = '';

  constructor(private TransactionService: TransactionService, private authService: AuthService) {}

  ngOnInit(): void {
    paypal
      .Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        createOrder: (data: any, actions: any) => {
          // This function sets up the details of the transaction, including the amount and line item details.
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.inputDeposit,
                },
              },
            ],
          });
        },
        onClick: () => {
          // Runs when user clicks a pay button

          // Call API to create transaction in db with status pending
          // Get user id
          const { userId } = this.authService.getUserDetails();
          this.userId = userId!;

          let NewTransaction = {
            userId: this.userId,
            amount: this.inputDeposit,
            isDeposit: true,
          };
          this.TransactionService.createTransaction(NewTransaction).then((m) => {
            // Keep transaction id to use in onApprove
            this.transactionId = m._id;
          });
        },
        onApprove: () => {
          // Runs when transaction is approved in PayPal
          console.log('Transaction approved by PayPal');

          // Call API to update transaction onto "completed" status
          let UpdatedTransaction = {
            status: 'completed',
          };
          this.TransactionService.updateTransaction(UpdatedTransaction, this.transactionId);
        },
        onCancel: () => {
          // Runs when transaction is cancelled (window closed)
          console.log('Transaction cancelled');

          let UpdatedTransaction = {
            status: 'cancelled',
          };
          this.TransactionService.updateTransaction(UpdatedTransaction, this.transactionId);
        },
      })
      .render('#paypalButtons');

    // paypal.Buttons({}).render('#paypalButtons');
  }
}
