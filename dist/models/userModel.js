import mongoose from "mongoose";
import { USER_ROLES } from "../utils/constant.js";
const UserSchema = new mongoose.Schema({
    firstName: {
        required: [true, "please name is required  "],
        type: String,
    },
    lastName: {
        required: [true, "please name is required  "],
        type: String,
    },
    email: String,
    userId: Number,
    password: String,
    role: {
        type: String,
        enum: Object.values(USER_ROLES),
        default: USER_ROLES.student,
    },
    avatar: String,
    avatarPublicId: String,
    isVerified: {
        type: Boolean,
        enum: [true, false],
        default: "false",
    },
    phoneNumber: String,
    otp: {
        // type: String, // Store the generated OTP for verification
        expiresAt: { type: Date }, // Set expiration for OTP
        value: {
            type: Number,
            default: undefined,
        },
    },
});
export default mongoose.model("Userdev", UserSchema);
//# sourceMappingURL=userModel.js.map