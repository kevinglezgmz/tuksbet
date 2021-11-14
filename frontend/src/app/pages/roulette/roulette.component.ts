import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-roulette',
  templateUrl: './roulette.component.html',
  animations: [
    trigger('rouletteRoll', [
      state(
        'waitingRoll',
        style({
          transitionTimingFunction: '',
          transitionDuration: '',
          transform: 'translate3d({{landingPosition}}px, 0px, 0px)',
        }),
        { params: { landingPosition: '100px' } }
      ),
      state(
        'rolling',
        style({
          transitionTimingFunction: 'cubic-bezier(0.12, 0.8, .38,1)',
          transitionDuration: '{{animationTime}}s',
          transform: 'translate3d(-{{landingPosition}}px, 0px, 0px)',
        }),
        { params: { landingPosition: '100px', animationTime: 6 } }
      ),
    ]),
    trigger('winningCard', [
      state(
        'loser',
        style({
          transform: 'scale(1)',
        })
      ),
      state(
        'winner',
        style({
          transform: 'scale(1.15)',
          zIndex: 1,
        })
      ),
      transition('loser => winner', [style({ zIndex: 1 }), animate('0.3s')]),
      transition('winner => loser', [style({ zIndex: 1 }), animate('0.3s')]),
    ]),
  ],
  styleUrls: ['./roulette.component.scss'],
})
export class RouletteComponent implements OnInit, AfterViewInit {
  rouletteLength: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
  order: number[] = [1, 14, 2, 13, 3, 12, 4, 0, 11, 5, 10, 6, 9, 7, 8];
  animationTime: number = 6;
  landingPosition: number = 0;
  activateRoll: boolean = false;
  winningRoll: number | undefined = undefined;

  lastRoll: number = 0;

  counter: number = 0;

  /** Local properties needed to calculate the landing position */
  private cardWidth: number = 0;
  private cardWidthNoMargin: number = 0;

  @ViewChild('rouletteNumberCard') rouletteNumberCard!: ElementRef;

  /** Host listener to be able to know when the user returns to the page */
  @HostListener('window:focus', ['$event'])
  onFocus(event: FocusEvent): void {
    this.webSocket.emit('join-roulette-game', undefined);
  }

  constructor(private webSocket: WebSocketService) {
    this.webSocket.emit('join-roulette-game', undefined);

    this.webSocket.listen('roulette-game-roll').subscribe((roll) => {
      this.spinWheel(roll);
    });

    this.webSocket.listen('roulette-game-timer').subscribe((timerSeconds) => {
      this.startCounter(timerSeconds);
    });

    this.webSocket.listen('roulette-game-status').subscribe((data) => {
      this.syncWithServer(data);
    });
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      const divNumberCard = this.rouletteNumberCard.nativeElement as HTMLDivElement;
      this.cardWidthNoMargin = divNumberCard.offsetWidth;
      const cardLeftMargin = parseInt(window.getComputedStyle(divNumberCard).getPropertyValue('margin-left'));
      this.cardWidth = this.cardWidthNoMargin + cardLeftMargin * 2;
      this.landingPosition = (this.rouletteLength.length / 2 - 1) * this.cardWidth * 15 - this.cardWidth * 7.5;
    }, 0);
  }

  spinWheel(roll: number): void {
    this.lastRoll = roll;

    const position = this.order.indexOf(roll);
    this.landingPosition = (this.rouletteLength.length / 2 - 2) * 15 * this.cardWidth + position * this.cardWidth;
    const randomizeBaitOffset = Math.floor(Math.random() * this.cardWidthNoMargin);
    this.landingPosition = this.landingPosition + randomizeBaitOffset;

    this.activateRoll = true;
    setTimeout(() => {
      const resetTo =
        (this.rouletteLength.length / 2 - 1) * this.cardWidth * 15 - position * this.cardWidth - randomizeBaitOffset;
      this.landingPosition = resetTo;
      this.activateRoll = false;
      this.winningRoll = roll;
      setTimeout(() => {
        this.winningRoll = undefined;
      }, 1000);
    }, this.animationTime * 1000);
  }

  currentInterval: any = undefined;
  startCounter(seconds: number) {
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
    }

    this.counter = seconds;
    this.currentInterval = setInterval(() => {
      this.counter = this.counter - 0.01;
      if (this.counter <= 0) {
        this.counter = 0;
        if (this.currentInterval) {
          clearInterval(this.currentInterval);
        }
      }
    }, 10);
  }

  private syncWithServer({
    currentTimer,
    isRolling,
    lastRoll,
  }: {
    currentTimer: number;
    isRolling: boolean;
    lastRoll: number;
  }) {
    this.startCounter(currentTimer);
    // Game is in sync and currently rolling, no need to do anything
    if (this.activateRoll) {
      return;
    }
    const tempAnimationTime = this.animationTime;
    if (!isRolling && currentTimer > 0.7 && this.lastRoll !== lastRoll) {
      this.animationTime = 0.1;
      this.spinWheel(lastRoll);
    } else if (isRolling) {
      this.animationTime = 1;
      this.spinWheel(lastRoll);
    }
    this.animationTime = tempAnimationTime;
  }
}
