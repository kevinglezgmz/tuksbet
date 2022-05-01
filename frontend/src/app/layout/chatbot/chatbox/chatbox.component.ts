import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
  @Input() showChatbox: boolean = false;
  @Output() showChatbotIcon = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}
  closeChatbox() {
    this.showChatbotIcon.emit(true);
  }
}
