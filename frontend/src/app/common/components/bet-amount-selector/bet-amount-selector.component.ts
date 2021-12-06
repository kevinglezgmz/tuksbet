import { Component, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { BalanceService } from '../../services/balance.service';

@Component({
  selector: 'app-bet-amount-selector',
  templateUrl: './bet-amount-selector.component.html',
  styleUrls: ['./bet-amount-selector.component.scss'],
})
export class BetAmountSelectorComponent implements OnInit {
  internalBetAmount: string = '';

  @Output() newBetAmount = new EventEmitter<number>();

  constructor(private balanceService: BalanceService) {}

  ngOnInit(): void {}

  onBlur($event: FocusEvent) {
    if (isNaN(Number(this.internalBetAmount))) {
      this.internalBetAmount = '0.00';
    } else {
      this.internalBetAmount = Number(this.internalBetAmount).toFixed(2);
    }
    this.newBetAmount.emit(Number(this.internalBetAmount));
  }

  addAmount($event: MouseEvent, amount: number) {
    this.internalBetAmount = (Number(this.internalBetAmount) + Number(amount.toFixed(2))).toFixed(2);
    this.newBetAmount.emit(Number(this.internalBetAmount));
  }

  halfAmount($event: MouseEvent) {
    const currentValue = Number(this.internalBetAmount);
    if (isNaN(currentValue)) {
      return;
    }
    this.internalBetAmount = (currentValue / 2).toFixed(2);
    this.newBetAmount.emit(Number(this.internalBetAmount));
  }

  doubleAmount($event: MouseEvent) {
    const currentValue = Number(this.internalBetAmount);
    if (isNaN(currentValue)) {
      return;
    }
    this.internalBetAmount = (currentValue * 2).toFixed(2);
    this.newBetAmount.emit(Number(this.internalBetAmount));
  }

  setAmountToMax($event: MouseEvent) {
    this.internalBetAmount = this.balanceService.currentBalance.getValue().toFixed(2);
    this.newBetAmount.emit(Number(this.internalBetAmount));
  }

  clearAmount($event: MouseEvent) {
    this.internalBetAmount = '0.00';
    this.newBetAmount.emit(Number(this.internalBetAmount));
  }
}
