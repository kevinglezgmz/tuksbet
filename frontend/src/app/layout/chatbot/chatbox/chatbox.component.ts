import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LexRuntime } from 'aws-sdk';
import { Message } from '../../../messages';
import { ChatbotUserMessage } from '../../../common/data-types/chatbot-user-message';
import { ChatbotService } from 'src/app/common/services/chatbot.service';

@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
  chatbotMessages: ChatbotUserMessage[] = [];
  @Input() showChatbox: boolean = false;
  @Output() showChatbotIcon = new EventEmitter<boolean>();

  userInput: string = '';
  messages: Message[] = [];
  lexState: string | undefined = 'Hi what would you like to do';

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.messages.push(new Message(this.lexState, 'Bot'));
  }
  closeChatbox() {
    this.showChatbotIcon.emit(true);
  }
  askLex() {
    const userMessage: ChatbotUserMessage = {
      userId: '00',
      message: this.userInput,
    };
    this.chatbotMessages.push(userMessage);
    this.chatbotService.createUserMessage(userMessage).then((res) => {
      const BotResponse: ChatbotUserMessage = {
        userId: 'TuksBot',
        message: res.resp,
      };
      this.chatbotMessages.push(BotResponse);
    });

    this.userInput = '';
  }
}