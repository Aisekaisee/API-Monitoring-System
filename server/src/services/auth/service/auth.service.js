import config from "../../../shared/config/index.js";
import AppError  from "../../../shared/utils/AppError.js";
import jwt from "jsonwebtoken";
import logger from "../../../shared/config/logger.js";

export class AuthService {
  constructor(userRepository) {
    if (!userRepository) {
      throw new Error("UserRepository is required");
    }
    this.userRepository = userRepository;
  }

  generateToken(user) {
    const { _id, email, username, role, clientId } = user;

    const payload = {
      userId: _id,
      username,
      email,
      role,
      clientId,
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  formatUserResponse(user) {
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password; // Remove password from response
    return userObj;
  }

  async onboardSuperAdmin(superAdminData) {
    // Implementation for onboarding super admin
    try {
      const existingUser = await this.userRepository.findAll();

      // Handle case where super admin already exists
      if (existingUser && existingUser.length > 0) {
        throw new AppError("Super admin onboarding is disabled", 403);
      }

      // Create super admin user
      const user = await this.userRepository.create(superAdminData);

      const token = this.generateToken(user); // Implement token generation logic

      logger.info("Admin onboarded successfully", { username: user.username });

      return {
        user: this.formatUserResponse(user),
        token,
      };
    } catch (error) {
      logger.error("Error onboarding super admin", error);
      throw error;
    }
  }
}
