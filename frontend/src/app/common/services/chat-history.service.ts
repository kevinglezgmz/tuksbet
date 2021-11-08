import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatMessage } from '../data-types/chat-message';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class ChatHistoryService extends ParentService {
  chatHistoryEndpoint = '/chatrooms/';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAllMessagesInRoom(chatRoomId: string): Promise<any> {
    return this.get(this.chatHistoryEndpoint + chatRoomId + '/messages');
  }

  createNewMessageInRoom(chatRoomId: string, message: ChatMessage): Promise<any> {
    return this.create(this.chatHistoryEndpoint + chatRoomId + '/messages', message);
  }

  deleteMessageInRoom(chatRoomId: string, messageId: string): Promise<any> {
    return this.delete(this.chatHistoryEndpoint + chatRoomId + '/messages/' + messageId);
  }

  updateTransaction(chatRoomId: string, messageId: string, message: ChatMessage): Promise<any> {
    return this.update(this.chatHistoryEndpoint + chatRoomId + '/messages/' + messageId, message);
  }
}
