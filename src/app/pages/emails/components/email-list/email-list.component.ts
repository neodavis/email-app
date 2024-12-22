import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { TreeNode } from 'primeng/api';

import { Email } from '../../models/mailbox.model';
import { Tree } from 'primeng/tree';
import { InputText } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-email-list',
  templateUrl: 'email-list.component.html',
  standalone: true,
  imports: [ButtonModule, CommonModule, Tree, InputText, ReactiveFormsModule, FormsModule],
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnChanges {
  @Input() emails: Email[] = [];
  @Input() selectedFolder: { emailAddress: string; folder: string } | null = null;
  @Input() newFolderLoading = false;

  @Output() onFolderSelect = new EventEmitter<{ emailAddress: string, folder: string }>();
  @Output() onNewFolder = new EventEmitter<{ emailAddress: string, folder: string }>();

  nodes: TreeNode[] = []
  newFolderName = '';

  ngOnChanges() {
    this.nodes = this.emails.map(email => {
      return {
        label: email.emailAddress,
        type: 'emailAdress',
        expanded: true,
        children: [
          ...email.folders.map(folder => ({ label: folder, emailAddress: email.emailAddress, type: 'folder' })),
          { label: 'Add Folder', emailAddress: email.emailAddress, type: 'newFolder' }
        ]
      }
    });
  }
}
