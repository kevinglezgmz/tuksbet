import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/common/data-types/chat-message';
import { AuthService } from 'src/app/common/services/auth.service';
import { ChatHistoryService } from 'src/app/common/services/chat-history.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
})
export class ChatSidebarComponent implements OnInit {
  chatMessages: ChatMessage[] = [];
  currentMessage: string = '';
  currentRoom: string = '6189a967db3a4a2f9cc7d31e';

  private username: string = '';
  private userId: string = '';

  constructor(
    private webSocket: WebSocketService,
    private chatHistory: ChatHistoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chatHistory.getAllMessagesInRoom(this.currentRoom).then((messages: ChatMessage[]) => {
      this.chatMessages = messages;
    });

    const { username, userId } = this.authService.getUserDetails();
    this.userId = userId || '';
    this.username = username || '';

    this.webSocket.emit('join-room', this.currentRoom);

    this.webSocket.listen('new-message').subscribe((message: ChatMessage) => {
      this.chatMessages.push(message);
    });
  }

  sendMessage(event: Event) {
    if (this.currentMessage === '') {
      return;
    }
    /** For now, only roulette will be available as a room */
    const newMessage: ChatMessage = {
      message: this.currentMessage,
      userId: this.userId,
      username: this.username,
      chatRoomId: this.currentRoom,
    };

    /** First we try to save it in the DB, then we send it to the other users */
    this.chatHistory.createNewMessageInRoom(newMessage.chatRoomId!, newMessage).then(({ status }) => {
      if (status.acknowledged) {
        this.chatMessages.push(newMessage);
        this.webSocket.emit('new-message', newMessage);
      }
    });
    this.currentMessage = '';
  }

  scrollAdjustment(event: Event) {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop === 1) {
      target.scrollTop = 0;
    }
  }
}
