import { UserRepositoryInMemory } from '../default-user-in-memory.repository';
import { DEFAULT_USERS } from '../../stores/default-user.store';

describe('UserRepositoryInMemory', () => {
	const repository = new UserRepositoryInMemory();

	describe('findByEmail', () => {
		it('should return a user when one exists with the given email', async () => {
			const existingUser = DEFAULT_USERS[0];
			const user = await repository.findByEmail(existingUser.email);
			expect(user).toEqual(existingUser);
		});

		it('should return null when no user exists with the given email', async () => {
			const user = await repository.findByEmail('nonexistent@example.com');
			expect(user).toBeNull();
		});
	});
});
