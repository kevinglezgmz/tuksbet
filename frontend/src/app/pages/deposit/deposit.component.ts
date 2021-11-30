import { Component, OnInit } from '@angular/core';
import { CriptoCoin } from 'src/app/common/data-types/cripto-coin';
import { AuthService } from 'src/app/common/services/auth.service';
import { BalanceService } from 'src/app/common/services/balance.service';
import { CriptoService } from 'src/app/common/services/cripto.service';
import { TransactionService } from 'src/app/common/services/transaction.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogContentComponent } from 'src/app/common/components/confirm-dialog-content/confirm-dialog-content.component';

declare var paypal: any;

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss'],
})
export class DepositComponent implements OnInit {
  userId: string = '';
  inputDepositPaypal: string = '';
  inputDepositCripto: string = '';
  transactionId: string = '';

  currentPage: string = 'deposit';

  criptoPrices: CriptoCoin[] = [];

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private balanceService: BalanceService,
    private criptoService: CriptoService,
    private dialog: MatDialog
  ) {
    this.criptoService
      .getCoinPrices('BTC,ETH,LTC,ADA')
      .then((coins: CriptoCoin[] | undefined) => {
        this.criptoPrices = coins || [];
      })
      .catch((err) => {
        this.criptoPrices = [];
      });
  }

  ngOnInit(): void {
    paypal
      .Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        createOrder: (data: any, actions: any) => {
          if (this.inputDepositPaypal === '' || Number(this.inputDepositPaypal) <= 0) {
            return;
          }

          // This function sets up the details of the transaction, including the amount and line item details.
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: Number(this.inputDepositPaypal),
                },
              },
            ],
          });
        },
        onClick: () => {
          // Runs when user clicks a pay button
          if (this.inputDepositPaypal === '' || Number(this.inputDepositPaypal) <= 0) {
            return;
          }
          // Call API to create transaction in db with status pending
          // Get user id
          const { userId } = this.authService.getUserDetails();
          this.userId = userId!;

          const newTransaction = {
            userId: this.userId,
            amount: Number(this.inputDepositPaypal),
            isDeposit: true,
          };
          this.transactionService.createTransaction(newTransaction).then((m) => {
            // Keep transaction id to use in onApprove
            this.transactionId = m._id;
          });
        },
        onApprove: () => {
          // Runs when transaction is approved in PayPal
          console.log('Transaction approved by PayPal');

          // Call API to update transaction onto "completed" status
          const updatedTransaction = {
            status: 'completed',
          };
          this.transactionService
            .updateTransaction(updatedTransaction, this.transactionId)
            .then((status) => this.balanceService.updateUserBalance())
            .catch((err) => console.log('An error ocurred while trying to complete the transaction'));
        },
        onCancel: () => {
          // Runs when transaction is cancelled (window closed)
          console.log('Transaction cancelled');

          const updatedTransaction = {
            status: 'cancelled',
          };
          this.transactionService.updateTransaction(updatedTransaction, this.transactionId);
        },
        onError: (err: any) => {
          console.log('Amount must be greater than zero');
        },
      })
      .render('#paypalButtons');
  }

  onBlurPaypal(event: FocusEvent) {
    const depositInputPaypal = event.target as HTMLInputElement;
    if (isNaN(Number(depositInputPaypal.value))) {
      this.inputDepositPaypal = '0.00';
    } else {
      this.inputDepositPaypal = Number(depositInputPaypal.value).toFixed(2);
    }
  }

  onBlurCripto(event: FocusEvent) {
    const depositInputCripto = event.target as HTMLInputElement;
    if (isNaN(Number(depositInputCripto.value))) {
      this.inputDepositCripto = '0.00';
    } else {
      this.inputDepositCripto = Number(depositInputCripto.value).toFixed(2);
    }
  }

  openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogContentComponent, {
      data: {
        title: 'Método no disponible.',
        body: 'El depósito con criptomonedas estará disponible pronto.',
        isDelete: false,
      },
      autoFocus: false,
    });
  }
}
