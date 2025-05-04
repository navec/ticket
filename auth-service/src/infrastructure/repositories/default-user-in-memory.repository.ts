import { User, UserRepositoryPort } from '@auth/domain';
import { DEFAULT_USERS } from '../stores/default-user.store';
import { Injectable } from '@core/decorators';
import { USER_REPOSITORY_IN_MEMORY } from '@auth/shared';

@Injectable(USER_REPOSITORY_IN_MEMORY)
export class UserRepositoryInMemory implements UserRepositoryPort {
	async findByEmail(email: string): Promise<User | null> {
		return DEFAULT_USERS.find((u) => u.email === email) ?? null;
	}
}
