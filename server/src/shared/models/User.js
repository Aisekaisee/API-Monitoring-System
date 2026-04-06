import mongoose from "mongoose";
import SecurityUtils from "../utils/SecurityUtils";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
      validate: {
        validator: function (userName) {
          return /^[a-zA-Z0-9]+$/.test(userName); // Alphanumeric only
        },
        message: "Please enter a valid username (alphanumeric only)",
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (email) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email); // Email format
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      validator: {
        validator: function (password) {
          if (
            this.isModified("password") &&
            password &&
            !password.startsWith("$2a$")
          ) {
            // Only validate if password is modified and not already hashed
            const validationResult = SecurityUtils.validatePassword(password);
            return validationResult.success;
          }
          return true; // Skip validation if password is not modified or already hashed
        },
        message: function (props) {
          if (props.value && !props.value.startsWith("$2a$")) {
            const validationResult = SecurityUtils.validatePassword(
              props.value,
            );
            return validationResult.errors.join(".");
          }
          return "Password is required and must meet the validation requirements.";
        },
      },
    },
    role: {
      type: String,
      enum: ["super_admin", "client_admin", "client_viewer"],
      default: "client_viewer",
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: function () {
        return this.role !== "super_admin"; // clientId is required for non-super_admin roles
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    permissions: {
      canCreateApiKeys: {
        type: Boolean,
        default: false,
      },
      canManageUsers: {
        type: Boolean,
        default: false,
      },
      canViewAnalytics: {
        type: Boolean,
        default: false,
      },
      canExportData: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
);

userSchema.pre("save", async function (next) {
  if(!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.index({clientId: 1, isActive: 1 }, { unique: true });
userSchema.index({role :1})

const User = mongoose.model("User", userSchema);

export default User;
