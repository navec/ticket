export abstract class AuthRedirectUrlPort {
	abstract generateRedirectUrl(): Promise<string> | string;
}
