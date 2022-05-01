import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParentService } from './parent.service';
import { ChatbotUserMessage } from '../data-types/chatbot-user-message';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService extends ParentService {
  chatbotEndpoint = '/chatbot';

  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  createUserMessage(userMessage: ChatbotUserMessage): Promise<any> {
    return this.create(this.chatbotEndpoint + '/', userMessage);
  }
}
