import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Email, MailBoxCreation, MessageCreation } from '../models/mailbox.model';
import { Message, MessageDetails } from '../models/email.model';
import { API_BASE_URL } from '../../../tokens/base-url.token';

@Injectable({
  providedIn: 'root'
})
export class MailboxApiService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiBaseUrl: string,
  ) {}

  getMailboxes$(): Observable<Email[]> {
    return this.http.get<Email[]>(`${this.apiBaseUrl}/api/v1/users/mailbox`);
  }

  addMailbox$(mailbox: MailBoxCreation) {
    return this.http.post(`${this.apiBaseUrl}/api/v1/users/add-account`, mailbox);
  }

  getMessages$(emailAddress: string, folderName: string): Observable<Message[]> {
    return this.http.post(`${this.apiBaseUrl}/api/v1/read/${emailAddress}`, { folderName })
      .pipe(
        map((response: any) => response['data']['List of emails'])
      );
  }

  getMessageByMsgnum$(account: string, folderName: string, msgnum: string): Observable<MessageDetails> {
    return this.http.post(`${this.apiBaseUrl}/api/v1/read/${account}/${msgnum}`, {
      folderName: folderName
    })
      .pipe(
        map((response: any) => response['data']['email'])
      );
  }

  sendMessage$(message: MessageCreation) {
    return this.http.post(`${this.apiBaseUrl}/api/v1/email`, message);
  }

  moveIntoFolder(account: string, msgnum: string, sourceFolder: string, destinationFolderName: string) {
    return this.http.post(`${this.apiBaseUrl}/api/v1/folder/move/${account}/${msgnum}`, {
      sourceFolder,
      destinationFolderName
    });
  }

  saveToDraft$(message: MessageCreation) {
    return this.http.post(`${this.apiBaseUrl}/api/v1/folder/add-to-draft`, message);
  }

  createFolder$(account: string, folderName: string) {
    return this.http.post(`${this.apiBaseUrl}/api/v1/folder/create/${account}/${folderName}`, {});
  }
}
