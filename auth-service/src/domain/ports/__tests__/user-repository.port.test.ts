import { UserRepositoryPort } from '@auth/domain';

describe('UserRepositoryPort', () => {
	const repository: jest.Mocked<UserRepositoryPort> = {
		findByEmail: jest.fn(),
	};

	describe('findByEmail', () => {
		it('should return null when no user is found', async () => {
			const email = 'test@example.com';
			repository.findByEmail.mockResolvedValueOnce(null);

			const result = await repository.findByEmail(email);

			expect(repository.findByEmail).toHaveBeenCalledWith(email);
			expect(result).toBeNull();
		});

		it('should return a user object when a user is found', async () => {
			const email = 'found@example.com';
			const user = { email: 'found@example.com', passwordHash: 'hash' };
			repository.findByEmail.mockResolvedValueOnce(user);

			const result = await repository.findByEmail(email);

			expect(repository.findByEmail).toHaveBeenCalledWith(email);
			expect(result).toEqual(user);
		});
	});
});
