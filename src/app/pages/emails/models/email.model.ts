export interface Message {
  msgnum: string;
  subject: string;
  personal: string;
  receivedDate: Date;
  body: string;
}

export interface MessageDetails {
  body: string
  receivedDate: Date
  receiverEmail: string
  senderEmail: string
  subject: string
}
