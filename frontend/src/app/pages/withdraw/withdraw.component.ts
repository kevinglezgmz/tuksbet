import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/common/services/auth.service';
import { BalanceService } from 'src/app/common/services/balance.service';
import { TransactionService } from 'src/app/common/services/transaction.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss'],
})
export class WithdrawComponent implements OnInit {
  currentPage: string = 'withdraw';

  userId: string = '';
  inputWithdrawCripto: string = '';
  inputWithdrawAddress: string = '';
  transactionId: string = '';

  constructor(
    private snackbar: MatSnackBar,
    private authService: AuthService,
    private transactionService: TransactionService,
    private balanceService: BalanceService
  ) {}

  ngOnInit(): void {}

  onBlurCripto(event: FocusEvent) {
    const depositInputCripto = event.target as HTMLInputElement;
    if (isNaN(Number(depositInputCripto.value))) {
      this.inputWithdrawCripto = '0.00';
    } else {
      this.inputWithdrawCripto = Number(depositInputCripto.value).toFixed(2);
    }
  }

  withdraw() {
    if (
      !isNaN(Number(this.inputWithdrawCripto)) &&
      Number(this.inputWithdrawCripto) > 0 &&
      Number(this.inputWithdrawCripto) <= this.balanceService.currentBalance.value
    ) {
      const { userId } = this.authService.getUserDetails();
      this.userId = userId || '';

      const newTransaction = {
        userId: this.userId,
        amount: Number(this.inputWithdrawCripto),
        isDeposit: false,
      };
      this.transactionService
        .createTransaction(newTransaction)
        .then((transactionStatus) => {
          transactionStatus._id;
          this.transactionService
            .updateTransaction(
              {
                status: 'completed',
              },
              transactionStatus._id
            )
            .then((statusUpdate) => {
              this.balanceService.updateUserBalance();
            })
            .catch((err) => {
              console.log('Error updating transaction');
            });
        })
        .catch((err) => {
          console.log('Error creating transaction');
        });
      this.snackbar.open('Fondos retirados!', 'Aceptar', {
        duration: 3000,
      });
    } else {
      this.snackbar.open('Ingresa un monto válido', 'Aceptar', {
        duration: 3000,
      });
    }
  }
}
