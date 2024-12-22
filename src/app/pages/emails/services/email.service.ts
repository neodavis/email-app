import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Email, MailBoxCreation, MessageCreation } from '../models/mailbox.model';
import { Message, MessageDetails } from '../models/email.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MailboxApiService {
  constructor(private http: HttpClient) {}

  getMailboxes$(): Observable<Email[]> {
    return this.http.get<Email[]>(`/api/v1/users/mailbox`);
  }

  addMailbox$(mailbox: MailBoxCreation): Observable<unknown> {
    return this.http.post(`/api/v1/users/add-account`, mailbox);
  }

  getMessages$(emailAddress: string, folderName: string): Observable<Message[]> {
    return this.http.post(`/api/v1/read/${emailAddress}`, { folderName })
      .pipe(
        map((response: any) => response['data']['List of emails'])
      );
  }

  getMessageByMsgnum$(account: string, folderName: string, msgnum: string): Observable<MessageDetails> {
    return this.http.post(`/api/v1/read/${account}/${msgnum}`, {
      folderName: folderName
    })
      .pipe(
        map((response: any) => response['data']['email'])
      );
  }

  sendMessage$(message: MessageCreation): Observable<any> {
    return this.http.post(`/api/v1/email`, message);
  }

  moveIntoFolder(account: string, msgnum: string, sourceFolder: string, destinationFolderName: string): Observable<any> {
    return this.http.post(`/api/v1/folder/move/${account}/${msgnum}`, {
      sourceFolder,
      destinationFolderName
    });
  }
}
