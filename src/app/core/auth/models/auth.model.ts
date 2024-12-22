export interface AuthenticationRequest {
  login: string;
  password: string;
}

export interface AuthenticationResponse {
  token: string;
  type: string;
  algorithm: string;
  expires: Date;
}

export interface UserCreationDto {
  login: string;
  password: string;
}

export interface ErrorResponse {
  timeStamp: Date;
  message: string;
}

export interface MailBoxCreation {
  emailAddress: string;
  accessSmtp: string;
}

export interface MailBox {
  accountId: number;
  user: User;
  emailAddress: string;
  accessSmtp: string;
  emailConfiguration: 'GMAIL' | 'OUTLOOK' | 'UKRNET' | 'YAHOO';
}

export interface User {
  id: number;
  login: string;
  password?: string;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  authorities: GrantedAuthority[];
}

interface GrantedAuthority {
  authority: string;
}