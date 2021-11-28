import { Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChatMessage } from 'src/app/common/data-types/chat-message';
import { AuthService } from 'src/app/common/services/auth.service';
import { ChatHistoryService } from 'src/app/common/services/chat-history.service';
import { ChatStatusService } from 'src/app/common/services/chat-status.service';
import { WebSocketService } from 'src/app/common/services/web-socket.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogContentComponent } from 'src/app/common/components/confirm-dialog-content/confirm-dialog-content.component';

@Component({
  selector: 'app-chat-sidenav-tab',
  templateUrl: './chat-sidenav-tab.component.html',
  styleUrls: ['./chat-sidenav-tab.component.scss'],
})
export class ChatSidenavTab implements OnInit {
  chatMessages: ChatMessage[] = [];
  currentMessage: string = '';
  @Input('currentRoom') currentRoom: string = '6189a967db3a4a2f9cc7d31e';
  @Input('selectedRoom') selectedRoom: string = '6189a967db3a4a2f9cc7d31e';
  @ViewChild('scrollableChatContainer')
  scrollableChatContainer!: ElementRef;

  isChatOpen: boolean = true;
  isLoggedIn: boolean = false;
  roles: string = '';

  private username: string = '';
  private userId: string = '';

  constructor(
    private webSocket: WebSocketService,
    private chatHistory: ChatHistoryService,
    private authService: AuthService,
    private chatStatusService: ChatStatusService,
    public dialog: MatDialog
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

  private getAllMessages() {
    this.chatHistory.getAllMessagesInRoom(this.currentRoom).then((messages: ChatMessage[]) => {
      this.chatMessages = messages.slice(0, 50);
      setTimeout(() => {
        const scrollableChatContainer = this.scrollableChatContainer.nativeElement as HTMLDivElement;
        scrollableChatContainer.scrollTop = scrollableChatContainer.scrollHeight;
      });
    });
  }

  ngOnInit(): void {
    this.getAllMessages();
    this.webSocket.listen('connect').subscribe((data) => {});

    this.webSocket.listen('new-message').subscribe((newMessage: ChatMessage) => {
      this.addNewMessage(newMessage);
    });

    this.webSocket.listen('deleted-message').subscribe((deleted: ChatMessage) => {
      this.deleteMessageUsers(deleted._id);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.selectedRoom && changes.selectedRoom.currentValue === this.currentRoom) {
      this.webSocket.emit('join-room', this.currentRoom);
      this.getAllMessages();
    } else if (changes.selectedRoom && changes.selectedRoom.previousValue === this.currentRoom) {
      this.webSocket.emit('leave-room', changes.selectedRoom.currentValue);
    }
  }

  sendMessage(event: Event) {
    if (!this.currentMessage || !this.userId || !this.currentRoom) {
      return;
    }
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

  deleteMessage(msgId: string) {
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

  openDeleteConfirmDialog(msgId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogContentComponent, {
      data: {
        title: '¿Borrar elemento?',
        body: '¿Está seguro que desea eliminar el elemento? Esta acción no puede deshacerse.',
      },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteMessage(msgId);
      }
    });
  }
}
