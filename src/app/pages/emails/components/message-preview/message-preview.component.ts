import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { MessageDetails } from '../../models/email.model';

@Component({
  selector: 'app-message-preview',
  templateUrl: './message-preview.component.html',
  standalone: true,
  imports: [DatePipe],
  styleUrls: ['./message-preview.component.scss']
})
export class MessagePreviewComponent {
  @Input({ required: true }) message!: MessageDetails;
}
