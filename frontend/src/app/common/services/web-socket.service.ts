import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import io, { Socket } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: Socket | undefined = undefined;

  constructor() {
    this.socket = io(environment.serverUrl);
  }

  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket?.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }

  emit(eventName: string, data: any) {
    this.socket?.emit(eventName, data);
  }
}
