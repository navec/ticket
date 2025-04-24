import { UserLogin } from '../../business/entities/user-login.entity';
import { UserProfile } from '../../business/entities/user-profile.entity';

export interface AuthRepository {
	create({ email, password }: UserLogin): UserProfile;
	findUserLoginByEmail(email: string): UserLogin | null;
}
