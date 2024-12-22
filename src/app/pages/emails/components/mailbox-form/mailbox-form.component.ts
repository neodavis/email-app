import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mailbox-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule],
  template: `
    <form [formGroup]="mailboxForm" (ngSubmit)="onSubmit()">
      <div class="mb-4">
        <span class="p-float-label">
          <label for="emailAddress">Email Address</label>
          <input
            pInputText
            id="emailAddress"
            formControlName="emailAddress"
            class="w-full"
          />
        </span>
      </div>

      <div class="mb-4">
        <span class="p-float-label">
          <label for="accessSmtp">SMTP Password</label>
          <input
            pInputText
            id="accessSmtp"
            formControlName="accessSmtp"
            type="password"
            class="w-full"
          />
        </span>
      </div>

      <div class="mb-4">
        <span class="p-float-label">
          <label for="refreshToken">Refresh Token</label>
          <input
            pInputText
            id="refreshToken"
            formControlName="refreshToken"
            type="password"
            class="w-full"
          />
        </span>
      </div>

      <div class="flex justify-content-end">
        <p-button
          type="submit"
          [disabled]="mailboxForm.invalid"
        >
          <i class="pi pi-plus"></i>
          Add Mailbox
        </p-button>
      </div>
    </form>
  `
})
export class MailboxFormComponent {
  mailboxForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: DynamicDialogRef
  ) {
    this.mailboxForm = this.fb.group({
      emailAddress: ['', [Validators.required, Validators.email]],
      accessSmtp: ['', [Validators.required, Validators.minLength(5)]],
      refreshToken: ['']
    });
  }

  onSubmit() {
    if (this.mailboxForm.valid) {
      this.ref.close(this.mailboxForm.value);
    }
  }
}
