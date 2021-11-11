import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatStatusService {
  chatOpenStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    const chatStatus = localStorage.getItem('isChatOpen') || 'true';
    this.chatOpenStatus.next(chatStatus === 'true');
  }

  isChatOpen(): Observable<boolean> {
    return this.chatOpenStatus.asObservable();
  }

  chatClose(): void {
    localStorage.setItem('isChatOpen', 'false');
    this.chatOpenStatus.next(false);
  }

  chatOpen(): void {
    localStorage.setItem('isChatOpen', 'true');
    this.chatOpenStatus.next(true);
  }
}
