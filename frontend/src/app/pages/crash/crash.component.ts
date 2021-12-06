import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GameHistoryComponent } from 'src/app/common/components/game-history/game-history.component';
import { Bet } from 'src/app/common/data-types/bet';
import { CanvasDrawableNumber, CrashStates } from 'src/app/common/data-types/crash-game-types';
import { AuthService } from 'src/app/common/services/auth.service';
import { BalanceService } from 'src/app/common/services/balance.service';
import { BetHistoryService } from 'src/app/common/services/bet-history.service';
import { IsDarkThemeService } from 'src/app/common/services/is-dark-theme.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-crash',
  templateUrl: './crash.component.html',
  styleUrls: ['./crash.component.scss'],
})
export class CrashComponent implements OnInit, AfterViewInit {
  isDarkModeActive: boolean = true;

  isLoggedIn: boolean = false;
  betAmount: number = 5;

  crashWidth: number = 800;
  crashHeight: number = 421;
  crashMargin: number = 20;

  nextGameRoundStartAt: number = 0;
  lagAdjustment = 0;
  lastNumberInsertedAt: number = Date.now();
  currentGameRoundId: string = 'DEV';
  currentRoundBets: Bet[] = [];

  /** Canvas specific variables */
  canvasContext: CanvasRenderingContext2D | null = null;
  crashState: CrashStates = CrashStates.RUNNING;

  /*** Canvas variables (e.g. elements to draw)*/
  secondsControl: number = 10;
  secondsArray: CanvasDrawableNumber[] = [];
  multipliersArray: CanvasDrawableNumber[] = [];
  crashedAt: number = 0;
  currentMultiplier: number = 0;

  /***** Curve variables *****/
  curveCurrentX!: number;
  curveCurrentY!: number;
  bezierPointDestOffsetX!: number;
  bezierPointDestOffsetY!: number;
  bezierProgressiveOffsetX!: number;
  bezierProgressiveOffsetY!: number;
  curveSpeed!: number;
  yPercentageDest: number = 0.8;
  curveSlopeM!: number;

  @ViewChild('crashCanvas') crashCanvas!: ElementRef;
  @ViewChild('crashCanvasContainer') crashCanvasContainer!: ElementRef;

