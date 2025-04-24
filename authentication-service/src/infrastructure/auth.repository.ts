import { Injectable } from 'core';
import { AuthRepository } from '../business/interfaces/user.repository';
import { UserLogin } from '../business/entities/user-login.entity';
import { UserProfile } from '../business/entities/user-profile.entity';

@Injectable()
export class AuthRepositoryInMemory implements AuthRepository {
	private users: Record<string, { email: string; password: string }> = {
		'navecbatchi@gmail.com': {
			email: 'navecbatchi@gmail.com',
			password:
				'0263123ebcad8a480209d7663a46494c06efc98cf21fbcf3d1cf283eb3b832b7',
		},
	};

	create({ email, password }: UserLogin): UserProfile {
		this.users[email] = { email, password };
		return { email };
	}

	findUserLoginByEmail(email: string): UserLogin | null {
		return this.users[email] ?? null;
	}
}
