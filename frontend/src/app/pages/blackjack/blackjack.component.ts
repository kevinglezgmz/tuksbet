import { Component, OnInit } from '@angular/core';
import { BlackjackGame } from 'src/app/common/data-types/blackjack-game';
import { BlackjackPlayer } from 'src/app/common/data-types/blackjack-player';
import { Card } from 'src/app/common/data-types/card';
import { AuthService } from 'src/app/common/services/auth.service';
import { BetHistoryService } from 'src/app/common/services/bet-history.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-blackjack',
  templateUrl: './blackjack.component.html',
  styleUrls: ['./blackjack.component.scss']
})
export class BlackjackComponent implements OnInit {
  game: BlackjackGame = {
    gameStarted: false,
    userPlaying: false,
    dealer: {
      cards: []
    },
    player: {
      cards: []
    }
  };
  betAmount: number = 0;

  constructor(private webSocket: WebSocketService, private betService: BetHistoryService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.webSocket.emit('check-if-game', this.authService.getUserDetails().userId)
    this.webSocket
        .listen('init-blackjack')
        .subscribe((game) => {
          this.game = game;
        });

    this.webSocket
        .listen('return-hit-blackjack').subscribe((game) => {
          this.game = game;
        });

    this.webSocket
        .listen('return-stand-blackjack').subscribe((game) => {
          this.game = game;
        });
  }

  setBetAmount(event: number) {
    this.betAmount = event;
  }

  blackjackInit() {
    this.webSocket.emit('start-blackjack-game', this.authService.getUserDetails().userId);
}

  blackjackHit() {
    this.webSocket.emit('hit-blackjack', this.authService.getUserDetails().userId);
  }

  blackjackStand() {
    this.webSocket.emit('stand-blackjack', this.authService.getUserDetails().userId);
  }

  blackjackDouble() {
    this.betAmount += this.betAmount;
    this.webSocket.emit('double-blackjack', this.authService.getUserDetails().userId);
  }
}
