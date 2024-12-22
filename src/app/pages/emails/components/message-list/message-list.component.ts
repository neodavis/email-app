import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { Message } from '../../models/email.model';

@Component({
  selector: 'app-message-list',
  templateUrl: 'message-list.component.html',
  standalone: true,
  imports: [ButtonModule, CommonModule],
})
export class MessageListComponent {
  @Input() messages: Message[] = [];
  @Input() selectedMessageMsgnum: null | string = null;

  @Output() onMessageSelect = new EventEmitter<Message>();
}
