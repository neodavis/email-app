import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

export type NotificationType = 'success' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  show(type: NotificationType, summary: string, detail?: string) {
    this.messageService.add({
      severity: type,
      summary,
      detail,
      life: 3000
    });
  }

  showSuccess(summary: string, detail?: string) {
    this.show('success', summary, detail);
  }

  showError(summary: string, detail?: string) {
    this.show('error', summary, detail);
  }

  showInfo(summary: string, detail?: string) {
    this.show('info', summary, detail);
  }

  showWarning(summary: string, detail?: string) {
    this.show('warn', summary, detail);
  }

  clear() {
    this.messageService.clear();
  }
}