import { User, UserRepositoryPort } from '@auth/domain';

describe('UserRepositoryPort', () => {
	const repository: jest.Mocked<UserRepositoryPort> = {
		findByEmail: jest.fn(),
		create: jest.fn(),
	};

	describe('findByEmail', () => {
		it('should return null when no user is found', async () => {
			const email = 'test@example.com';
			repository.findByEmail.mockResolvedValueOnce(null);

			const result = await repository.findByEmail(email);

			expect(repository.findByEmail).toHaveBeenCalledWith(email);
			expect(result).toBeNull();
		});

		it('should return a user when a user is found', async () => {
			const email = 'found@example.com';
			const user: User = {
				email: 'found@example.com',
				passwordHash: 'hash',
				provider: 'email-password',
			};

			repository.findByEmail.mockResolvedValueOnce(user);

			const result = await repository.findByEmail(email);

			expect(repository.findByEmail).toHaveBeenCalledWith(email);
			expect(result).toEqual(user);
		});
	});

	describe('create', () => {
		it('should create a user and return it', async () => {
			const user: User = {
				email: 'fake@email.com',
				provider: 'google',
				passwordHash: null,
			};
			repository.create.mockResolvedValueOnce(user);

			const result = await repository.create(user);

			expect(repository.create).toHaveBeenCalledWith(user);
			expect(result).toEqual(user);
		});
	});
});
