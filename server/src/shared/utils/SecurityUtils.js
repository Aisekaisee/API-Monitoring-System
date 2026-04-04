class SecurityUtils {
  static PASSWORD_REQUIREMENTS = {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || "8"),
    requireUppercase:
      (process.env.PASSWORD_REQUIRE_UPPERCASE || "true") === "true",
    requireLowercase:
      (process.env.PASSWORD_REQUIRE_LOWERCASE || "true") === "true",
    requireNumbers: (process.env.PASSWORD_REQUIRE_NUMBERS || "true") === "true",
    requireSymbols: (process.env.PASSWORD_REQUIRE_SYMBOLS || "true") === "true",
  };

  /**
   *
   * @param {string} password
   * @returns {Object} - Validation result with success flag and errors
   */
  static validatePassword(password) {
    const errors = [];
    const requirements = this.PASSWORD_REQUIREMENTS;

    if (password.length < requirements.minLength) {
      errors.push(
        `Password must be at least ${requirements.minLength} characters long.`,
      );
    }
    if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (requirements.requireLowercase && !/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (requirements.requireNumbers && !/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number.");
    }
    if (requirements.requireSymbols && !/[^a-zA-Z0-9]/.test(password)) {
      errors.push("Password must contain at least one symbol.");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }
}

module.exports = SecurityUtils;
