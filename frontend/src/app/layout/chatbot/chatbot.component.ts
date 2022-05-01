import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss'],
})
export class ChatbotComponent implements OnInit {
  showChatbox: boolean = false;
  showChatIcon: boolean = true;
  constructor() {}

  ngOnInit(): void {}

  toogleShowChatbox() {
    console.log('chatbot');
    this.showChatbox = !this.showChatbox;
  }
  toogleShowChatIcon() {
    console.log('chaticon');
    this.showChatIcon = !this.showChatIcon;
  }
  hideChatbox() {
    console.log('hide');
    this.toogleShowChatIcon();
    this.toogleShowChatbox();
  }
}
