import { Component, OnInit } from '@angular/core';
import { Bet } from '../../data-types/bet';
import { BetHistoryService } from '../../services/bet-history.service';

@Component({
  selector: 'app-bet-history',
  templateUrl: './bet-history.component.html',
  styleUrls: ['./bet-history.component.scss'],
})
export class BetHistoryComponent implements OnInit {
  bets: Bet[] = [];

  constructor(private betHistory: BetHistoryService) {}

  ngOnInit(): void {
    this.betHistory.getAllBets().then((bets: Bet[]) => {
      this.bets = bets.slice(-10).reverse();
    });
  }
}
