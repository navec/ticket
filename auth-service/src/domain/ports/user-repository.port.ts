import { User } from '@auth/domain';

export abstract class UserRepositoryPort {
	abstract findByEmail(email: string): Promise<User | null>;
	abstract create(user: User): Promise<User>;
}