  /** Destroy observables when we leave the page */
  private unsubscribe: Subject<void> = new Subject<void>();
  constructor(
    private webSocket: WebSocketService,
    private authService: AuthService,
    private betService: BetHistoryService,
    private dialogService: MatDialog,
    private isDarkThemeService: IsDarkThemeService
  ) {
    this.webSocket.emit('join-crash-game', undefined);

    this.webSocket
      .listen('crash-game-round-waiting-status')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ nextGameRoundStartAt, currentGameRoundId }) => {
        this.crashState = CrashStates.WAITING;
        this.nextGameRoundStartAt = nextGameRoundStartAt;
        this.currentGameRoundId = currentGameRoundId;
        this.updateCurrentBets();
      });

    this.webSocket
      .listen('crash-game-round-running-status')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ nextGameRoundStartAt, currentGameRoundId, serverCurrentTime }) => {
        this.crashState = CrashStates.RUNNING;
        this.nextGameRoundStartAt = nextGameRoundStartAt;
        this.currentGameRoundId = currentGameRoundId;
        this.lagAdjustment = serverCurrentTime - Date.now();
        this.updateCurrentBets();
      });

    this.webSocket
      .listen('crash-game-round-crashed-status')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(({ realCrashedAt, currentGameRoundId }) => {
        this.crashedAt = realCrashedAt;
        this.crashState = CrashStates.CRASHED;
        this.currentGameRoundId = currentGameRoundId;
        this.currentRoundBets = [];
      });

    this.webSocket
      .listen('new-crash-bet')
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((bet: Bet) => {
        this.currentRoundBets.push(bet);
      });

    this.authService
      .isLoggedIn()
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((isLoggedIn) => {
        this.isLoggedIn = isLoggedIn;
      });

    this.isDarkThemeService.isCurrentThemeDark().subscribe((isDarkMode) => {
      this.isDarkModeActive = isDarkMode;
    });

    this.crashWidth = 800;
    this.crashHeight = 421;
    this.resetCrashValues();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.unsubscribe();
  }

  ngAfterViewInit() {
    const canvas = this.crashCanvas.nativeElement as HTMLCanvasElement;
    this.canvasContext = canvas.getContext('2d');
    this.canvasContext!.beginPath();
    this.canvasContext!.lineWidth = 2;
    this.resetCrashValues();
    this.startDrawing();
    setTimeout(() => {
      const crashContainer = this.crashCanvasContainer.nativeElement as HTMLDivElement;
      this.crashWidth = crashContainer.offsetWidth;
      this.crashHeight = crashContainer.offsetHeight;
    });
  }

  private updateCurrentBets() {
    this.betService
      .getAllBets(this.currentGameRoundId, 0, 0)
      .then((bets: Bet[]) => {
        this.currentRoundBets = bets;
      })
      .catch(() => {});
  }

  private startDrawing() {
    if (!this.canvasContext) {
      return;
    }
    this.updateCanvas();
  }

  private updateCanvas() {
    this.clearCanvas();
    this.setInitialFontValues();
    this.drawCrashAxes();

    if (this.crashState === CrashStates.RUNNING) {
      const secondsSinceStart = (Date.now() + this.lagAdjustment - this.nextGameRoundStartAt) / 1000;
      this.drawIncrementalCurve(secondsSinceStart);
      this.resetCrashValues();
    } else {
      this.resetCrashValues();
    }

    this.drawCrashText();
    requestAnimationFrame(this.updateCanvas.bind(this));
  }

  private clearCanvas() {
    if (!this.canvasContext) {
      return;
    }
    this.canvasContext.clearRect(0, 0, this.crashWidth, this.crashHeight);
    this.canvasContext.beginPath();
  }

  /** Function to be called before starting a new round */
  private resetCrashValues() {
    this.curveCurrentX = this.crashMargin;
    this.curveCurrentY = this.crashHeight - this.crashMargin;
    this.bezierPointDestOffsetX = this.crashWidth / 2 - 80;
    this.bezierPointDestOffsetY = this.crashHeight / 2 - 80;
    this.bezierProgressiveOffsetX = 0;
    this.bezierProgressiveOffsetY = 0;
    this.curveSpeed = this.getSpeedForXSecondsAndYDistance(this.crashWidth - this.crashMargin, this.secondsControl);
    this.yPercentageDest = 0.8;
    this.curveSlopeM = (this.yPercentageDest * (this.crashHeight - this.crashMargin)) / (this.crashWidth - this.crashMargin);
    this.lastNumberInsertedAt = 0;
  }

  private drawCrashAxes() {
    if (!this.canvasContext) {
      return;
    }
    this.setInitialFontValues();
    this.canvasContext.beginPath();
    this.canvasContext!.lineWidth = 2;
    this.canvasContext.moveTo(this.crashMargin, 0);
    this.canvasContext.lineTo(this.crashMargin, this.crashHeight - this.crashMargin);
    this.canvasContext.lineTo(this.crashWidth, this.crashHeight - this.crashMargin);
    this.canvasContext.stroke();
  }

  private setInitialFontValues() {
    this.canvasContext!.font = 'bold 12px Arial';
    this.canvasContext!.fillStyle = this.isDarkModeActive ? 'white' : 'black';
    this.canvasContext!.strokeStyle = this.isDarkModeActive ? 'white' : 'black';
  }

  private getSpeedForXSecondsAndYDistance(distance: number, seconds: number) {
    const framesNeeded = 60 * seconds;
    return distance / framesNeeded;
  }

  private drawIncrementalCurve(secondsSinceStart: number) {
    const bezierControlPoint = {
      x: this.curveCurrentX,
      y: this.curveCurrentY,
    };
    /** X axis for curve */
    this.curveCurrentX = this.crashMargin + this.curveSpeed * secondsSinceStart * 60;
    this.curveCurrentX = Math.min(this.curveCurrentX, this.crashWidth);
    /** Y axis for curve */
    const heightNoMargin = this.crashHeight - this.crashMargin;
    const secondsFromYPercentToZero = (heightNoMargin * 0.2) / (this.curveSlopeM * this.curveSpeed * 60 * 0.6);
    if (secondsSinceStart < this.secondsControl) {
      this.curveCurrentY = heightNoMargin - this.curveSlopeM * this.curveSpeed * secondsSinceStart * 60;
    } else if (secondsSinceStart < this.secondsControl + secondsFromYPercentToZero) {
      this.curveCurrentY = heightNoMargin - this.curveSlopeM * this.curveSpeed * this.secondsControl * 60;
      this.curveCurrentY -= this.curveSlopeM * this.curveSpeed * (secondsSinceStart - this.secondsControl) * 60 * 0.6;
      this.curveCurrentY = Math.max(0, this.curveCurrentY);
    } else {
      this.curveCurrentY = 0;
      if (
        this.bezierProgressiveOffsetX < this.bezierPointDestOffsetX &&
        this.bezierProgressiveOffsetY < this.bezierPointDestOffsetY &&
        secondsSinceStart >= this.secondsControl + secondsFromYPercentToZero
      ) {
        this.bezierProgressiveOffsetX =
          this.curveSpeed * (secondsSinceStart - this.secondsControl - secondsFromYPercentToZero) * 60 * 0.1;
        this.bezierProgressiveOffsetX = Math.min(this.bezierProgressiveOffsetX, this.bezierPointDestOffsetX);

        this.bezierProgressiveOffsetY =
          this.curveSlopeM *
          this.curveSpeed *
          (secondsSinceStart - this.secondsControl - secondsFromYPercentToZero) *
          60 *
          0.1;
        this.bezierProgressiveOffsetY = Math.min(this.bezierProgressiveOffsetY, this.bezierPointDestOffsetY);

        bezierControlPoint.x = this.crashMargin + (this.crashWidth - this.crashMargin) / 2;
        bezierControlPoint.y = (this.crashHeight - this.crashMargin) / 2;
      } else {
        bezierControlPoint.x = this.crashMargin + (this.crashWidth - this.crashMargin) / 2;
        bezierControlPoint.y = (this.crashHeight - this.crashMargin) / 2;
      }
    }

    if (secondsSinceStart > this.secondsControl + secondsFromYPercentToZero) {
      bezierControlPoint.x += this.bezierProgressiveOffsetX;
      bezierControlPoint.y += this.bezierProgressiveOffsetY;
    }
    this.canvasContext!.beginPath();
    this.canvasContext!.lineWidth = 5;
    this.canvasContext!.moveTo(this.crashMargin, this.crashHeight - this.crashMargin);
    this.canvasContext!.bezierCurveTo(
      bezierControlPoint.x,
      bezierControlPoint.y,
      bezierControlPoint.x,
      bezierControlPoint.y,
      this.curveCurrentX,
      this.curveCurrentY
    );
    this.canvasContext!.stroke();
  }

  private drawCrashText() {
    this.canvasContext!.textAlign = 'center';
    // const numberToDraw = (secondsSinceStart * secondsSinceStart) / 150 + 1;

    let textToDraw = '';
    switch (this.crashState) {
      case CrashStates.RUNNING:
        this.canvasContext!.font =
          '100px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
        this.canvasContext!.fillStyle = this.isDarkModeActive ? '#0ee07b' : 'green';
        if (this.nextGameRoundStartAt === 0) {
          textToDraw = 'Connecting...';
        } else {
          const numberToDraw = this.getCurrentMultiplier(
            (Date.now() + this.lagAdjustment - this.nextGameRoundStartAt) / 1000
          );
          this.currentMultiplier = numberToDraw;
          textToDraw = this.currentMultiplier.toFixed(2) + 'x';
        }
        break;
      case CrashStates.WAITING:
        this.canvasContext!.font =
          '35px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
        this.canvasContext!.fillStyle = this.isDarkModeActive ? 'white' : 'black';
        const counter = (this.nextGameRoundStartAt - Date.now() + this.lagAdjustment) / 1000;
        textToDraw = 'La siguiente ronda comenzará en: ' + (counter >= 0 ? counter : 0).toFixed(2);
        break;
      case CrashStates.CRASHED:
        this.canvasContext!.font =
          '45px -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif';
        const crashedMult = this.getCurrentMultiplier((this.crashedAt - this.nextGameRoundStartAt) / 1000);
        this.canvasContext!.fillStyle = 'red';
        textToDraw = 'Crashed @' + crashedMult.toFixed(2) + 'x';
        break;
    }
    this.canvasContext!.fillText(
      textToDraw,
      this.crashMargin + (this.crashWidth - this.crashMargin) / 2,
      (this.crashHeight - this.crashMargin) / 2
    );
  }

  private getCurrentMultiplier(secondsSinceStart: number): number {
    const speedFactor = secondsSinceStart;
    return Math.E ** (speedFactor / 18);
  }

  setBetAmount(event: number) {
    this.betAmount = event;
  }

  onResize(event: UIEvent) {
    const crashContainer = this.crashCanvasContainer.nativeElement as HTMLDivElement;
    this.crashWidth = crashContainer.offsetWidth;
    this.crashHeight = crashContainer.offsetHeight;
  }

  openCrashHistory() {
    const dialogRef = this.dialogService.open(GameHistoryComponent, {
      data: {
        gameName: 'Crash',
      },
      autoFocus: false,
      width: '95%',
      maxWidth: '1200px',
    });
  }
}
