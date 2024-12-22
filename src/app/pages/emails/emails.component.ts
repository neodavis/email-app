import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, filter, finalize, Observable, of, shareReplay, switchMap, withLatestFrom } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ProgressSpinner } from 'primeng/progressspinner';

import { MailboxApiService } from './services/email.service';
import { Message } from './models/email.model';
import { Email, MessageCreation } from './models/mailbox.model';
import { MailboxFormComponent } from './components/mailbox-form/mailbox-form.component';
import { MessagePreviewComponent } from './components/message-preview/message-preview.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { EmailListComponent } from './components/email-list/email-list.component';
import { MessageFormComponent } from './components/message-form/message-form.component';
import { NotificationService } from '../../shared/ui/services/notification.service';

@Component({
  selector: 'app-emails',
  standalone: true,
  imports: [CommonModule, EmailListComponent, ButtonModule, MessagePreviewComponent, EmailListComponent, MessageListComponent, MessageFormComponent, ProgressSpinner],
  templateUrl: 'emails.component.html',
  styleUrl: 'emails.component.scss',
})
export class EmailsComponent implements OnInit {
  emails: Email[] = [];
  selectedMessageMsgnum$ = new BehaviorSubject<string | null>(null);
  selectedFolder$ = new BehaviorSubject<{ emailAddress: string, folder: string } | null>(null);
  newMessage$ = new BehaviorSubject<boolean>(false);
  messages$: Observable<Message[]> = this.selectedFolder$
    .pipe(
      switchMap((value) => value
        ? this.mailboxApiService.getMessages$(value.emailAddress, value.folder)
        : of([])
      ),
      tap(() => this.loadingStates.messageList = false),
    );
  selectedMessage$ = this.selectedMessageMsgnum$
    .pipe(
      withLatestFrom(this.selectedFolder$),
      switchMap(([msgnum, selectedFolder]) => msgnum && selectedFolder
        ? this.mailboxApiService.getMessageByMsgnum$(selectedFolder.emailAddress, selectedFolder.folder, msgnum)
        : of(null)
      ),
      shareReplay({ bufferSize: 1, refCount: true }),
      tap(() => {
        this.loadingStates.messageDetails = false
        this.changeDetectorRef.detectChanges()
      }),
    )
  loadingStates = {
    mailboxes: false,
    messageList: false,
    messageDetails: false,
    sendMessage: false,
    draftMessage: false,
  };

  private ref: DynamicDialogRef | undefined;

  constructor(
    private dialogService: DialogService,
    private mailboxApiService: MailboxApiService,
    private changeDetectorRef: ChangeDetectorRef,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.loadMailboxes();
  }

  handleFolderSelect(folder: { emailAddress: string, folder: string }) {
    this.selectedFolder$.next(folder);
    this.newMessage$.next(false);
    this.loadingStates.messageList = true;
  }

  handleMessageSelect(message: Message) {
    this.loadingStates.messageDetails = true;
    this.changeDetectorRef.detectChanges()
    this.selectedMessageMsgnum$.next(message.msgnum);
    this.newMessage$.next(false);
  }

  showAddMailboxDialog() {
    this.ref = this.dialogService.open(MailboxFormComponent, {
      header: 'Add New Mailbox',
      width: '400px',
      closable: true,
    });

    this.ref.onClose
      .pipe(
        take(1),
        filter(Boolean),
        switchMap((mailbox) => this.mailboxApiService.addMailbox$(mailbox)),
        tap(() => {
          this.loadMailboxes();
          this.notificationService.showSuccess('Mailbox added successfully!')
        }),
      )
      .subscribe();
  }

  showAddMessage() {
    this.selectedMessageMsgnum$.next(null)
    this.newMessage$.next(true);
  }

  loadMailboxes() {
    this.loadingStates.mailboxes = true;
    this.mailboxApiService.getMailboxes$()
      .pipe(
        take(1),
        tap((mailboxes) => this.emails = mailboxes),
        finalize(() => this.loadingStates.mailboxes = false),
      )
      .subscribe();
  }

  handleMessageSubmit(message: MessageCreation) {
    this.loadingStates.sendMessage = true;
    this.mailboxApiService.sendMessage$(message)
      .pipe(
        take(1),
        switchMap((createdMessage) => this.mailboxApiService.moveIntoFolder(message.senderEmail, createdMessage.msgnum, createdMessage.folder, message.folder)),
        tap(() => {
          this.newMessage$.next(false);
          this.loadMailboxes();
          this.notificationService.showSuccess('Message have been sent successfully!')
        }),
        finalize(() => this.loadingStates.sendMessage = false)
      )
      .subscribe();
  }

  handleMessageDraftSubmit(message: MessageCreation) {
    this.loadingStates.draftMessage = true;
    this.mailboxApiService.saveToDraft$(message)
      .pipe(
        take(1),
        tap(() => {
          this.newMessage$.next(false);
          this.loadMailboxes();
          this.notificationService.showSuccess('Message saved into draft!')
        }),
        finalize(() => this.loadingStates.draftMessage = false)
      )
      .subscribe();
  }
}
