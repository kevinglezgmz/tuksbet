import { Component, OnInit } from '@angular/core';
import { BalanceService } from 'src/app/common/services/balance.service';

@Component({
  selector: 'app-wallet-component',
  templateUrl: './wallet-component.component.html',
  styleUrls: ['./wallet-component.component.scss'],
})
export class WalletComponentComponent implements OnInit {
  currentBalance: number = 0;

  constructor(private balanceService: BalanceService) {
    this.balanceService.userBalanceStatus().subscribe((balance) => {
      this.currentBalance = balance;
    });
  }

  ngOnInit(): void {}
}
