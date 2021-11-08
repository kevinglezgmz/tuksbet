import { Component, OnInit } from '@angular/core';
import { ChatMessage } from 'src/app/common/data-types/chat-message';
import { ChatHistoryService } from 'src/app/common/services/chat-history.service';

@Component({
  selector: 'app-chat-sidebar',
  templateUrl: './chat-sidebar.component.html',
  styleUrls: ['./chat-sidebar.component.scss'],
})
export class ChatSidebarComponent implements OnInit {
  chatMessages: ChatMessage[] = [];
  currentMessage: string = '';

  constructor(private chatHistory: ChatHistoryService) {}

  ngOnInit(): void {
    /** USING TEMPORARY ROULETTE ID (NEEDS TO BE CHANGED TO CURRENT ROOM'S ID) */
    this.chatHistory.getAllMessagesInRoom('6189a967db3a4a2f9cc7d31e').then((messages: ChatMessage[]) => {
      this.chatMessages = messages;
    });
  }

  sendMessage(event: Event) {
    if (this.currentMessage === '') {
      return;
    }
    /** This also needs to be updated to current user and room */
    const newMessage: ChatMessage = {
      message: this.currentMessage,
      userId: 'INVALID',
      username: 'NO USERNAME',
      chatRoomId: '6189a967db3a4a2f9cc7d31e',
    };
    this.chatMessages.push(newMessage);
    this.currentMessage = '';
  }

  scrollAdjustment(event: Event) {
    const target = event.target as HTMLDivElement;
    if (target.scrollTop === 1) {
      target.scrollTop = 0;
    }
  }
}
