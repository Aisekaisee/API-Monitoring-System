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

    // Check for common weak passwords (this is a very basic check, consider using a more comprehensive list)

    const weakPasswords = [
      "password", "123456", "12345678", "qwerty", "abc123","welcome", "letmein", "admin", "monkey", "login", "1234", "12345", "123456789","1234567", "password1", "123123", "iloveyou", "1q2w3e4r", "000000", "qwertyuiop", "asdfghjkl", "zxcvbnm", "123321", "password123", "1qaz2wsx", "qwerty123", "1q23qwe", "123qwe", "abc123456", "password!", "1234567890", "12345678", "123456789", "1234567", "1234567890", "123456789", "12345678", "1234567", "1234567890", "123456789", "12345678", "1234567", "1234567890", "123456789", "12345678", "1234567", "password1", "password!", "password123", "password2024", "1234567890", "12345678", "123456789", "1234567", "1234567890", "123456789", "12345678", "1234567", "1234567890", "123456789", "12345678", "1234567"
    ];

    if (weakPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common and easily guessable.");
    }

    return {
      success: errors.length === 0,
      errors,
    };
  }
}

module.exports = SecurityUtils;
