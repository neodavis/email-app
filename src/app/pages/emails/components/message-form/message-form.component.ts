import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, NonNullableFormBuilder, FormGroup } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { Email, MessageCreation } from '../../models/mailbox.model';
import { map, startWith, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-message-form',
  standalone: true,
  templateUrl: 'message-form.component.html',
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, DropdownModule],
})
export class MessageFormComponent implements OnChanges {
  @Input() emails: Email[] = [];
  @Input() sendLoading = false;
  @Input() draftLoading = false;

  @Output() onSubmit = new EventEmitter<MessageCreation>();
  @Output() onSaveToDraft = new EventEmitter<MessageCreation>();

  messageForm: FormGroup;
  folders$: Observable<string[]> = of([]);
  emailAddresses: string[] = [];

  constructor(private nonNullableFormBuilder: NonNullableFormBuilder) {
    this.messageForm = this.nonNullableFormBuilder.group({
      senderEmail: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required, Validators.minLength(3)]],
      recipientEmail: ['', [Validators.required, Validators.email]],
      folder: ['', [Validators.required]],
      body: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['emails']?.currentValue) {
      this.messageForm.controls['senderEmail'].setValue(this.emails[0].emailAddress);
      this.messageForm.controls['folder'].setValue(this.emails[0].folders[0]);
    }

    if (changes['emails']?.currentValue.length && changes['emails'].firstChange) {
      this.emailAddresses = this.emails.map(email => email.emailAddress);
      this.folders$ = this.messageForm.controls['senderEmail'].valueChanges
        .pipe(
          startWith(this.messageForm.value['senderEmail']),
          map((email) => this.emails.find(mail => mail.emailAddress === email)?.folders ?? []),
          tap((folders) => this.messageForm.controls['folder'].setValue(folders[0])),
        );
    }
  }

  submitForm() {
    if (this.messageForm.valid) {
      this.onSubmit.emit(this.messageForm.getRawValue());
    }
  }
}
