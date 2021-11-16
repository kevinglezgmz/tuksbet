import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/common/data-types/chat-message';
import { AuthService } from 'src/app/common/services/auth.service';
import { ChatHistoryService } from 'src/app/common/services/chat-history.service';
import { ChatStatusService } from 'src/app/common/services/chat-status.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';

@Component({
  selector: 'app-chat-sidebar',
  animations: [
    trigger('chatToggle', [
      state(
        'opened',
        style({
          transform: 'translate3d(0px, 0px, 0px)',
        })
      ),
      state(
        'closed',
        style({
          transform: 'translate3d(-375px, 0px, 0px)',
        })
      ),
      transition('opened => closed', [animate('0.3s')]),
      transition('closed => opened', [animate('0.3s')]),
    ]),
  ],
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
})
export class ChatSidebarComponent implements OnInit {
  chatMessages: ChatMessage[] = [];
  currentMessage: string = '';
  currentRoom: string = '6189a967db3a4a2f9cc7d31e';

  isChatOpen: boolean = true;
  isLoggedIn: boolean = false;
  roles: string = '';

  private username: string = '';
  private userId: string = '';

  constructor(
    private webSocket: WebSocketService,
    private chatHistory: ChatHistoryService,
    private authService: AuthService,
    private chatStatusService: ChatStatusService
  ) {
    this.chatStatusService.isChatOpen().subscribe((status) => {
      this.isChatOpen = status;
    });

    this.authService.isLoggedIn().subscribe((status) => {
      this.isLoggedIn = status;
      const { username, userId, roles } = this.authService.getUserDetails();
      this.userId = userId || '';
      this.username = username || '';
      this.roles = roles || '';
    });
  }

  ngOnInit(): void {
    this.chatHistory.getAllMessagesInRoom(this.currentRoom).then((messages: ChatMessage[]) => {
      this.chatMessages = messages.slice(0, 50);
    });

    this.webSocket.listen('connect').subscribe((data) => {});

    this.webSocket.emit('join-room', this.currentRoom);

    this.webSocket.listen('new-message').subscribe((newMessage: ChatMessage) => {
      this.addNewMessage(newMessage);
    });

    this.webSocket.listen('deleted-message').subscribe((deleted: ChatMessage) => {
      this.deleteMessageUsers(deleted._id);
    });
  }

  sendMessage(event: Event) {
    if (!this.currentMessage || !this.userId || !this.currentRoom) {
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
        newMessage._id = status.insertedId;
        this.addNewMessage(newMessage);
        this.webSocket.emit('new-message', newMessage);
        this.currentMessage = '';
      }
    });
  }

  private addNewMessage(message: ChatMessage) {
    this.chatMessages.push(message);
    while (this.chatMessages.length > 50) {
      this.chatMessages.shift();
    }
  }

  scrollAdjustment(event: Event) {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop === 1) {
      target.scrollTop = 0;
    }
  }

  toggleChatSidebar(event: MouseEvent) {
    if (this.isChatOpen) {
      this.chatStatusService.chatClose();
    } else {
      this.chatStatusService.chatOpen();
    }
  }

  deleteMessageUsers(msgId: string | undefined) {
    return this.chatMessages.splice(
      this.chatMessages.findIndex((msg) => msg._id === msgId),
      1
    );
  }

  deleteMessage(event: MouseEvent, msgId: string) {
    this.chatHistory
      .deleteMessageInRoom(this.currentRoom, msgId)
      .then((msg) => {
        const [deletedMsg] = this.deleteMessageUsers(msgId);
        this.webSocket.emit('deleted-message', deletedMsg);
      })
      .catch((err) => {
        console.log('Hubo un problema en la eliminación del mensaje');
      });
  }
}
