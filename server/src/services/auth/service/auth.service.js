export class AuthService {
    constructor(userRepository) {
        if (!userRepository) {
            throw new Error("UserRepository is required");
        }
        this.userRepository = userRepository;
    }

    async onboardSuperAdmin(){}
}