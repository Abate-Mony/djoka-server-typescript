import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError, } from "../errors/customErrors.js";
import User from "../models/userModel.js";
import { USER_ROLES } from "../utils/constant.js";
import { setCookies } from "../utils/cookieUtils.js";
import { 
// generateRandomString,
generateUniqueCharacter, } from "../utils/generateRandomNumbers.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
// import { transporter } from "../utils/sendMailUtils.js";
import { createJWT, sanitizeUser } from "../utils/tokenUtils.js";
export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    const isValidUser = user && (await comparePassword(password, user.password));
    if (!isValidUser)
        throw new UnauthenticatedError("invalid credentials");
    const token = createJWT({ userId: user.userId, role: user.role });
    const oneDay = 1000 * 60 * 60 * 24;
    res
        .cookie("token", token, setCookies(oneDay))
        .status(StatusCodes.OK)
        .json({ msg: "user logged in", token, user: sanitizeUser(user) });
};
// this controller helps to create user in the app
export const register = async (req, res) => {
    const isFirstAccount = (await User.countDocuments()) === 0; //let the first user in our system be the admin
    const userRole = req.body.role; //this helps admin to create another employees or proffessour but this can be change on the long run
    req.body.role = isFirstAccount
        ? USER_ROLES.admin
        : userRole || USER_ROLES.student;
    const { password } = req.body;
    const hashedPassword = await hashPassword(password);
    req.body.password = hashedPassword;
    const userId = await generateUniqueCharacter({
        //since i dont want to user mongodb id create a function that returns a unique id that can me memorize
        Model: User,
        type: "number",
        length: 10,
    });
    // for the main time we are not validating the user using otp sent to thier mail we do that in v1.0.1
    // req.body.otp = {
    //   value: generateRandomString({ type: "number", length: 4 }),
    //   expiresAt: dayjs().add(10, "minute"),
    // };
    // const emailsList = [email];
    // console.log("this the user id", userId);
    req.body.userId = userId;
    const user = await User.create({
        ...req.body,
    });
    const token = createJWT({ userId: user.userId, role: user.role });
    const oneDay = 1000 * 60 * 60 * 24;
    res
        .cookie("token", token, setCookies(oneDay))
        .status(StatusCodes.OK)
        .json({ msg: "user logged in", token, user: sanitizeUser(user) });
};
// for the main time we are not validating the user using otp sent to thier mail we do that in v1.0.1
export const verifiedUser = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        throw new BadRequestError("oops email or otp is required");
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
        throw new BadRequestError(" Invalid email OR OTP.");
    }
    console.log("user with otp", user.otp.value);
    // Check if OTP matches and is not expired
    if (!user.otp.value || user.otp.value != otp) {
        throw new BadRequestError("otp doesnot match");
    }
    if (dayjs(user.otp.expiresAt).diff(new Date(), "hour") > 0) {
        throw new BadRequestError("oops opt expired");
    }
    // OTP verification successful, update user's verified flag
    user.isVerified = true;
    user.otp.value = undefined; // Remove OTP from user object
    await user.save();
    // User verified successfully, send response
    // res.json({ message: "Account verified successfully!" });
    const token = createJWT({
        userId: user.userId,
        role: user.role,
    });
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie("token", token, setCookies(oneDay));
    res.status(StatusCodes.OK).json({ msg: "user logged in", token });
};
// since we are building a secure application we handle the user logout functionality here
export const logout = (_, res) => {
    res.cookie("token", "logout", setCookies());
    res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};
//# sourceMappingURL=authController.js.map