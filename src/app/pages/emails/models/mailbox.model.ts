export interface Email {
    emailAddress: string;
    folders: string[];
}
export type MailBoxCreation = any;

export interface MessageCreation {
  subject: string;
  folder: string;
  recipientEmail: string;
  senderEmail: string;
  body: string;
}
