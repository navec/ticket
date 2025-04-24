import { Injectable } from 'core';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
	async hashPassword(password: string): Promise<string> {
		return createHash('sha256').update(password, 'utf8').digest('hex');
	}

	async validatePassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		const currentPwdHashed = await this.hashPassword(password);
		return currentPwdHashed === hashedPassword;
	}
}
