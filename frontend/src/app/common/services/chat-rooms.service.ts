import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ParentService } from './parent.service';

@Injectable({
  providedIn: 'root',
})
export class ChatRoomsService extends ParentService {
  chatRoomsEndpoint = '/chatrooms/';

  constructor(httpClient: HttpClient, private authService: AuthService) {
    super(httpClient);
  }

  getAllChatRooms(): Promise<any> {
    return this.get(this.chatRoomsEndpoint);
  }

  createNewChatRoom(chatRoomName: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.create(this.chatRoomsEndpoint, { chatRoomName }, headers);
  }

  deleteChatRoom(chatRoomId: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.delete(this.chatRoomsEndpoint + chatRoomId, headers);
  }

  updateChatRoom(chatRoomId: string, chatRoomName: string): Promise<any> {
    const headers: HttpHeaders = this.authService.getAuthHeader();
    return this.update(this.chatRoomsEndpoint + chatRoomId, { chatRoomName }, headers);
  }
}
