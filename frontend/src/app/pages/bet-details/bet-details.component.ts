import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BetHistoryService } from 'src/app/common/services/bet-history.service';
import { Bet } from 'src/app/common/data-types/bet';

@Component({
  selector: 'app-bet-details',
  templateUrl: './bet-details.component.html',
  styleUrls: ['./bet-details.component.scss']
})
export class BetDetailsComponent implements OnInit {
  betId: string = '';
  bet: Bet | undefined = undefined;

  constructor(private activatedRoute: ActivatedRoute, private betService: BetHistoryService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.betId = params.betId;
      this.betService.getBetDetails(this.betId).then((bet: Bet) => {
        this.bet = bet;
      })
    })
  }

}
