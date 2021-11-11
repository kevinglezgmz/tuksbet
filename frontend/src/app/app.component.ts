import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';
import { ChatStatusService } from './common/services/chat-status.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    trigger('chatToggle', [
      state(
        'opened',
        style({
          marginLeft: '400px',
        })
      ),
      state(
        'closed',
        style({
          marginLeft: '25px',
        })
      ),
      transition('opened => closed', [animate('0.3s')]),
      transition('closed => opened', [animate('0.3s')]),
    ]),
  ],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'tuksbet-front';
  isChatOpen = true;

  constructor(private chatStatusService: ChatStatusService) {
    this.chatStatusService.isChatOpen().subscribe((status: boolean) => {
      this.isChatOpen = status;
    });
  }
}
