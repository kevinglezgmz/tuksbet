import { Component, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ChatRoomsService } from 'src/app/common/services/chat-rooms.service';

@Component({
  selector: 'app-chat-sidenav-tab-group',
  templateUrl: './chat-sidenav-tab-group.component.html',
  styleUrls: ['./chat-sidenav-tab-group.component.scss'],
})
export class ChatSidenavTabGroupComponent implements OnInit {
  availableRooms: { chatRoomName: string; _id: string }[] = [];
  selectedRoom: string = '';

  constructor(private chatRoomsService: ChatRoomsService) {
    this.chatRoomsService.getAllChatRooms().then((rooms: { chatRoomName: string; _id: string }[]) => {
      this.availableRooms = rooms;
      this.selectedRoom = rooms[0]._id;
    });
  }

  ngOnInit(): void {}

  onChatChange(event: MatTabChangeEvent) {
    this.selectedRoom = this.availableRooms[event.index]._id;
  }
}
