import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BehaviorSubject, filter, finalize, merge, Observable, of, shareReplay, switchMap, withLatestFrom } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { ProgressSpinner } from 'primeng/progressspinner';

import { MailboxApiService } from './services/email.service';
import { Message, MessageDetails } from './models/email.model';
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
  emails$ = new BehaviorSubject<Email[]>([]);
  selectedMessageMsgnum$ = new BehaviorSubject<string | null>(null);
  selectedFolder$ = new BehaviorSubject<{ emailAddress: string, folder: string } | null>(null);
  newMessage$ = new BehaviorSubject<boolean>(false);
  messages$: Observable<Message[]> = merge(
    this.selectedFolder$,
    this.emails$,
  )
    .pipe(
      switchMap(() => this.selectedFolder$.value
        ? this.mailboxApiService.getMessages$(this.selectedFolder$.value.emailAddress, this.selectedFolder$.value.folder)
        : of([])
      ),
      tap(() => this.loadingStates.messageList = false),
    );
  folders$ = this.selectedFolder$
    .pipe(
      map((value) => this.emails$.value.find(email => email.emailAddress === value?.emailAddress)?.folders ?? [])
    )
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
    moveIntoFolder: false
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
    this.selectedMessageMsgnum$.next(null);
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
        tap((mailboxes) => this.emails$.next(mailboxes)),
        finalize(() => this.loadingStates.mailboxes = false),
      )
      .subscribe();
  }

  handleMessageSubmit(message: MessageCreation) {
    this.loadingStates.sendMessage = true;
    this.mailboxApiService.sendMessage$(message)
      .pipe(
        take(1),
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

  moveIntoFolder(folder: string) {
    this.loadingStates.moveIntoFolder = true;
    this.loadingStates.messageList = true;
    this.mailboxApiService.moveIntoFolder(this.selectedFolder$.value!.emailAddress, this.selectedMessageMsgnum$.value!, this.selectedFolder$.value!.folder, folder)
      .pipe(
        take(1),
        tap(() => {
          this.selectedMessageMsgnum$.next(null);
          this.loadMailboxes();
          this.notificationService.showSuccess('Message have been moved successfully!')
        }),
        finalize(() => {
          this.loadingStates.moveIntoFolder = false;
          this.loadingStates.messageList = true;
        })
      )
      .subscribe();
  }
}
