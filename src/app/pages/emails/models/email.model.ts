export interface Message {
  msgnum: string;
  subject: string;
  personal: string;
  receivedDate: string;
  body: string;
}

export interface MessageDetails {
  body: string
  receivedDate: string
  receiverEmail: string
  senderEmail: string
  subject: string
}
