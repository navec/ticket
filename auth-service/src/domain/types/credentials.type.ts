export type EmailPasswordCredentials = { email: string; password: string };
export type GoogleCredentials = { code: string };

export type Credentials = EmailPasswordCredentials | GoogleCredentials;
