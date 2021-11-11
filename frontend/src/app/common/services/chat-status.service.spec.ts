import { TestBed } from '@angular/core/testing';

import { ChatStatusService } from './chat-status.service';

describe('ChatStatusService', () => {
  let service: ChatStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
