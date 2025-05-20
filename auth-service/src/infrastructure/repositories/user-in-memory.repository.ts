import { Injectable } from '@ticket/core';

import { User, UserRepositoryPort } from '@auth/domain';
import { USER_REPOSITORY_IN_MEMORY } from '@auth/shared';

import { DEFAULT_USERS } from '../stores/default-user.store';

@Injectable(USER_REPOSITORY_IN_MEMORY)
export class UserRepositoryInMemory implements UserRepositoryPort {
	async findByEmail(email: string): Promise<User | null> {
		return DEFAULT_USERS.find((u) => u.email === email) ?? null;
	}

	create(user: User): Promise<User> {
		DEFAULT_USERS.push(user);
		return Promise.resolve(user);
	}
}
