import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

import { DropdownModule } from 'primeng/dropdown';
import { Button } from 'primeng/button';

import { MessageDetails } from '../../models/email.model';

@Component({
  selector: 'app-message-preview',
  templateUrl: './message-preview.component.html',
  standalone: true,
  imports: [DatePipe, AsyncPipe, DropdownModule, ReactiveFormsModule, Button],
  styleUrls: ['./message-preview.component.scss']
})
export class MessagePreviewComponent implements OnChanges {
  @Input({ required: true }) message!: MessageDetails;
  @Input({ required: true }) folder: string | null = null;
  @Input({ required: true }) folders: string[] = [];
  @Input() moveLoading = false;

  @Output() moveIntoFolder = new EventEmitter<string>();

  folderControl = new FormControl<string>('', [Validators.required]);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['folder']?.currentValue) {
      this.folderControl.setValue(this.folder);
    }
  }
}
