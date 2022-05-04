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
    this.showChatbox = !this.showChatbox;
  }
  
  toogleShowChatIcon() {
    console.log('chaticon');
    this.showChatIcon = !this.showChatIcon;
  }
  
  hideChatbox() {
    this.toogleShowChatIcon();
    this.toogleShowChatbox();
  }
}
