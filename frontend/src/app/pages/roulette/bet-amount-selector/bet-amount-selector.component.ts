import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-bet-amount-selector',
  templateUrl: './bet-amount-selector.component.html',
  styleUrls: ['./bet-amount-selector.component.scss'],
})
export class BetAmountSelectorComponent implements OnInit {
  internalBetAmount: number = 0;
  @Output() newBetAmount = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {}

  onBlur($event: FocusEvent) {
    if (isNaN(Number(this.internalBetAmount))) {
      this.internalBetAmount = 0;
    } else {
      this.internalBetAmount = Number(Number(this.internalBetAmount).toFixed(2));
    }
    this.newBetAmount.emit(this.internalBetAmount);
  }

  addAmount($event: MouseEvent, amount: number) {
    const result = (this.internalBetAmount + Number(amount.toFixed(2))).toFixed(2);
    this.internalBetAmount = Number(result);
    this.newBetAmount.emit(this.internalBetAmount);
  }

  setAmountToMax($event: MouseEvent) {
    this.internalBetAmount = 1000;
    this.newBetAmount.emit(this.internalBetAmount);
  }

  clearAmount($event: MouseEvent) {
    this.internalBetAmount = 0;
    this.newBetAmount.emit(this.internalBetAmount);
  }
}
