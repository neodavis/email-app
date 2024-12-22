import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';

import { Email } from '../../models/mailbox.model';
import { Tree } from 'primeng/tree';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-email-list',
  templateUrl: 'email-list.component.html',
  standalone: true,
  imports: [ButtonModule, CommonModule, Tree],
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnChanges {
  @Input() emails: Email[] = [];
  @Input() selectedFolder: { emailAddress: string; folder: string } | null = null;

  @Output() onFolderSelect = new EventEmitter<{ emailAddress: string, folder: string }>();

  nodes: TreeNode[] = []

  ngOnChanges() {
    this.nodes = this.emails.map(email => {
      return {
        label: email.emailAddress,
        type: 'emailAdress',
        expanded: true,
        children: email.folders.map(folder => {
          return {
            label: folder,
            emailAddress: email.emailAddress,
            type: 'folder'
          }
        })
      }
    });
  }
}
