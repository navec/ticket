export type LocalCredentials = { email: string; password: string };
export type GoogleCredentials = { code: string };

export type Credentials = LocalCredentials | GoogleCredentials;
